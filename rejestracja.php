<?php
include 'db/db.php';

?>


<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Zarejestruj się w komunikatorze Message">
    <title>Message | Rejestracja</title>
    <link rel="stylesheet" href="styles/register.css">
</head>
<body>
    <main class="login-page">
        <section class="login-card" aria-labelledby="login-title">
            <div class="login-brand" aria-label="Message">
                <span>Message</span>
            </div>

            <div class="login-heading">
                <p class="eyebrow">Rejestracja</p>
                <h1 id="login-title">Zarejestruj się</h1>
                <p class="subtitle">Dołącz do rozmowy i bądź w kontakcie.</p>
            </div>

            <form action="" method="post">
                <div class="form-field">
                    <label for="email">Adres e-mail</label>
                    <input type="email" id="email" name="email" autocomplete="email"
                        placeholder="np. ania@example.com" required>
                </div>
                <div class="form-field">
                    
                    <label for="name">Imię </label>
                    <input type="text" id="name" name="name" autocomplete="name"
                        placeholder="np. Anna " required>
                </div>
                <div class="form-field">
                    <label for="surname">Nazwisko</label>
                    <input type="text" id="surname" name="surname" autocomplete="family-name"
                        placeholder="np. Kowalska" required>
                </div>

                <div class="form-field">
                    <div class="field-label-row">
                        <label for="password">Hasło</label>
                    </div>
                    <input type="password" id="password" name="password"
                        autocomplete="current-password" placeholder="Wpisz swoje hasło" required>
                </div>
                <div class="form-field">
                    <div class="field-label-row">
                        <label for="password">Powtórz hasło</label>
                    </div>
                    <input type="password" id="password" name="password"
                        autocomplete="current-password" placeholder="Powtórz swoje hasło" required>
                </div>


                <label class="remember">
                    <input type="checkbox" name="remember">
                    <span>Zapamiętaj mnie</span>
                </label>


                <button type="submit">Zarejestruj się</button>
            </form>

            <p class="register-prompt">Nie masz jeszcze konta? <a href="#">Zarejestruj się</a></p>
        </section>

        <aside class="login-intro" aria-label="Informacje o komunikatorze">
            <div class="intro-content">
                <span class="intro-icon" aria-hidden="true">✦</span>
                <p class="eyebrow">Twój komunikator</p>
                <h2>Basia.<br><strong>Dziel się.</strong><br>Bądź blisko.</h2>
                <p>Wszystkie ważne rozmowy w jednym, bezpiecznym miejscu.</p>
            </div>
            <span class="intro-decoration decoration-one" aria-hidden="true"></span>
            <span class="intro-decoration decoration-two" aria-hidden="true"></span>
        </aside>
    </main>
</body>
</html>