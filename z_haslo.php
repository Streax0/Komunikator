<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bląd połączenia z bazą danych</title>
    <link rel="stylesheet" href="./styles/db-error.css">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
    <main class="login-page">
        <section class="login-card" aria-labelledby="login-title">
            <p id="blad">Strona w Trakcie Budowania</p>
            <blockquote>
                <q id="guote">Wartałoby nadbudować zadanie. Biermy się do roboty! ~ BW</q>
            </blockquote>
            <button id="przycisk">Powrót do wcześniejszej Strony</button>
        </section>

        <aside class="login-intro" aria-label="Informacje o komunikatorze">
            <div class="intro-content">
                <p class="eyebrow">Twój komunikator</p>
                <h2>Rozmawiaj.<br><strong>Dziel się.</strong><br>Bądź blisko.</h2>
                <p>Wszystkie ważne rozmowy w jednym, bezpiecznym miejscu.</p>
            </div>
            <div class="intro-icon" aria-hidden="true"></div>
            <span class="intro-decoration decoration-one" aria-hidden="true"></span>
            <span class="intro-decoration decoration-two" aria-hidden="true"></span>
        </aside>
    </main>
    </body>
    <script>
        const naklikniety = document.getElementById("przycisk").addEventListener('click', przekierowanie)

        function przekierowanie() {
            window.location.replace("index.php")
        }
    </script>
    </html>



