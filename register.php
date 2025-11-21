<?php
// php/register.php
require_once 'config.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = trim($_POST['fullname']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $school_id = $_POST['school_id'];

    // Doğrulama
    if (empty($fullname)) {
        $response['message'] = "Ad Soyad alanı zorunludur.";
        echo json_encode($response);
        exit();
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = "Geçerli bir e-posta adresi giriniz.";
        echo json_encode($response);
        exit();
    }
    
    if (empty($password) || strlen($password) < 6) {
        $response['message'] = "Şifre en az 6 karakter olmalıdır.";
        echo json_encode($response);
        exit();
    }
    
    if (empty($school_id)) {
        $response['message'] = "Lütfen bir okul seçiniz.";
        echo json_encode($response);
        exit();
    }

    // E-posta kontrolü
    $sql = "SELECT id FROM users WHERE email = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $response['message'] = "Bu e-posta adresi zaten kayıtlı.";
            echo json_encode($response);
            $stmt->close();
            exit();
        }
        $stmt->close();
    }

    // Kullanıcıyı ekle
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $sql = "INSERT INTO users (school_id, fullname, email, password, role) VALUES (?, ?, ?, ?, 'student')";
    
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("isss", $school_id, $fullname, $email, $hashed_password);
        
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = "Kaydınız başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...";
        } else {
            $response['message'] = "Kayıt oluşturulurken bir hata oluştu: " . $conn->error;
        }
        $stmt->close();
    } else {
        $response['message'] = "Veritabanı hatası: " . $conn->error;
    }
    
    $conn->close();
} else {
    $response['message'] = "Geçersiz istek.";
}

echo json_encode($response);
?>
