<?php
require_once './db/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=utf-8');

function jsonResponse(int $status, array $data): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    jsonResponse(401, ['error' => 'Musisz być zalogowany.']);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    jsonResponse(400, ['error' => 'Nieprawidłowe dane.']);
}

$csrfToken = $input['csrf_token'] ?? '';
if (
    empty($_SESSION['settings_csrf']) ||
    !is_string($csrfToken) ||
    !hash_equals($_SESSION['settings_csrf'], $csrfToken)
) {
    jsonResponse(403, ['error' => 'Nieprawidłowy token formularza.']);
}

$userId = (int) $_SESSION['user_id'];
$action = $input['action'] ?? '';

if ($action === 'settings') {
    $allowedActivity = ['online', 'zaraz_wracam', 'nie_przeszkadzac', 'offline', 'prywatne'];

    $query = "SELECT id, aktywnosc, motyw, powiadomienia FROM ustawienia WHERE id_uzytkownika = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $current = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    $activity = $current['aktywnosc'] ?? 'online';
    $theme = $current['motyw'] ?? 0;
    $notifications = $current['powiadomienia'] ?? 1;

    if (array_key_exists('aktywnosc', $input)) {
        $activity = $input['aktywnosc'];
        if (!in_array($activity, $allowedActivity, true)) {
            jsonResponse(400, ['error' => 'Nieprawidłowa wartość aktywności.']);
        }
    }
    if (array_key_exists('motyw', $input)) {
        $theme = (int) $input['motyw'];
        if ($theme !== 0 && $theme !== 1) {
            jsonResponse(400, ['error' => 'Nieprawidłowy motyw.']);
        }
    }
    if (array_key_exists('powiadomienia', $input)) {
        $notifications = (int) $input['powiadomienia'];
        if ($notifications !== 0 && $notifications !== 1) {
            jsonResponse(400, ['error' => 'Nieprawidłowa wartość powiadomień.']);
        }
    }

    if ($current) {
        $stmt = $conn->prepare(
            "UPDATE ustawienia SET aktywnosc = ?, motyw = ?, powiadomienia = ? WHERE id_uzytkownika = ?"
        );
        $stmt->bind_param("siii", $activity, $theme, $notifications, $userId);
    } else {
        $stmt = $conn->prepare(
            "INSERT INTO ustawienia (id_uzytkownika, aktywnosc, motyw, powiadomienia) VALUES (?, ?, ?, ?)"
        );
        $stmt->bind_param("isii", $userId, $activity, $theme, $notifications);
    }

    $stmt->execute();
    $stmt->close();
    jsonResponse(200, ['success' => true]);
}

if ($action === 'password') {
    $oldPassword = $input['old_password'] ?? '';
    $newPassword = $input['new_password'] ?? '';

    if (!is_string($oldPassword) || !is_string($newPassword) || strlen($newPassword) < 8) {
        jsonResponse(400, ['error' => 'Nowe hasło musi mieć co najmniej 8 znaków.']);
    }

    $stmt = $conn->prepare("SELECT haslo_hash FROM uzytkownicy WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$user || !password_verify($oldPassword, $user['haslo_hash'])) {
        jsonResponse(400, ['error' => 'Stare hasło jest nieprawidłowe.']);
    }

    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE uzytkownicy SET haslo_hash = ? WHERE id = ?");
    $stmt->bind_param("si", $newHash, $userId);
    $stmt->execute();
    $stmt->close();

    jsonResponse(200, ['success' => true]);
}

jsonResponse(400, ['error' => 'Nieznana akcja.']);
