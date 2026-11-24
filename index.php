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
            <li>
                <a href="wyloguj.php">Wyloguj</a>
            </li>
            <li id="settings">
                <a href="settings.php">&#9881</a>
            </li>
        </ol>
    </nav>
    <header>
        <input type="text" placeholder="Wyszukaj czat">
    </header>
    <section id="left">

    </section>
    <main>

    </main>
    <section id="right">
        
    </section>
    <footer>
        <p>BACAITA - twój komuniaktor</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi tempore tenetur praesentium a, facilis culpa quae quaerat accusamus iusto officiis est cupiditate similique ex numquam iste ducimus aut dolore voluptas.</p>
        <a href="indexgwint.php" target="_blank" class="gwint">content</a>
    </footer>
</body>
<script src="scripts/index.js"></script>
</html>