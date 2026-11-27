<?php
header("Content-Type: application/json; charset=utf-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function roomResponse($status, $data)
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

if (!isset($_SESSION["user_id"])) {
    roomResponse(401, ["error" => "Musisz być zalogowany."]);
}

$room = json_decode(file_get_contents("php://input"), true);
$action = is_array($room) ? ($room["action"] ?? "") : "";
$code = is_array($room) ? ($room["code"] ?? "") : "";

if (!is_string($action) || !in_array($action, ["create", "join"], true)) {
    roomResponse(400, ["error" => "Nieprawidłowa akcja."]);
}

if (!is_string($code)) {
    roomResponse(400, ["error" => "Nieprawidłowy kod pokoju."]);
}

$code = strtoupper(trim($code));
if (!preg_match('/^[A-Z0-9]{8}$/', $code)) {
    roomResponse(400, ["error" => "Kod pokoju musi mieć 8 znaków."]);
}

require_once __DIR__ . "/../db/db.php";

$userId = (int) $_SESSION["user_id"];
$transactionStarted = false;

try {
    $conn->begin_transaction();
    $transactionStarted = true;

    if ($action === "create") {
        $delete = $conn->prepare("DELETE FROM pokoje WHERE utworzyl_id = ?");
        $delete->bind_param("i", $userId);
        $delete->execute();
        $delete->close();

        $stmt = $conn->prepare("INSERT INTO pokoje (kod, utworzyl_id) VALUES (?, ?)");
        $stmt->bind_param("si", $code, $userId);
        $stmt->execute();
        $roomId = (int) $conn->insert_id;
        $stmt->close();

        $member = $conn->prepare(
            "INSERT INTO uczestnicy_pokoju (pokoj_id, uzytkownik_id, rola) VALUES (?, ?, 'host')"
        );
        $member->bind_param("ii", $roomId, $userId);
        $member->execute();
        $member->close();

        $conn->commit();
        roomResponse(201, [
            "success" => true,
            "room_id" => $roomId,
            "code" => $code,
            "role" => "host",
            "peer_id" => null
        ]);
    }

    $stmt = $conn->prepare("SELECT id, utworzyl_id FROM pokoje WHERE kod = ? FOR UPDATE");
    $stmt->bind_param("s", $code);
    $stmt->execute();
    $roomData = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$roomData) {
        $conn->rollback();
        $transactionStarted = false;
        roomResponse(404, ["error" => "Nie znaleziono pokoju."]);
    }

    $roomId = (int) $roomData["id"];
    $hostId = (int) $roomData["utworzyl_id"];

    if ($hostId === $userId) {
        $conn->rollback();
        $transactionStarted = false;
        roomResponse(400, ["error" => "Nie możesz dołączyć do własnego pokoju."]);
    }

    $stmt = $conn->prepare(
        "SELECT uzytkownik_id FROM uczestnicy_pokoju WHERE pokoj_id = ? AND rola = 'guest' FOR UPDATE"
    );
    $stmt->bind_param("i", $roomId);
    $stmt->execute();
    $guest = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($guest && (int) $guest["uzytkownik_id"] !== $userId) {
        $conn->rollback();
        $transactionStarted = false;
        roomResponse(409, ["error" => "Pokój jest już zajęty."]);
    }

    if (!$guest) {
        $member = $conn->prepare(
            "INSERT INTO uczestnicy_pokoju (pokoj_id, uzytkownik_id, rola) VALUES (?, ?, 'guest')"
        );
        $member->bind_param("ii", $roomId, $userId);
        $member->execute();
        $member->close();
    }

    $conn->commit();
    roomResponse(200, [
        "success" => true,
        "room_id" => $roomId,
        "code" => $code,
        "role" => "guest",
        "peer_id" => $hostId
    ]);
} catch (mysqli_sql_exception $exception) {
    if ($transactionStarted) {
        $conn->rollback();
    }

    error_log("Nie udało się obsłużyć pokoju: " . $exception->getMessage());
    if ($exception->getCode() === 1062) {
        roomResponse(409, ["error" => "Nie udało się utworzyć unikalnego pokoju. Spróbuj ponownie."]);
    }

    roomResponse(500, ["error" => "Nie udało się obsłużyć pokoju."]);
}
