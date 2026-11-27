<?php
require_once './db/db.php';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header("Location: logowanie.php");
    exit;
}

if (empty($_SESSION['settings_csrf'])) {
    $_SESSION['settings_csrf'] = bin2hex(random_bytes(32));
}

$settings = [
    'aktywnosc' => 'online',
    'motyw' => 0,
    'powiadomienia' => 1,
];

$stmt = $conn->prepare(
    "SELECT aktywnosc, motyw, powiadomienia FROM ustawienia WHERE id_uzytkownika = ?"
);
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$savedSettings = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($savedSettings) {
    if ($savedSettings['aktywnosc'] !== null) {
        $settings['aktywnosc'] = $savedSettings['aktywnosc'];
    }
    if ($savedSettings['motyw'] !== null) {
        $settings['motyw'] = (int) $savedSettings['motyw'];
    }
    if ($savedSettings['powiadomienia'] !== null) {
        $settings['powiadomienia'] = (int) $savedSettings['powiadomienia'];
    }
}
?>


<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message</title>
    <meta name="description" content="Komunikator na praktyki; Damian , Wujek Luki i Piotruc">
    <meta name="csrf-token" content="<?= htmlspecialchars($_SESSION['settings_csrf'], ENT_QUOTES, 'UTF-8') ?>">
    <link rel="stylesheet" href="styles/ustawienia.css">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <script src="scripts/theme.js"></script>
</head>
<body>
    <nav>
        <div class="logo"><img src="navikona.png" alt=""></div>
        <ol>
            <li class="active">
                <a href="index.php">Strona Głowna </a>
            </li>
            <li class="active">
                <a href="#">ex2 </a>
            </li>
            <li class="active">
                <a href="#">ex3</a>
            </li>
            <li class="right">
                <label class="switch">
                    <input class="theme-toggle" type="checkbox" aria-label="Włącz motyw ciemny">
                    <span class="slider round"></span>
                </label>
            </li>
            <li class="right">
                <a href="wyloguj.php">Wyloguj</a>
            </li>
            <li class="right">
                <input type="text" placeholder="⌕ Wyszukaj czat">
            </li>
            <li id="burger" class="right">
                <button class="burger-toggle" type="button" aria-label="Otwórz menu"
                    aria-controls="menu-div" aria-expanded="false">
                    <span></span>
                </button>
            </li>
        </ol>
    </nav>
    <div id="menu-div" aria-hidden="true">
        <a href="index.php">Strona główna</a>
        <a href="settings.php">Ustawienia</a>
        <a href="wyloguj.php">Wyloguj</a>
    </div>
    <div id="bg-div"></div>
    <section id="left">
        <div id="menu">
            <p>Ustawienia MENU</p>
        </div>
        <ul>
            <li><button id="menub" value="1">Ustawienia konta</button></li>
            <li><button id="menub" value="2">Ustawienia prywatności</button></li>
            <li><button id="menub" value="3">Ustawienia powiadomień</button></li>
            <li><button id="menub" value="4">Ustawienia wyglądu</button></li>

        </ul>
    </section>
    <main>

    </main>
    <section id="right">
        
    </section>
    <footer>
        <p>BACIATA - twój komuniaktor Contact our support at                         <a href="https://cssetti.pl/download" target="_blank">support.baskamessage.com</a></p>
        <a href="indexgwint.php" target="_blank" class="gwint">content</a>
    </footer>
    <script>
        window.savedSettings = <?= json_encode($settings, JSON_UNESCAPED_UNICODE) ?>;
    </script>
</body>
<script src="scripts/settings.js"></script>
<script src="scripts/index.js"></script>
</html>