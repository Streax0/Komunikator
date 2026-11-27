<?php
header("Content-Type: application/json; charset=utf-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function signalResponse($status, $data)
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

if (!isset($_SESSION["user_id"])) {
    signalResponse(401, ["error" => "Musisz być zalogowany."]);
}

$request = json_decode(file_get_contents("php://input"), true);
$action = is_array($request) ? ($request["action"] ?? "") : "";
$roomId = is_array($request) ? filter_var($request["room_id"] ?? null, FILTER_VALIDATE_INT) : false;

if (!in_array($action, ["send", "poll"], true) || $roomId === false || $roomId < 1) {
    signalResponse(400, ["error" => "Nieprawidłowe żądanie sygnalizacji."]);
}

require_once __DIR__ . "/../db/db.php";

try {
$userId = (int) $_SESSION["user_id"];
$stmt = $conn->prepare(
    "SELECT 1 FROM uczestnicy_pokoju WHERE pokoj_id = ? AND uzytkownik_id = ?"
);
$stmt->bind_param("ii", $roomId, $userId);
$stmt->execute();
$isMember = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$isMember) {
    signalResponse(403, ["error" => "Nie należysz do tego pokoju."]);
}

if ($action === "send") {
    $recipientId = is_array($request) ? filter_var($request["recipient_id"] ?? null, FILTER_VALIDATE_INT) : false;
    $type = $request["type"] ?? "";
    $payload = $request["payload"] ?? null;

    if ($recipientId === false || $recipientId < 1 || $recipientId === $userId
        || !in_array($type, ["offer", "answer", "ice"], true) || !is_array($payload)) {
        signalResponse(400, ["error" => "Nieprawidłowe dane sygnalizacji."]);
    }

    $payloadJson = json_encode($payload);
    if ($payloadJson === false || strlen($payloadJson) > 16000) {
        signalResponse(400, ["error" => "Dane sygnalizacji są nieprawidłowe lub za duże."]);
    }

    $stmt = $conn->prepare(
        "SELECT COUNT(*) AS liczba FROM uczestnicy_pokoju WHERE pokoj_id = ? AND uzytkownik_id IN (?, ?)"
    );
    $stmt->bind_param("iii", $roomId, $userId, $recipientId);
    $stmt->execute();
    $participants = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ((int) $participants["liczba"] !== 2) {
        signalResponse(403, ["error" => "Odbiorca nie należy do tego pokoju."]);
    }

    $conn->query("DELETE FROM sygnaly_p2p WHERE utworzono < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)");

    $stmt = $conn->prepare(
        "INSERT INTO sygnaly_p2p (pokoj_id, nadawca_id, odbiorca_id, typ, dane) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("iiiss", $roomId, $userId, $recipientId, $type, $payloadJson);
    $stmt->execute();
    $stmt->close();

    signalResponse(201, ["success" => true]);
}

$afterId = is_array($request) ? filter_var($request["after_id"] ?? 0, FILTER_VALIDATE_INT) : false;
if ($afterId === false || $afterId < 0) {
    signalResponse(400, ["error" => "Nieprawidłowy identyfikator sygnału."]);
}

$stmt = $conn->prepare(
    "SELECT id, nadawca_id, typ, dane FROM sygnaly_p2p
    WHERE pokoj_id = ? AND odbiorca_id = ? AND id > ?
    ORDER BY id ASC LIMIT 50"
);
$stmt->bind_param("iii", $roomId, $userId, $afterId);
$stmt->execute();
$result = $stmt->get_result();
$signals = [];

while ($row = $result->fetch_assoc()) {
    $signals[] = [
        "id" => (int) $row["id"],
        "sender_id" => (int) $row["nadawca_id"],
        "type" => $row["typ"],
        "payload" => json_decode($row["dane"], true)
    ];
}

$stmt->close();
signalResponse(200, ["success" => true, "signals" => $signals]);
} catch (mysqli_sql_exception $exception) {
    error_log("Nie udało się obsłużyć sygnalizacji P2P: " . $exception->getMessage());
    signalResponse(500, ["error" => "Nie udało się obsłużyć sygnalizacji."]);
}
