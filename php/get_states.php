<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
include 'db.php';

$sql = "SELECT DISTINCT state FROM crime_stats ORDER BY state ASC";
$result = $conn->query($sql);

$states = [];

while ($row = $result->fetch_assoc()) {
    $states[] = $row['state'];
}

echo json_encode($states);
