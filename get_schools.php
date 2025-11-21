<?php
header('Content-Type: application/json');
require_once 'config.php';

$response = ['success' => false, 'schools' => [], 'error' => ''];

if ($conn->connect_error) {
    $response['error'] = "Veritabanı bağlantı hatası: " . $conn->connect_error;
    echo json_encode($response);
    exit();
}

$sql = "SELECT id, name FROM schools ORDER BY name ASC";
$result = $conn->query($sql);

if ($result) {
    $schools = [];
    while ($row = $result->fetch_assoc()) {
        $schools[] = $row;
    }
    if (count($schools) > 0) {
        $response['success'] = true;
        $response['schools'] = $schools;
    } else {
        $response['error'] = "Veritabanında hiç okul kaydı bulunamadı.";
    }
} else {
    $response['error'] = "SQL hatası: " . $conn->error;
}

$conn->close();
echo json_encode($response);
?>
