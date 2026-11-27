<?php
header("Content-Type: application/json; charset=utf-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "Musisz być zalogowany."]);
    exit;
}

$room = json_decode(file_get_contents("php://input"), true);
$code = is_array($room) ? ($room["code"] ?? "") : "";

if (!is_string($code) || !preg_match('/^[A-Z0-9]{8}$/', $code)) {
    http_response_code(400);
    echo json_encode(["error" => "Nieprawidłowy kod pokoju."]);
    exit;
}

require_once __DIR__ . "/../db/db.php";

$userId = (int) $_SESSION["user_id"];
$transactionStarted = false;

try {
    $conn->begin_transaction();
    $transactionStarted = true;

    $delete = $conn->prepare("DELETE FROM pokoje WHERE utworzyl_id = ?");
    $delete->bind_param("i", $userId);
    $delete->execute();
    $delete->close();

    $stmt = $conn->prepare("INSERT INTO pokoje (kod, utworzyl_id) VALUES (?, ?)");
    $stmt->bind_param("si", $code, $userId);
    $stmt->execute();
    $stmt->close();
    $conn->commit();

    echo json_encode(["success" => true, "code" => $code]);
} catch (mysqli_sql_exception $exception) {
    if ($transactionStarted) {
        $conn->rollback();
    }
    error_log("Nie udało się zapisać pokoju: " . $exception->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Nie udało się zapisać pokoju."]);
}
