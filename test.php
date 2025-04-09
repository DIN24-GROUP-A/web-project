<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$user = 'root';
$pass = ''; 
$db   = 'db_name';

$mysqli = new mysqli($host, $user, $pass, $db);

if ($mysqli->connect_errno) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to connect to MySQL: ' . $mysqli->connect_error
    ]);
    exit;
}

echo json_encode([
    'status' => 'success',
    'message' => 'Connection successful!'
]);