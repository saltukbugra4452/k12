<?php
// php/config.php

// Oturum yönetimini başlat
// Bu satır, session gerektiren her PHP dosyasının en başında yer almalıdır.
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Veritabanı Bağlantı Bilgileri
// XAMPP/WAMP varsayılan ayarlarıdır. Kendi ayarlarınıza göre güncelleyin.
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', ''); // XAMPP'de genellikle boştur.
define('DB_NAME', 'k12_platform');

// Veritabanı Bağlantısını Oluşturma
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
$mysqli = $conn; // Geriye dönük uyumluluk için

// Bağlantıyı Kontrol Etme
if($conn->connect_error){
    die("HATA: Veritabanı bağlantısı kurulamadı. " . $conn->connect_error);
}

// Karakter setini UTF-8 olarak ayarlama
$conn->set_charset("utf8mb4");

// Hata raporlamayı ayarlama (Geliştirme aşamasında kullanışlıdır)
// mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

?>
