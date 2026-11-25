<?php
include 'db/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$successMessage = $_SESSION["successMessage"] ?? "";
unset($_SESSION["successMessage"]);

$error = $_SESSION["loginError"] ?? "";
unset($_SESSION["loginError"]);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $stmt = $conn->prepare("SELECT * FROM uzytkownicy WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->get_result()->fetch_assoc();

    if (!$user || !password_verify($password, $user['haslo_hash'])) {
        $_SESSION["loginError"] = "Niepoprawny e-mail lub hasło";
        header("Location: logowanie.php");
        exit;
    } else {
        $_SESSION['user_id'] = $user['id'];
        header("Location: index.php");
        exit;
    }
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
    <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
    <main class="login-page">
        <section class="login-card" aria-labelledby="login-title">
            <div class="login-brand-div" aria-label="Message">
                <img id="login-brand-image" src="logo.png" alt="Logo komunikatora Message">
                <span id="login-brand">Message</span>
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
                        <a href="z_haslo.php">Nie pamiętasz hasła?</a>
                    </div>
                    <input type="password" id="password" name="password"
                        autocomplete="current-password" placeholder="Wpisz swoje hasło" required>
                </div>

                <button type="submit">Zaloguj się</button>
            </form>

            <p class="register-prompt">Nie masz jeszcze konta? <a href="rejestracja.php">Zarejestruj się</a></p>
            <p id="errorblock"></p>
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

    <script>
      const emailError = <?php echo json_encode($error); ?>;
      if (emailError) {
        document.getElementById("errorblock").innerHTML = emailError;
      }
    </script>
</body>
</html>
