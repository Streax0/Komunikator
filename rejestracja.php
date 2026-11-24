<?php
include 'db/db.php';

$successMessage = "";
$errorMessage = "";

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST["email"] ?? "");
    $name = trim($_POST["name"] ?? "");
    $surname = trim($_POST["surname"] ?? "");
    $password = $_POST["password"] ?? "";
    $password2 = $_POST["password2"] ?? "";

    if ($email === "" || $name === "" || $surname === "") {
        $errorMessage = "Wypełnij wszystkie pola.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errorMessage = "Podaj prawidłowy adres e-mail.";
    } elseif (strlen($password) < 8) {
        $errorMessage = "Hasło musi mieć co najmniej 8 znaków.";
    } elseif (!hash_equals($password, $password2)) {
        $errorMessage = "Hasła nie są zgodne.";
    } else {
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare(
            "INSERT INTO uzytkownicy (email, imie, nazwisko, haslo_hash) VALUES (?, ?, ?, ?)"
        );
        $stmt->bind_param("ssss", $email, $name, $surname, $passwordHash);

        try {
            $stmt->execute();
            $stmt->close();

            $_SESSION["successMessage"] = "Zarejestrowano użytkownika: " . $email;
            header("Location: logowanie.php");
            exit();
        } catch (mysqli_sql_exception $exception) {
            $stmt->close();
            if ($exception->getCode() === 1062) {
                $errorMessage = "Ten adres e-mail jest już zarejestrowany.";
            } else {
                $errorMessage = "Nie udało się zarejestrować użytkownika.";
            }
        }
    }
}
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
                <?php if ($successMessage !== ""): ?>
                    <p class="subtitle"><?= $successMessage ?></p>
                <?php endif; ?>
                <?php if ($errorMessage !== ""): ?>
                    <p class="subtitle"><?= htmlspecialchars($errorMessage, ENT_QUOTES, "UTF-8") ?></p>
                <?php endif; ?>
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
                        <label for="password2">Powtórz hasło</label>
                    </div>
                    <input type="password" id="password2" name="password2"
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