<?php
// Oturum yönetimini başlat (hata mesajlarını alabilmek için)
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Giriş Yap - K12 Öğretim Platformu</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="auth-page">
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <div class="logo"><i class="fas fa-brain"></i></div>
                <h2>Hesabınıza Giriş Yapın</h2>
                <p>K12 Öğretim Platformuna hoş geldiniz.</p>
            </div>
            
            <!-- Hata ve Başarı Mesajları Alanı -->
            <?php
                if (isset($_SESSION['login_errors']) && !empty($_SESSION['login_errors'])) {
                    echo '<div class="alert alert-danger">';
                    foreach ($_SESSION['login_errors'] as $error) {
                        echo '<span><i class="fas fa-exclamation-circle"></i> ' . htmlspecialchars($error) . '</span>';
                    }
                    echo '</div>';
                    unset($_SESSION['login_errors']); // Mesajları gösterdikten sonra temizle
                }
                if (isset($_SESSION['success_message'])) {
                    echo '<div class="alert alert-success"><span><i class="fas fa-check-circle"></i> ' . htmlspecialchars($_SESSION['success_message']) . '</span></div>';
                    unset($_SESSION['success_message']);
                }
            ?>

            <form action="php/login.php" method="post" class="auth-form">
                <div class="form-group">
                    <label for="email" class="form-label">E-posta</label>
                    <input type="email" id="email" name="email" class="form-input" required 
                           placeholder="E-posta adresinizi girin"
                           value="<?php echo htmlspecialchars($_SESSION['login_email'] ?? ''); unset($_SESSION['login_email']); ?>">
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">Şifre</label>
                    <input type="password" id="password" name="password" class="form-input" required 
                           placeholder="Şifrenizi girin">
                </div>

                <button type="submit" class="btn btn-primary">Giriş Yap</button>
            </form>
            <div class="auth-footer">
                <p>Hesabın yok mu? <a href="register.html">Hemen Kayıt Ol</a></p>
            </div>
        </div>
    </div>
    <script src="js/main.js"></script>
</body>
</html>
