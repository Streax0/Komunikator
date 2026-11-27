<?php
require_once './db/db.php';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header("Location: logowanie.php");
    exit;
}
?>


<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message</title>
    <meta name="description" content="Komunikator na praktyki; Damian , Wujek Luki i Piotruc">
    <link rel="stylesheet" href="styles/style.css">
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
                <a href="settings.php">&#9881</a>
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
        <div class="chat" onclick="function wyswietlczat()">
            <a href=""></a>
            <p id="placeholder">Twoje Ostatnie Chaty</p>
        </div>
    </section>
    <main>

    </main>
    <section id="right">
        
    </section>
    <footer>
        <p>BACIATA - twój komuniaktor Contact our support at                         <a href="https://cssetti.pl/download" target="_blank">support.baskamessage.com</a></p>
        <a href="indexgwint.php" target="_blank" class="gwint">content</a>
    </footer>
</body>
<script src="scripts/index.js"></script>
</html>