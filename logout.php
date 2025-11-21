<?php
// php/logout.php

// Session'ı başlat
require_once 'config.php';

// Tüm session değişkenlerini temizle
$_SESSION = array();

// Session'ı yok et
session_destroy();

// Kullanıcıyı giriş sayfasına yönlendir
header("location: ../index.php");
exit;
?>
