<?php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "message_database";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = mysqli_connect($host, $username, $password, $dbname);
    mysqli_set_charset($conn, "utf8mb4");
    
} catch (mysqli_sql_exception $e) {
    error_log("Błąd połączenia z bazą danych: " . $e->getMessage());
    header("Location: ./db/db-error.php");
    exit();
}
