<?php
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
</head>
<body>
    <nav>
        <div class="logo" style="background-image: url('logo.png');"><img src="logo.png" alt=""></div>
        <ol>
            <li class="active">
                <a href="#">ex1 </a>
            </li>
            <li class="active">
                <a href="#">ex2 </a>
            </li>
            <li class="active">
                <a href="#">ex3</a>
            </li>
            <li class="right">
                <a href="wyloguj.php">Wyloguj</a>
            </li>
            <li class="right">
                <a href="settings.php">&#9881</a>
            </li>
            <li class="right">
                <input type="text" placeholder="Wyszukaj czat">
            </li>
        </ol>
    </nav>
    <section id="left">

    </section>
    <main>

    </main>
    <section id="right">
        
    </section>
    <footer>
        <p>BACAITA - twój komuniaktor Contact our support at                         <a href="https://cssetti.pl/download" target="_blank">support.baskamessage.com</a></p>
        <a href="indexgwint.php" target="_blank" class="gwint">content</a>
    </footer>
</body>
<script src="scripts/index.js"></script>
</html>