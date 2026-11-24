<?php
$username = "root";
$password = "";
$dbname = "message_database";
$host = "localhost";

$conn = mysqli_connect($host, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>

