<?php
include 'db/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$successMessage = $_SESSION["successMessage"] ?? "";
unset($_SESSION["successMessage"]);



$error = "";

if ($_POST) {
    $stmt = $conn->prepare("SELECT * FROM uzytkownicy WHERE email = ?");
    $stmt->execute([$_POST['email']]);
    $user = $stmt->get_result()->fetch_assoc();

    if (!$user) {
        die("BŁĄD: Nie znaleziono w bazie takiego e-maila!");
    }

    if (!password_verify($_POST['password'], $user['haslo_hash'])) {
        die("BŁĄD: E-mail się zgadza, ale hasło jest niepoprawne!");
    }

    $_SESSION['user_id'] = $user['id'];
    header("Location: index.php");
    exit;
}

?>





<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Zaloguj się do komunikatora Message">
    <title>Message | Logowanie</title>
    <link rel="stylesheet" href="styles/login.css">
</head>
<body>
    <main class="login-page">
        <section class="login-card" aria-labelledby="login-title">
            <div class="login-brand" aria-label="Message">
                <span>Message</span>
            </div>

            <div class="login-heading">
                <p class="eyebrow">Witaj ponownie</p>
                <h1 id="login-title">Zaloguj się</h1>
                <p class="subtitle">Dołącz do rozmowy i bądź w kontakcie.</p>
                <?php if ($successMessage !== ""): ?>
                    <p class="subtitle" role="status"><?= htmlspecialchars($successMessage, ENT_QUOTES, "UTF-8") ?></p>
                <?php endif; ?>
            </div>

            <form action="" method="post">
                <div class="form-field">
                    <label for="email">Adres e-mail</label>
                    <input type="email" id="email" name="email" autocomplete="email"
                        placeholder="np. ania@example.com" required>
                </div>

                <div class="form-field">
                    <div class="field-label-row">
                        <label for="password">Hasło</label>
                        <a href="#">Nie pamiętasz hasła?</a>
                    </div>
                    <input type="password" id="password" name="password"
                        autocomplete="current-password" placeholder="Wpisz swoje hasło" required>
                </div>



                <button type="submit">Zaloguj się</button>
            </form>

            <p class="register-prompt">Nie masz jeszcze konta? <a href="rejestracja.php">Zarejestruj się</a></p>
        </section>

        <aside class="login-intro" aria-label="Informacje o komunikatorze">
            <div class="intro-content">
                <span class="intro-icon" aria-hidden="true">✦</span>
                <p class="eyebrow">Twój komunikator</p>
                <h2>Rozmawiaj.<br><strong>Dziel się.</strong><br>Bądź blisko.</h2>
                <p>Wszystkie ważne rozmowy w jednym, bezpiecznym miejscu.</p>
            </div>
            <span class="intro-decoration decoration-one" aria-hidden="true"></span>
            <span class="intro-decoration decoration-two" aria-hidden="true"></span>
        </aside>
    </main>
</body>
</html>