<?php
require_once 'config.php';

$errors = [];
$email = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($email)) {
        $errors[] = "E-posta alanı zorunludur.";
    }
    if (empty($password)) {
        $errors[] = "Şifre alanı zorunludur.";
    }

    if (empty($errors)) {
        $sql = "SELECT id, fullname, email, password, role, school_id FROM users WHERE email = ?";

        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("s", $email);

            if ($stmt->execute()) {
                $stmt->store_result();

                if ($stmt->num_rows == 1) {
                    $stmt->bind_result($id, $fullname, $email, $hashed_password, $role, $school_id);
                    if ($stmt->fetch()) {
                        if (password_verify($password, $hashed_password)) {
                            $_SESSION["loggedin"] = true;
                            $_SESSION["id"] = $id;
                            $_SESSION["email"] = $email;
                            $_SESSION["fullname"] = $fullname;
                            $_SESSION["role"] = $role;
                            $_SESSION["school_id"] = $school_id;
                            $_SESSION["success_message"] = "Giriş başarılı! Hoş geldiniz, " . htmlspecialchars($fullname) . "!";

                            header("location: ../dashboard.php");
                            exit;
                        } else {
                            $errors[] = "Girdiğiniz şifre hatalı.";
                        }
                    }
                } else {
                    $errors[] = "Bu e-posta adresi ile kayıtlı bir hesap bulunamadı.";
                }
            } else {
                $errors[] = "Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin.";
            }
            $stmt->close();
        }
    }

    if (!empty($errors)) {
        $_SESSION['login_errors'] = $errors;
        $_SESSION['login_email'] = $email;
        header("location: ../index.php");
        exit();
    }

    $conn->close();
} else {
    header("location: ../index.php");
    exit();
}
?>
