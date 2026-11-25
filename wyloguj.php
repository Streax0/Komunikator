<?php
require_once './db/db.php';
session_start();
session_unset();    
session_destroy();  

header("Location: logowanie.php");
exit;
