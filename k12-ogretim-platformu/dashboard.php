<?php 
require_once 'php/config.php';

// Kullanıcı giriş yapmamışsa login sayfasına yönlendir
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("location: index.php");
    exit;
}

// Kullanıcı bilgilerini al
$fullname = isset($_SESSION["fullname"]) ? $_SESSION["fullname"] : "Kullanıcı";
$email = isset($_SESSION["email"]) ? $_SESSION["email"] : "";
$role = isset($_SESSION["role"]) ? $_SESSION["role"] : "student";
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - K12 Öğrenim Platformu</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="dashboard-body">
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="brand">
                <i class="fas fa-graduation-cap"></i>
                <span>K12 Platform</span>
            </div>
            <button class="sidebar-toggle" id="sidebarToggle">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <nav class="sidebar-nav">
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="dashboard.php" class="nav-link active">
                        <i class="fas fa-home"></i>
                        <span>Dashboard</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="deneme-analizi.php" class="nav-link">
                        <i class="fas fa-chart-pie"></i>
                        <span>Deneme Analizi</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="eksik-konular.html" class="nav-link">
                        <i class="fas fa-bullseye"></i>
                        <span>Eksik Konular</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="calisma-plani.html" class="nav-link">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Çalışma Planı</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="sure-yonetimi.html" class="nav-link">
                        <i class="fas fa-hourglass-half"></i>
                        <span>Süre Yönetimi</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="odevlerim.html" class="nav-link">
                        <i class="fas fa-book-open-reader"></i>
                        <span>Ödevlerim</span>
                        <span class="badge" id="odevBadge">0</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="notlarim.html" class="nav-link">
                        <i class="fas fa-pen-to-square"></i>
                        <span>Notlarım</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="qa.html" class="nav-link">
                        <i class="fas fa-comments"></i>
                        <span>Öğretmen Chat</span>
                    </a>
                </li>
            </ul>
            
            <div class="nav-divider"></div>
            
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="profile.html" class="nav-link">
                        <i class="fas fa-user-gear"></i>
                        <span>Profil</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="settings.html" class="nav-link">
                        <i class="fas fa-cog"></i>
                        <span>Ayarlar</span>
                    </a>
                </li>
            </ul>
        </nav>
        
        <div class="sidebar-footer">
            <div class="user-info">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-details">
                    <span class="user-name" id="userName"><?php echo htmlspecialchars($fullname); ?></span>
                    <span class="user-role" id="userRole"><?php echo $role === 'student' ? 'Öğrenci' : ($role === 'teacher' ? 'Öğretmen' : 'Yönetici'); ?></span>
                </div>
            </div>
            <button class="logout-btn" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Top Bar -->
        <header class="topbar">
            <div class="topbar-left">
                <button class="mobile-menu-btn" id="mobileMenuBtn">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="breadcrumb">
                    <span>Dashboard</span>
                </div>
            </div>
            
            <div class="topbar-right">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Ders, konu veya not ara..." id="searchInput" class="form-input">
                </div>
                
                <div class="topbar-actions">
                    <button class="action-btn notification-btn" id="notificationBtn">
                        <i class="fas fa-bell"></i>
                        <span class="notification-badge">3</span>
                    </button>
                    
                    <div class="user-menu">
                        <i class="fas fa-bell"></i>
                        <i class="fas fa-user-circle"></i>
                        <span><?php echo htmlspecialchars($fullname); ?></span>
                        <a href="php/logout.php" class="btn-logout" title="Çıkış Yap"><i class="fas fa-sign-out-alt"></i></a>
                    </div>
                </div>
            </div>
        </header>

        <!-- Dashboard Content -->
        <div class="dashboard-content">
            <?php if (isset($_SESSION["success_message"])): ?>
                <div class="alert alert-success" style="margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                    <span><?php echo htmlspecialchars($_SESSION["success_message"]); ?></span>
                </div>
                <?php unset($_SESSION["success_message"]); ?>
            <?php endif; ?>
            
            <!-- Welcome Section -->
            <section class="welcome-card">
                <div class="welcome-text">
                    <h1 id="welcomeMessage">Hoş geldin, <?php echo htmlspecialchars($fullname); ?>! 👋</h1>
                    <p id="welcomeDescription">Öğrenme yolculuğunda başarıya ulaşman için buradayız.</p>
                    <div class="welcome-actions">
                        <button class="btn btn-primary" onclick="window.location.href='deneme-analizi.php'">
                            <i class="fas fa-chart-pie"></i> Analize Başla
                        </button>
                        <button class="btn btn-outline" onclick="window.location.href='calisma-plani.html'">
                            <i class="fas fa-calendar-alt"></i> Planını Görüntüle
                        </button>
                    </div>
                </div>
                <div class="welcome-illustration">
                    <i class="fas fa-rocket"></i>
                </div>
            </section>

            <!-- Stats Cards -->
            <section class="stats-section">
                <div class="stat-card">
                    <div class="stat-icon primary">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="stat-content">
                        <h3 id="totalExams">0</h3>
                        <p>Toplam Deneme</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon success">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <h3 id="completedTopics">0</h3>
                        <p>Tamamlanan Konu</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon warning">
                        <i class="fas fa-tasks"></i>
                    </div>
                    <div class="stat-content">
                        <h3 id="pendingAssignments">0</h3>
                        <p>Bekleyen Ödev</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon info">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="stat-content">
                        <h3 id="missingTopics">0</h3>
                        <p>Eksik Konu</p>
                    </div>
                </div>
            </section>

            <!-- Main Dashboard Grid -->
            <div class="dashboard-grid">
                <!-- Progress Chart -->
                <div class="dashboard-card chart-card">
                    <div class="card-header">
                        <h3><i class="fas fa-chart-line"></i> Haftalık İlerleme</h3>
                        <div class="chart-controls">
                            <button class="btn btn-sm" onclick="changeChartPeriod('week')">Hafta</button>
                            <button class="btn btn-sm active" onclick="changeChartPeriod('month')">Ay</button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="progressChart"></canvas>
                    </div>
                </div>

                <!-- Upcoming Assignments -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3><i class="fas fa-book-open-reader"></i> Yaklaşan Ödevler</h3>
                        <a href="odevlerim.html" class="view-all">Tümünü Gör</a>
                    </div>
                    <div class="assignment-list" id="upcomingAssignmentsList">
                        <!-- Dinamik olarak doldurulacak -->
                    </div>
                </div>

                <!-- Recent Activities -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3><i class="fas fa-history"></i> Son Aktiviteler</h3>
                    </div>
                    <div class="activity-list" id="recentActivityList">
                        <!-- Dinamik olarak doldurulacak -->
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3><i class="fas fa-bolt"></i> Hızlı İşlemler</h3>
                    </div>
                    <div class="quick-actions">
                        <button class="quick-action-btn" onclick="window.location.href='quiz.html'">
                            <i class="fas fa-clipboard-check"></i>
                            <span>Hızlı Test</span>
                        </button>
                        <button class="quick-action-btn" onclick="window.location.href='notlarim.html'">
                            <i class="fas fa-pen-to-square"></i>
                            <span>Not Al</span>
                        </button>
                        <button class="quick-action-btn" onclick="window.location.href='calisma-plani.html'">
                            <i class="fas fa-calendar-plus"></i>
                            <span>Plan Ekle</span>
                        </button>
                        <button class="quick-action-btn" onclick="window.location.href='qa.html'">
                            <i class="fas fa-comments"></i>
                            <span>Chat Yap</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Notification Panel (Yapısı aynı kalabilir) -->
    <div class="notification-panel" id="notificationPanel">
        <div class="notification-header">
            <h3>Bildirimler</h3>
            <button class="close-notifications" id="closeNotifications">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notification-list">
            <div class="notification-item unread">
                <div class="notification-icon info">
                    <i class="fas fa-info"></i>
                </div>
                <div class="notification-content">
                    <p><strong>Yeni ders içeriği</strong> eklendi</p>
                    <span class="notification-time">10 dakika önce</span>
                </div>
            </div>
            <div class="notification-item unread">
                <div class="notification-icon warning">
                    <i class="fas fa-exclamation"></i>
                </div>
                <div class="notification-content">
                    <p><strong>Matematik ödeviniz</strong> teslim tarihi yaklaşıyor</p>
                    <span class="notification-time">2 saat önce</span>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon success">
                    <i class="fas fa-check"></i>
                </div>
                <div class="notification-content">
                    <p><strong>Quiz sonucunuz</strong> hazır</p>
                    <span class="notification-time">1 gün önce</span>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Kullanıcı bilgilerini yükle
        function loadUserInfo() {
            const userData = JSON.parse(localStorage.getItem('eduplatform_user') || sessionStorage.getItem('eduplatform_user') || '{}');
            
            if (userData.username) {
                const userName = userData.username;
                const userRole = userData.role === 'student' ? 'Öğrenci' : userData.role === 'teacher' ? 'Öğretmen' : 'Kullanıcı';
                
                document.getElementById('userName').textContent = userName;
                document.getElementById('userRole').textContent = userRole;
                document.getElementById('welcomeMessage').textContent = `Hoş geldin, ${userName}! 👋`;
            }
            
            updateAssignmentBadge();
            loadDashboardData();
        }
        
        function updateAssignmentBadge() {
            const assignments = JSON.parse(localStorage.getItem('studyAssignments') || '[]');
            const pendingCount = assignments.filter(a => !a.completed).length;
            const badgeElement = document.getElementById('odevBadge');
            
            if (badgeElement) {
                badgeElement.textContent = pendingCount;
                badgeElement.style.display = pendingCount > 0 ? 'inline-block' : 'none';
            }
        }

        function loadDashboardData() {
            // Bu fonksiyon localStorage'dan verileri çekip dashboard'u dolduracak
            const assignments = JSON.parse(localStorage.getItem('studyAssignments') || '[]').slice(0, 3);
            const exams = JSON.parse(localStorage.getItem('examResults') || '[]');
            
            // Stat Kartları
            document.getElementById('totalExams').textContent = exams.length;
            document.getElementById('pendingAssignments').textContent = assignments.filter(a => !a.completed).length;
            // Diğer stat'lar için de benzer mantık kurulabilir.

            // Yaklaşan Ödevler
            const assignmentList = document.getElementById('upcomingAssignmentsList');
            assignmentList.innerHTML = '';
            if (assignments.length > 0) {
                assignments.forEach(a => {
                    const item = document.createElement('div');
                    item.className = 'assignment-item';
                    item.innerHTML = `
                        <div class="assignment-icon" style="color:var(--primary-600);"><i class="fas fa-book"></i></div>
                        <div class="assignment-details">
                            <p><strong>${a.title}</strong></p>
                            <span class="assignment-time">${new Date(a.dueDate).toLocaleDateString('tr-TR')}</span>
                        </div>
                    `;
                    assignmentList.appendChild(item);
                });
            } else {
                assignmentList.innerHTML = '<p class="text-secondary" style="text-align:center; padding: 20px;">Yaklaşan ödeviniz bulunmuyor.</p>';
            }

            // Son Aktiviteler (Örnek)
            const activityList = document.getElementById('recentActivityList');
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon success"><i class="fas fa-check"></i></div>
                    <div class="activity-details"><p><strong>Matematik Quiz 5</strong> tamamlandı.</p><span class="activity-time">2 saat önce</span></div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon info"><i class="fas fa-book"></i></div>
                    <div class="activity-details"><p><strong>Fen Bilimleri Bölüm 3</strong> başlatıldı.</p><span class="activity-time">4 saat önce</span></div>
                </div>
            `;
        }

        // Sidebar toggle
        document.getElementById('mobileMenuBtn').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });

        document.getElementById('sidebarToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('active');
        });

        // User menu toggle
        document.getElementById('userMenu').addEventListener('click', () => {
            document.getElementById('userDropdown').classList.toggle('active');
        });

        // Notifications
        document.getElementById('notificationBtn').addEventListener('click', () => {
            document.getElementById('notificationPanel').classList.toggle('active');
        });

        // Logout function
        function logout() {
            localStorage.removeItem('eduplatform_user');
            sessionStorage.removeItem('eduplatform_user');
            window.location.href = 'login.html';
        }

        // Progress Chart
        function initProgressChart() {
            const ctx = document.getElementById('progressChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
                    datasets: [{
                        label: 'Çalışma Saati',
                        data: [1.5, 2, 1, 3, 2.5, 4, 3],
                        borderColor: 'var(--primary-600)',
                        backgroundColor: 'rgba(2, 132, 199, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: 'var(--primary-600)',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 7,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'var(--primary-600)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, ticks: { callback: value => value + ' sa' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        function changeChartPeriod(period) {
            // Chart period değiştirme fonksiyonu
            document.querySelectorAll('.chart-controls .btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
        }

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            // Arama fonksiyonality buraya eklenecek
            console.log('Arama:', query);
        });

        // Load recent exams from localStorage
        function loadRecentExams() {
            const exams = JSON.parse(localStorage.getItem('mockExams') || '[]');
            const recentExams = exams.slice(-3).reverse(); // Son 3 sınav
            const container = document.getElementById('recentExamsList');
            
            if (recentExams.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-chart-line"></i>
                        <p>Henüz deneme sınavı kaydı bulunmuyor.</p>
                        <a href="deneme-analizi.html" class="btn btn-primary">İlk Denemeni Ekle</a>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = recentExams.map(exam => `
                <div class="course-item">
                    <div class="course-info">
                        <div class="course-icon ${getSubjectColor(exam.subject)}">
                            <i class="${getSubjectIcon(exam.subject)}"></i>
                        </div>
                        <div class="course-details">
                            <h4>${exam.subject}</h4>
                            <p>${exam.date} - ${exam.examType}</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(exam.score/exam.totalScore*100)}%"></div>
                            </div>
                            <small>${exam.score}/${exam.totalScore} (${Math.round(exam.score/exam.totalScore*100)}%)</small>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="location.href='deneme-analizi.html'">Detay</button>
                </div>
            `).join('');
        }
        
        // Load upcoming assignments
        function loadUpcomingAssignments() {
            const assignments = JSON.parse(localStorage.getItem('personalAssignments') || '[]');
            const upcomingAssignments = assignments
                .filter(assignment => assignment.status !== 'Tamamlandı')
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 3);
            
            const container = document.getElementById('upcomingAssignmentsList');
            
            if (upcomingAssignments.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-tasks"></i>
                        <p>Henüz ödev kaydı bulunmuyor.</p>
                        <a href="odevlerim.html" class="btn btn-primary">İlk Ödevini Ekle</a>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = upcomingAssignments.map(assignment => {
                const daysLeft = Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysLeft <= 2;
                const statusClass = isUrgent ? 'urgent' : '';
                
                return `
                    <div class="assignment-item ${statusClass}">
                        <div class="assignment-info">
                            <h4>${assignment.title}</h4>
                            <p>${assignment.description}</p>
                            <span class="due-date">
                                <i class="fas fa-clock"></i> ${daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Süresi geçti'}
                            </span>
                        </div>
                        <button class="btn btn-sm ${isUrgent ? 'btn-warning' : 'btn-outline'}" onclick="location.href='odevlerim.html'">Detay</button>
                    </div>
                `;
            }).join('');
        }
        
        // Helper functions for subject styling
        function getSubjectColor(subject) {
            const colors = {
                'Matematik': 'math',
                'Fizik': 'science',
                'Kimya': 'science', 
                'Biyoloji': 'science',
                'Türkçe': 'language',
                'Edebiyat': 'language',
                'Tarih': 'social',
                'Coğrafya': 'social',
                'İngilizce': 'language'
            };
            return colors[subject] || 'primary';
        }
        
        function getSubjectIcon(subject) {
            const icons = {
                'Matematik': 'fas fa-calculator',
                'Fizik': 'fas fa-atom',
                'Kimya': 'fas fa-flask',
                'Biyoloji': 'fas fa-dna',
                'Türkçe': 'fas fa-book-open',
                'Edebiyat': 'fas fa-feather-alt',
                'Tarih': 'fas fa-landmark',
                'Coğrafya': 'fas fa-globe',
                'İngilizce': 'fas fa-language'
            };
            return icons[subject] || 'fas fa-book';
        }

        // Update dashboard statistics
        function updateDashboardStats() {
            // Mock exam statistics
            const exams = JSON.parse(localStorage.getItem('mockExams') || '[]');
            document.getElementById('totalExams').textContent = exams.length;
            
            // Assignment statistics 
            const assignments = JSON.parse(localStorage.getItem('personalAssignments') || '[]');
            const pendingAssignments = assignments.filter(a => a.status !== 'Tamamlandı').length;
            document.getElementById('pendingAssignments').textContent = pendingAssignments;
            
            // Missing topics statistics
            const missingTopics = JSON.parse(localStorage.getItem('missingTopics') || '[]');
            const incompleteMissingTopics = missingTopics.filter(t => !t.completed).length;
            document.getElementById('missingTopics').textContent = incompleteMissingTopics;
            
            // Completed topics statistics
            const completedMissingTopics = missingTopics.filter(t => t.completed).length;
            document.getElementById('completedTopics').textContent = completedMissingTopics;
        }

        // Sayfa yüklendiginde
        window.addEventListener('load', function() {
            loadUserInfo();
            initProgressChart();
            loadRecentExams();
            loadUpcomingAssignments();
            updateDashboardStats();
        });

        // Click outside to close dropdowns
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.user-menu')) {
                document.getElementById('userDropdown').classList.remove('active');
            }
            if (!event.target.closest('.notification-btn') && !event.target.closest('.notification-panel')) {
                document.getElementById('notificationPanel').classList.remove('active');
            }
        });
    </script>

    <style>
        /* Dashboard Styles */
        .dashboard-body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background: #f8fafc;
            display: flex;
            min-height: 100vh;
        }
        
        /* Empty State Styles */
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #64748b;
        }
        
        .empty-state i {
            font-size: 3rem;
            color: #cbd5e1;
            margin-bottom: 15px;
        }
        
        .empty-state p {
            font-size: 1rem;
            margin-bottom: 20px;
            color: #64748b;
        }
        
        .empty-state .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .empty-state .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        /* Sidebar */
        .sidebar {
            width: 280px;
            background: white;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            position: fixed;
            height: 100vh;
            z-index: 1000;
            transition: all 0.3s ease;
        }

        .sidebar-header {
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .brand {
            display: flex;
            align-items: center;
            font-size: 1.5rem;
            font-weight: 700;
            color: #667eea;
        }

        .brand i {
            margin-right: 10px;
            font-size: 2rem;
        }

        .sidebar-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
        }

        .sidebar-nav {
            flex: 1;
            padding: 20px 0;
            overflow-y: auto;
        }

        .nav-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .nav-item {
            margin-bottom: 5px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: #64748b;
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;
        }

        .nav-link:hover,
        .nav-link.active {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
        }

        .nav-link.active::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #667eea;
        }

        .nav-link i {
            margin-right: 15px;
            font-size: 1.2rem;
            width: 20px;
        }

        .badge {
            margin-left: auto;
            background: #667eea;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .badge.warning {
            background: #f59e0b;
        }

        .nav-divider {
            height: 1px;
            background: #e2e8f0;
            margin: 20px 0;
        }

        .sidebar-footer {
            padding: 20px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .user-info {
            display: flex;
            align-items: center;
        }

        .user-avatar {
            font-size: 2.5rem;
            color: #667eea;
            margin-right: 10px;
        }

        .user-details {
            display: flex;
            flex-direction: column;
        }

        .user-name {
            font-weight: 600;
            color: #334155;
            font-size: 0.9rem;
        }

        .user-role {
            font-size: 0.8rem;
            color: #64748b;
        }

        .logout-btn {
            background: none;
            border: none;
            color: #64748b;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 8px;
            border-radius: 6px;
            transition: all 0.3s ease;
        }

        .logout-btn:hover {
            background: #fef2f2;
            color: #dc2626;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: 280px;
            display: flex;
            flex-direction: column;
        }

        .topbar {
            background: white;
            padding: 15px 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .topbar-left {
            display: flex;
            align-items: center;
        }

        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            margin-right: 15px;
            cursor: pointer;
            color: #64748b;
        }

        .breadcrumb {
            font-weight: 600;
            color: #334155;
            font-size: 1.2rem;
        }

        .topbar-right {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .search-box {
            position: relative;
            display: flex;
            align-items: center;
        }

        .search-box i {
            position: absolute;
            left: 15px;
            color: #64748b;
        }

        .search-box input {
            padding: 10px 15px 10px 40px;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            width: 300px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .search-box input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .topbar-actions {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .action-btn {
            background: none;
            border: none;
            font-size: 1.3rem;
            color: #64748b;
            cursor: pointer;
            padding: 10px;
            border-radius: 8px;
            position: relative;
            transition: all 0.3s ease;
        }

        .action-btn:hover {
            background: #f1f5f9;
            color: #667eea;
        }

        .notification-badge {
            position: absolute;
            top: 5px;
            right: 5px;
            background: #ef4444;
            color: white;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 10px;
            min-width: 18px;
            text-align: center;
        }

        .user-menu {
            position: relative;
            cursor: pointer;
        }

        .user-menu .user-avatar {
            font-size: 2rem;
            color: #667eea;
        }

        .dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            min-width: 180px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        }

        .dropdown.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .dropdown a {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            color: #64748b;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .dropdown a:hover {
            background: #f1f5f9;
            color: #667eea;
        }

        .dropdown a i {
            margin-right: 10px;
            width: 16px;
        }

        /* Dashboard Content */
        .dashboard-content {
            padding: 30px;
            flex: 1;
        }

        .welcome-section {
            margin-bottom: 30px;
        }

        .welcome-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 40px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
        }

        .welcome-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
        }

        .welcome-text {
            flex: 1;
            position: relative;
            z-index: 2;
        }

        .welcome-text h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 15px;
        }

        .welcome-text p {
            font-size: 1.1rem;
            margin-bottom: 25px;
            opacity: 0.9;
        }

        .welcome-actions {
            display: flex;
            gap: 15px;
        }

        .welcome-image {
            position: relative;
            z-index: 2;
        }

        .welcome-illustration {
            font-size: 6rem;
            color: rgba(255,255,255,0.2);
            position: relative;
        }

        .floating-elements {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .floating-item {
            position: absolute;
            font-size: 2rem;
            color: rgba(255,255,255,0.3);
            animation: float 6s ease-in-out infinite;
        }

        .floating-item:nth-child(1) {
            top: -40px;
            left: -30px;
            animation-delay: 0s;
        }

        .floating-item:nth-child(2) {
            top: 10px;
            right: -30px;
            animation-delay: 2s;
        }

        .floating-item:nth-child(3) {
            bottom: -30px;
            left: -20px;
            animation-delay: 4s;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        /* Stats Section */
        .stats-section {
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            display: flex;
            align-items: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-right: 20px;
        }

        .stat-icon.primary {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
        }

        .stat-icon.success {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
        }

        .stat-icon.warning {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }

        .stat-icon.info {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }

        .stat-content h3 {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 5px;
            color: #334155;
        }

        .stat-content p {
            color: #64748b;
            margin-bottom: 8px;
        }

        .stat-change {
            display: flex;
            align-items: center;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .stat-change i {
            margin-right: 5px;
        }

        .stat-change.positive {
            color: #22c55e;
        }

        .stat-change.neutral {
            color: #64748b;
        }

        /* Dashboard Grid */
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 25px;
        }

        .dashboard-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .card-header h3 {
            display: flex;
            align-items: center;
            color: #334155;
            font-size: 1.2rem;
            font-weight: 600;
        }

        .card-header h3 i {
            margin-right: 10px;
            color: #667eea;
        }

        .view-all {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
        }

        .view-all:hover {
            text-decoration: underline;
        }

        /* Course List */
        .course-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .course-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            border: 2px solid #f1f5f9;
            border-radius: 12px;
            transition: all 0.3s ease;
        }

        .course-item:hover {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.02);
        }

        .course-info {
            display: flex;
            align-items: center;
            flex: 1;
        }

        .course-icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-right: 15px;
        }

        .course-icon.math {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }

        .course-icon.science {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
        }

        .course-icon.language {
            background: rgba(139, 69, 19, 0.1);
            color: #8b4513;
        }

        .course-details h4 {
            color: #334155;
            margin-bottom: 5px;
            font-weight: 600;
        }

        .course-details p {
            color: #64748b;
            font-size: 0.9rem;
            margin-bottom: 10px;
        }

        .progress-bar {
            width: 200px;
            height: 6px;
            background: #e2e8f0;
            border-radius: 3px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: #667eea;
            transition: width 0.3s ease;
        }

        /* Assignment List */
        .assignment-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .assignment-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 15px;
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .assignment-item:hover {
            background: #f8fafc;
        }

        .assignment-item.urgent {
            background: rgba(239, 68, 68, 0.05);
            border: 1px solid rgba(239, 68, 68, 0.1);
        }

        .assignment-item.completed {
            opacity: 0.6;
        }

        .assignment-info h4 {
            color: #334155;
            margin-bottom: 5px;
            font-weight: 600;
            font-size: 0.95rem;
        }

        .assignment-info p {
            color: #64748b;
            font-size: 0.85rem;
            margin-bottom: 8px;
        }

        .due-date {
            display: flex;
            align-items: center;
            font-size: 0.8rem;
            color: #64748b;
        }

        .due-date i {
            margin-right: 5px;
        }

        .assignment-item.urgent .due-date {
            color: #ef4444;
        }

        .assignment-item.completed .due-date {
            color: #22c55e;
        }

        /* Chart Card */
        .chart-card {
            grid-column: span 2;
        }

        .chart-controls {
            display: flex;
            gap: 10px;
        }

        .chart-controls .btn {
            padding: 6px 12px;
            border: 2px solid #e2e8f0;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.3s ease;
        }

        .chart-controls .btn.active,
        .chart-controls .btn:hover {
            border-color: #667eea;
            background: #667eea;
            color: white;
        }

        .chart-container {
            position: relative;
            height: 300px;
            margin-top: 15px;
        }

        /* Activity List */
        .activity-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .activity-item {
            display: flex;
            align-items: center;
        }

        .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 1rem;
        }

        .activity-icon.success {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
        }

        .activity-icon.info {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }

        .activity-icon.warning {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }

        .activity-details p {
            color: #334155;
            margin-bottom: 5px;
            font-size: 0.9rem;
        }

        .activity-time {
            color: #64748b;
            font-size: 0.8rem;
        }

        /* Tip Content */
        .tip-content {
            display: flex;
            align-items: flex-start;
            gap: 15px;
        }

        .tip-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
        }

        .tip-text h4 {
            color: #334155;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .tip-text p {
            color: #64748b;
            line-height: 1.6;
            font-size: 0.9rem;
        }

        /* Quick Actions */
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }

        .quick-action-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 15px;
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            color: #64748b;
        }

        .quick-action-btn:hover {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.05);
            color: #667eea;
        }

        .quick-action-btn i {
            font-size: 1.8rem;
            margin-bottom: 8px;
        }

        .quick-action-btn span {
            font-size: 0.85rem;
            font-weight: 500;
        }

        /* Notification Panel */
        .notification-panel {
            position: fixed;
            top: 0;
            right: 0;
            width: 350px;
            height: 100vh;
            background: white;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            z-index: 2000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }

        .notification-panel.active {
            transform: translateX(0);
        }

        .notification-header {
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .notification-header h3 {
            color: #334155;
            font-size: 1.2rem;
            font-weight: 600;
        }

        .close-notifications {
            background: none;
            border: none;
            font-size: 1.3rem;
            color: #64748b;
            cursor: pointer;
        }

        .notification-list {
            padding: 10px 0;
            max-height: calc(100vh - 80px);
            overflow-y: auto;
        }

        .notification-item {
            display: flex;
            align-items: flex-start;
            padding: 15px 20px;
            border-bottom: 1px solid #f1f5f9;
            transition: all 0.3s ease;
        }

        .notification-item:hover {
            background: #f8fafc;
        }

        .notification-item.unread {
            background: rgba(102, 126, 234, 0.02);
        }

        .notification-item .notification-icon {
            width: 35px;
            height: 35px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            flex-shrink: 0;
        }

        .notification-item .notification-icon.info {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }

        .notification-item .notification-icon.warning {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }

        .notification-item .notification-icon.success {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
        }

        .notification-content p {
            color: #334155;
            font-size: 0.9rem;
            margin-bottom: 5px;
        }

        .notification-time {
            color: #64748b;
            font-size: 0.8rem;
        }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
            border: 2px solid transparent;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn i {
            margin-right: 8px;
        }

        .btn-primary {
            background: #667eea;
            color: white;
        }

        .btn-primary:hover {
            background: #5a67d8;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-outline {
            background: transparent;
            color: #667eea;
            border-color: #667eea;
        }

        .btn-outline:hover {
            background: #667eea;
            color: white;
        }

        .btn-sm {
            padding: 8px 16px;
            font-size: 0.85rem;
        }

        .btn-warning {
            background: #f59e0b;
            color: white;
        }

        .btn-warning:hover {
            background: #d97706;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .sidebar {
                width: 280px;
                transform: translateX(-100%);
            }

            .sidebar.active {
                transform: translateX(0);
            }

            .main-content {
                margin-left: 0;
            }

            .mobile-menu-btn,
            .sidebar-toggle {
                display: block;
            }

            .search-box {
                display: none;
            }

            .dashboard-content {
                padding: 20px 15px;
            }

            .welcome-card {
                flex-direction: column;
                text-align: center;
                padding: 30px 20px;
            }

            .welcome-text h1 {
                font-size: 2rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .dashboard-grid {
                grid-template-columns: 1fr;
            }

            .chart-card {
                grid-column: span 1;
            }

            .notification-panel {
                width: 100vw;
            }

            .quick-actions {
                grid-template-columns: 1fr;
            }

            .welcome-actions {
                flex-direction: column;
                gap: 10px;
            }

            .welcome-actions .btn {
                width: 100%;
                justify-content: center;
            }
        }

        @media (max-width: 480px) {
            .topbar {
                padding: 10px 15px;
            }

            .topbar-right {
                gap: 10px;
            }

            .assignment-item,
            .course-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }

            .course-info {
                width: 100%;
            }

            .progress-bar {
                width: 100%;
                max-width: 200px;
            }
        }
    </style>
    <script src="js/auth.js"></script>
    <script src="js/main.js"></script>
</body>
</html>