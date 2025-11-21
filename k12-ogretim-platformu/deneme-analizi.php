<?php
require_once 'php/config.php';

// Kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("location: index.php");
    exit;
}

// Giriş yapmış kullanıcının ID'sini al
$user_id = $_SESSION["id"];

// Öğrencinin sınav sonuçlarını veritabanından çek
$exam_results = [];
$sql = "SELECT e.name AS exam_name, e.exam_date, er.total_net, er.total_score, e.total_questions
        FROM exam_results er
        JOIN exams e ON er.exam_id = e.id
        WHERE er.user_id = ?
        ORDER BY e.exam_date DESC";

if ($stmt = $mysqli->prepare($sql)) {
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $exam_results = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deneme Analizi</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
    <link rel="stylesheet" href="css/deneme-analizi.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="header-content">
                <div class="brand">
                </div>
                <nav class="nav">
                    <a href="dashboard.php"><i class="fas fa-home"></i> Dashboard</a>
                    <a href="deneme-analizi.php" class="active"><i class="fas fa-chart-line"></i> Deneme Analizi</a>
                    <a href="calisma-plani.html"><i class="fas fa-calendar-check"></i> Çalışma Planı</a>
                    <a href="sure-yonetimi.html"><i class="fas fa-clock"></i> Süre Yönetimi</a>
                    <a href="notlarim.html"><i class="fas fa-sticky-note"></i> Notlarım</a>
                </nav>
                <div class="user-info">
                    <span id="userName">Öğrenci</span>
                    <button onclick="logout()" class="logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <div class="page-header">
                <h2><i class="fas fa-chart-line"></i> Deneme Sonuçları Analizi</h2>
                <p>Deneme sınavı sonuçlarınızı girin ve eksik konularınızı keşfedin</p>
            </div>

            <!-- Student Field Selection -->
            <section class="field-selection">
                <div class="card">
                    <h3><i class="fas fa-user-graduate"></i> Alan Seçimi</h3>
                    <div class="field-options">
                        <div class="field-option" data-field="sayisal">
                            <div class="field-icon">
                                <i class="fas fa-calculator"></i>
                            </div>
                            <div class="field-info">
                                <h4>Sayısal</h4>
                                <p>Matematik, Fizik, Kimya, Biyoloji</p>
                            </div>
                        </div>
                        <div class="field-option" data-field="sozel">
                            <div class="field-icon">
                                <i class="fas fa-book"></i>
                            </div>
                            <div class="field-info">
                                <h4>Sözel</h4>
                                <p>Edebiyat, Tarih, Coğrafya, Felsefe</p>
                            </div>
                        </div>
                        <div class="field-option" data-field="esit">
                            <div class="field-icon">
                                <i class="fas fa-balance-scale"></i>
                            </div>
                            <div class="field-info">
                                <h4>Eşit Ağırlık</h4>
                                <p>Matematik ve Sosyal dengeli</p>
                            </div>
                        </div>
                    </div>
                    <div class="current-field" id="currentField">
                        <span>Alan seçimi yapılmamış</span>
                    </div>
                </div>
            </section>

            <!-- Add New Exam Result -->
            <section class="add-result-section">
                <div class="card">
                    <h3><i class="fas fa-plus"></i> Yeni Deneme Sonucu Ekle</h3>
                    <form id="examForm" class="exam-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="examType">Sınav Türü</label>
                                <select id="examType" required>
                                    <option value="">Seçiniz</option>
                                    <option value="tyt">TYT</option>
                                    <option value="ayt">AYT</option>
                                    <option value="lgs">LGS</option>
                                    <option value="other">Diğer</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="examDate">Sınav Tarihi</label>
                                <input type="date" id="examDate" required>
                            </div>
                            <div class="form-group">
                                <label for="examName">Sınav Adı</label>
                                <input type="text" id="examName" placeholder="Örn: Ders Hocası TYT-3" required>
                            </div>
                        </div>

                        <div id="subjectScores" class="subject-scores">
                            <!-- Dinamik olarak oluşturulacak -->
                        </div>

                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Sonucu Kaydet
                        </button>
                    </form>
                </div>
            </section>

            <!-- Exam Results Summary -->
            <section class="results-summary">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon primary">
                            <i class="fas fa-clipboard-list"></i>
                        </div>
                        <div class="stat-content">
                            <h3 id="totalExams">0</h3>
                            <p>Toplam Deneme</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon success">
                            <i class="fas fa-trending-up"></i>
                        </div>
                        <div class="stat-content">
                            <h3 id="averageScore">0</h3>
                            <p>Ortalama Net</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon warning">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="stat-content">
                            <h3 id="weakSubjects">0</h3>
                            <p>Zayıf Konu</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon info">
                            <i class="fas fa-calendar-week"></i>
                        </div>
                        <div class="stat-content">
                            <h3 id="thisWeekProgress">+0</h3>
                            <p>Bu Hafta İlerleme</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Charts Section -->
            <section class="charts-section">
                <div class="charts-grid">
                    <!-- Progress Chart -->
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3><i class="fas fa-line-chart"></i> Net İlerleme Grafiği</h3>
                            <div class="chart-controls">
                                <select id="progressPeriod">
                                    <option value="week">Son Hafta</option>
                                    <option value="month" selected>Son Ay</option>
                                    <option value="all">Tümü</option>
                                </select>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="progressChart"></canvas>
                        </div>
                    </div>

                    <!-- Subject Analysis -->
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3><i class="fas fa-pie-chart"></i> Ders Analizi</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="subjectChart"></canvas>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Exam History -->
            <section class="exam-history">
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-history"></i> Deneme Geçmişi</h3>
                        <div class="filters">
                            <select id="filterType">
                                <option value="all">Tüm Sınavlar</option>
                                <option value="tyt">TYT</option>
                                <option value="ayt">AYT</option>
                                <option value="lgs">LGS</option>
                            </select>
                        </div>
                    </div>
                    <div class="exam-list" id="examList">
                        <!-- Dinamik olarak oluşturulacak -->
                    </div>
                </div>
            </section>

            <!-- Weak Subjects Analysis -->
            <section class="weak-subjects">
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-exclamation-circle"></i> Zayıf Konular & Öneriler</h3>
                    </div>
                    <div class="weak-subjects-list" id="weakSubjectsList">
                        <!-- Dinamik olarak oluşturulacak -->
                    </div>
                </div>
            </section>

            <!-- Analysis Section -->
            <section class="analysis-section">
                <div class="exam-card">
                    <div class="exam-card-header">
                        <span>ÖZDEBİR - TG TYT - İLK PROVA</span>
                    </div>
                    <div class="exam-card-body">
                        <div class="exam-info">
                            <p><strong>TARİH:</strong> 03.10.2025</p>
                            <div class="net-progress">
                                <p><strong>NET:</strong> 84.00</p>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: 84%;"></div>
                                </div>
                            </div>
                            <p><strong>TYT PUAN:</strong> 453.630</p>
                        </div>
                        <div class="exam-actions">
                            <button class="btn-detail">DETAY</button>
                            <button class="btn-topics">ÇALIŞILACAK KONULAR</button>
                            <button class="btn-report">KARNE</button>
                        </div>
                    </div>
                </div>

                <div class="exam-card">
                    <div class="exam-card-header">
                        <span>TOPRAK - TYT - 1</span>
                    </div>
                    <div class="exam-card-body">
                        <div class="exam-info">
                            <p><strong>TARİH:</strong> 03.10.2025</p>
                            <div class="net-progress">
                                <p><strong>NET:</strong> 55.50</p>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: 55.5%;"></div>
                                </div>
                            </div>
                            <p><strong>TYT PUAN:</strong> 369.430</p>
                        </div>
                        <div class="exam-actions">
                            <button class="btn-detail">DETAY</button>
                            <button class="btn-topics">ÇALIŞILACAK KONULAR</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script>
        // Student field configuration
        let studentField = localStorage.getItem('studentField') || null;
        
        // Exam types and subjects configuration
        const examSubjects = {
            tyt: [
                {name: 'Türkçe', max: 40},
                {name: 'Matematik', max: 40},
                {name: 'Fen Bilimleri', max: 20},
                {name: 'Sosyal Bilimler', max: 20}
            ],
            ayt: {
                sayisal: [
                    {name: 'Matematik', max: 40},
                    {name: 'Fizik', max: 14},
                    {name: 'Kimya', max: 13},
                    {name: 'Biyoloji', max: 13}
                ],
                sozel: [
                    {name: 'Edebiyat', max: 24},
                    {name: 'Tarih-1', max: 10},
                    {name: 'Coğrafya-1', max: 6},
                    {name: 'Tarih-2', max: 11},
                    {name: 'Coğrafya-2', max: 11},
                    {name: 'Felsefe', max: 12},
                    {name: 'Din Kültürü', max: 6}
                ],
                esit: [
                    {name: 'Matematik', max: 40},
                    {name: 'Edebiyat', max: 24},
                    {name: 'Tarih-1', max: 10},
                    {name: 'Coğrafya-1', max: 6}
                ]
            },
            lgs: [
                {name: 'Türkçe', max: 20},
                {name: 'Matematik', max: 20},
                {name: 'Fen Bilimleri', max: 20},
                {name: 'İnkılap Tarihi', max: 10},
                {name: 'Din Kültürü', max: 10},
                {name: 'İngilizce', max: 10}
            ]
        };

        let examResults = JSON.parse(localStorage.getItem('examResults') || '[]');

        // Load user info
        function loadUserInfo() {
            const userData = JSON.parse(localStorage.getItem('eduplatform_user') || sessionStorage.getItem('eduplatform_user') || '{}');
            if (userData.username) {
                document.getElementById('userName').textContent = userData.username;
            }
            // Load field selection
            updateFieldDisplay();
        }
        
        // Field selection handlers
        document.querySelectorAll('.field-option').forEach(option => {
            option.addEventListener('click', function() {
                const field = this.dataset.field;
                selectField(field);
            });
        });
        
        function selectField(field) {
            studentField = field;
            localStorage.setItem('studentField', field);
            updateFieldDisplay();
            
            // Clear exam form if AYT is selected
            const examType = document.getElementById('examType');
            if (examType.value === 'ayt') {
                generateSubjectInputs('ayt');
            }
        }
        
        function updateFieldDisplay() {
            const currentFieldElement = document.getElementById('currentField');
            const fieldOptions = document.querySelectorAll('.field-option');
            
            // Update visual selection
            fieldOptions.forEach(option => {
                option.classList.remove('selected');
                if (option.dataset.field === studentField) {
                    option.classList.add('selected');
                }
            });
            
            // Update display text
            if (studentField) {
                const fieldNames = {
                    'sayisal': 'Sayısal',
                    'sozel': 'Sözel', 
                    'esit': 'Eşit Ağırlık'
                };
                currentFieldElement.innerHTML = `<i class="fas fa-check"></i> Seçilen alan: <strong>${fieldNames[studentField]}</strong>`;
            } else {
                currentFieldElement.innerHTML = '<span>Alan seçimi yapılmamış</span>';
            }
        }

        // Generate subject score inputs based on exam type
        document.getElementById('examType').addEventListener('change', function() {
            const examType = this.value;
            generateSubjectInputs(examType);
        });
        
        function generateSubjectInputs(examType) {
            const container = document.getElementById('subjectScores');
            
            if (!examType || !examSubjects[examType]) {
                container.innerHTML = '';
                return;
            }
            
            let subjects;
            
            if (examType === 'ayt') {
                if (!studentField) {
                    container.innerHTML = '<div class="field-warning"><i class="fas fa-exclamation-triangle"></i> AYT için önce alan seçimi yapın!</div>';
                    return;
                }
                subjects = examSubjects.ayt[studentField];
                const fieldNames = {
                    'sayisal': 'Sayısal',
                    'sozel': 'Sözel',
                    'esit': 'Eşit Ağırlık'
                };
                container.innerHTML = `<h4>AYT ${fieldNames[studentField]} - Ders Bazında Netleriniz</h4>`;
            } else {
                subjects = examSubjects[examType];
                container.innerHTML = '<h4>Ders Bazında Netleriniz</h4>';
            }
            
            subjects.forEach(subject => {
                const div = document.createElement('div');
                div.className = 'subject-input';
                div.innerHTML = `
                    <label for="${subject.name.toLowerCase().replace(/[^a-z0-9]/g, '')}">${subject.name}</label>
                    <div class="score-input">
                        <input type="number" 
                               id="${subject.name.toLowerCase().replace(/[^a-z0-9]/g, '')}" 
                               min="0" 
                               max="${subject.max}" 
                               step="0.25"
                               placeholder="0">
                        <span class="max-score">/${subject.max}</span>
                    </div>
                `;
                container.appendChild(div);
            });
        }

        // Handle form submission
        document.getElementById('examForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const examType = document.getElementById('examType').value;
            const examDate = document.getElementById('examDate').value;
            const examName = document.getElementById('examName').value;
            
            // Check if AYT requires field selection
            if (examType === 'ayt' && !studentField) {
                showToast('AYT için önce alan seçimi yapın!', 'error');
                return;
            }
            
            let subjects;
            if (examType === 'ayt') {
                subjects = examSubjects.ayt[studentField];
            } else {
                subjects = examSubjects[examType];
            }
            
            const scores = {};
            let totalNet = 0;
            let totalMax = 0;

            subjects.forEach(subject => {
                const inputId = subject.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                const score = parseFloat(document.getElementById(inputId).value) || 0;
                scores[subject.name] = score;
                totalNet += score;
                totalMax += subject.max;
            });

            const result = {
                id: Date.now(),
                type: examType,
                field: examType === 'ayt' ? studentField : null,
                date: examDate,
                name: examName,
                scores: scores,
                totalNet: totalNet,
                totalMax: totalMax,
                percentage: (totalNet / totalMax * 100).toFixed(1)
            };

            examResults.push(result);
            localStorage.setItem('examResults', JSON.stringify(examResults));

            // Reset form
            this.reset();
            document.getElementById('subjectScores').innerHTML = '';

            // Refresh displays
            updateStats();
            displayExamHistory();
            updateCharts();
            analyzeWeakSubjects();

            showToast('Deneme sonucu başarıyla kaydedildi!', 'success');
        });

        // Update statistics
        function updateStats() {
            const totalExams = examResults.length;
            const averageNet = totalExams > 0 ? 
                (examResults.reduce((sum, exam) => sum + exam.totalNet, 0) / totalExams).toFixed(1) : 0;
            
            // Analyze weak subjects
            const subjectAverages = {};
            const subjectCounts = {};

            examResults.forEach(exam => {
                Object.entries(exam.scores).forEach(([subject, score]) => {
                    if (!subjectAverages[subject]) {
                        subjectAverages[subject] = 0;
                        subjectCounts[subject] = 0;
                    }
                    subjectAverages[subject] += score;
                    subjectCounts[subject]++;
                });
            });

            // Calculate average percentages for each subject
            const weakSubjects = Object.keys(subjectAverages).filter(subject => {
                const avgScore = subjectAverages[subject] / subjectCounts[subject];
                const maxScore = getMaxScoreForSubject(subject);
                return (avgScore / maxScore) < 0.6; // Less than 60%
            });

            // Calculate this week's progress
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            const thisWeekExams = examResults.filter(exam => new Date(exam.date) >= oneWeekAgo);
            const thisWeekProgress = thisWeekExams.length > 0 ? 
                `+${thisWeekExams.reduce((sum, exam) => sum + exam.totalNet, 0)}` : '+0';

            document.getElementById('totalExams').textContent = totalExams;
            document.getElementById('averageScore').textContent = averageNet;
            document.getElementById('weakSubjects').textContent = weakSubjects.length;
            document.getElementById('thisWeekProgress').textContent = thisWeekProgress;
        }

        // Get max score for a subject
        function getMaxScoreForSubject(subjectName) {
            for (const examType in examSubjects) {
                if (examType === 'ayt') {
                    // Check all AYT fields
                    for (const field in examSubjects.ayt) {
                        const subject = examSubjects.ayt[field].find(s => s.name === subjectName);
                        if (subject) return subject.max;
                    }
                } else {
                    const subject = examSubjects[examType].find(s => s.name === subjectName);
                    if (subject) return subject.max;
                }
            }
            return 1;
        }

        // Display exam history
        function displayExamHistory() {
            const container = document.getElementById('examList');
            const filterType = document.getElementById('filterType').value;
            
            let filteredExams = examResults;
            if (filterType !== 'all') {
                filteredExams = examResults.filter(exam => exam.type === filterType);
            }

            // Sort by date descending
            filteredExams.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (filteredExams.length === 0) {
                container.innerHTML = '<div class="no-data">Henüz deneme sonucu eklenmemiş.</div>';
                return;
            }

            container.innerHTML = filteredExams.map(exam => `
                <div class="exam-item">
                    <div class="exam-header">
                        <h4>${exam.name}</h4>
                        <span class="exam-type">${exam.type.toUpperCase()}</span>
                        <span class="exam-date">${new Date(exam.date).toLocaleDateString('tr-TR')}</span>
                        <button class="delete-btn" onclick="deleteExam(${exam.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="exam-summary">
                        <div class="total-score">
                            <strong>Toplam: ${exam.totalNet}/${exam.totalMax} Net (${exam.percentage}%)</strong>
                        </div>
                        <div class="subject-scores">
                            ${Object.entries(exam.scores).map(([subject, score]) => 
                                `<span class="subject-score">${subject}: ${score}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Delete exam result
        function deleteExam(id) {
            if (confirm('Bu deneme sonucunu silmek istediğinizden emin misiniz?')) {
                examResults = examResults.filter(exam => exam.id !== id);
                localStorage.setItem('examResults', JSON.stringify(examResults));
                displayExamHistory();
                updateStats();
                updateCharts();
                analyzeWeakSubjects();
                showToast('Deneme sonucu silindi.', 'success');
            }
        }

        // Update charts
        function updateCharts() {
            updateProgressChart();
            updateSubjectChart();
        }

        // Progress chart
        function updateProgressChart() {
            const ctx = document.getElementById('progressChart').getContext('2d');
            
            // Destroy existing chart if exists
            if (window.progressChartInstance) {
                window.progressChartInstance.destroy();
            }

            const sortedExams = [...examResults].sort((a, b) => new Date(a.date) - new Date(b.date));
            
            window.progressChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: sortedExams.map(exam => new Date(exam.date).toLocaleDateString('tr-TR')),
                    datasets: [{
                        label: 'Toplam Net',
                        data: sortedExams.map(exam => exam.totalNet),
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Subject analysis chart
        function updateSubjectChart() {
            const ctx = document.getElementById('subjectChart').getContext('2d');
            
            // Destroy existing chart if exists
            if (window.subjectChartInstance) {
                window.subjectChartInstance.destroy();
            }

            // Calculate subject averages
            const subjectData = {};
            examResults.forEach(exam => {
                Object.entries(exam.scores).forEach(([subject, score]) => {
                    if (!subjectData[subject]) {
                        subjectData[subject] = {total: 0, count: 0, max: getMaxScoreForSubject(subject)};
                    }
                    subjectData[subject].total += score;
                    subjectData[subject].count++;
                });
            });

            const subjects = Object.keys(subjectData);
            const percentages = subjects.map(subject => {
                const data = subjectData[subject];
                return ((data.total / data.count) / data.max * 100).toFixed(1);
            });

            window.subjectChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: subjects,
                    datasets: [{
                        data: percentages,
                        backgroundColor: [
                            '#667eea', '#f59e0b', '#22c55e', '#ef4444',
                            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Analyze weak subjects
        function analyzeWeakSubjects() {
            const container = document.getElementById('weakSubjectsList');
            
            if (examResults.length === 0) {
                container.innerHTML = '<div class="no-data">Analiz için deneme sonucu gerekli.</div>';
                return;
            }

            const subjectAnalysis = {};
            examResults.forEach(exam => {
                Object.entries(exam.scores).forEach(([subject, score]) => {
                    if (!subjectAnalysis[subject]) {
                        subjectAnalysis[subject] = {
                            total: 0,
                            count: 0,
                            max: getMaxScoreForSubject(subject),
                            scores: []
                        };
                    }
                    subjectAnalysis[subject].total += score;
                    subjectAnalysis[subject].count++;
                    subjectAnalysis[subject].scores.push(score);
                });
            });

            // Find weak subjects (less than 60% average)
            const weakSubjects = Object.entries(subjectAnalysis)
                .map(([subject, data]) => ({
                    name: subject,
                    average: data.total / data.count,
                    percentage: (data.total / data.count) / data.max * 100,
                    trend: calculateTrend(data.scores)
                }))
                .filter(subject => subject.percentage < 60)
                .sort((a, b) => a.percentage - b.percentage);

            if (weakSubjects.length === 0) {
                container.innerHTML = '<div class="no-weak-subjects">🎉 Tebrikler! Şu anda zayıf konunuz bulunmuyor.</div>';
                return;
            }

            container.innerHTML = weakSubjects.map(subject => `
                <div class="weak-subject-item">
                    <div class="subject-info">
                        <h4>${subject.name}</h4>
                        <div class="subject-stats">
                            <span class="percentage ${subject.percentage < 40 ? 'critical' : 'warning'}">
                                ${subject.percentage.toFixed(1)}%
                            </span>
                            <span class="average">${subject.average.toFixed(1)} net ortalama</span>
                            <span class="trend ${subject.trend > 0 ? 'positive' : subject.trend < 0 ? 'negative' : 'neutral'}">
                                ${subject.trend > 0 ? '📈' : subject.trend < 0 ? '📉' : '➡️'} 
                                ${subject.trend > 0 ? 'Yükselişte' : subject.trend < 0 ? 'Düşüşte' : 'Sabit'}
                            </span>
                        </div>
                    </div>
                    <div class="subject-recommendations">
                        <h5>Öneriler:</h5>
                        <ul>
                            <li>Bu konuya günlük en az 1 saat ayırın</li>
                            <li>Temel konulardan başlayarak ilerleyin</li>
                            <li>Düzenli olarak test çözün</li>
                            <li>Yanlış yaptığınız soruları tekrar edin</li>
                        </ul>
                    </div>
                </div>
            `).join('');
        }

        // Calculate trend for scores
        function calculateTrend(scores) {
            if (scores.length < 2) return 0;
            const recent = scores.slice(-3); // Last 3 scores
            const older = scores.slice(0, -3);
            if (older.length === 0) return 0;
            
            const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
            const olderAvg = older.reduce((sum, score) => sum + score, 0) / older.length;
            
            return recentAvg - olderAvg;
        }

        // Filter change handler
        document.getElementById('filterType').addEventListener('change', displayExamHistory);

        // Logout function
        function logout() {
            localStorage.removeItem('eduplatform_user');
            sessionStorage.removeItem('eduplatform_user');
            window.location.href = 'login.html';
        }

        // Toast notification
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            loadUserInfo();
            document.getElementById('examDate').valueAsDate = new Date();
            updateStats();
            displayExamHistory();
            updateCharts();
            analyzeWeakSubjects();
        });
    </script>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: #f8fafc;
            color: #334155;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Header */
        .header {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 0;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .brand i {
            font-size: 2rem;
            color: #667eea;
        }

        .brand h1 {
            color: #334155;
            font-size: 1.5rem;
        }

        .nav {
            display: flex;
            gap: 20px;
        }

        .nav a {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            color: #64748b;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .nav a:hover,
        .nav a.active {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .logout-btn {
            background: none;
            border: none;
            color: #64748b;
            cursor: pointer;
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
            padding: 30px 0;
        }

        .page-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .page-header h2 {
            color: #334155;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .page-header h2 i {
            color: #667eea;
            margin-right: 10px;
        }

        .page-header p {
            color: #64748b;
            font-size: 1.1rem;
        }

        /* Cards */
        .card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            margin-bottom: 30px;
        }

        .card h3 {
            color: #334155;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .card h3 i {
            color: #667eea;
        }

        /* Field Selection Styles */
        .field-selection {
            margin-bottom: 30px;
        }
        
        .field-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .field-option {
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .field-option:hover {
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
        }
        
        .field-option.selected {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.05);
        }
        
        .field-icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            flex-shrink: 0;
        }
        
        .field-info h4 {
            color: #334155;
            margin-bottom: 5px;
            font-size: 1.1rem;
        }
        
        .field-info p {
            color: #64748b;
            font-size: 0.9rem;
            margin: 0;
        }
        
        .current-field {
            text-align: center;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            color: #64748b;
        }
        
        .current-field i {
            color: #22c55e;
            margin-right: 8px;
        }
        
        .field-warning {
            background: #fef3c7;
            color: #92400e;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        
        .field-warning i {
            margin-right: 8px;
        }

        /* Form Styles */
        .exam-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            font-weight: 500;
            margin-bottom: 8px;
            color: #374151;
        }

        .form-group input,
        .form-group select {
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .subject-scores h4 {
            color: #334155;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
        }

        .subject-input {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
        }

        .subject-input:last-child {
            border-bottom: none;
        }

        .subject-input label {
            font-weight: 500;
            color: #374151;
            min-width: 120px;
        }

        .score-input {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .score-input input {
            width: 80px;
            padding: 8px 12px;
            margin: 0;
        }

        .max-score {
            color: #6b7280;
            font-weight: 500;
        }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
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

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
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
        }

        /* Charts */
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }

        .chart-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .chart-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .chart-header h3 {
            color: #334155;
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0;
        }

        .chart-header h3 i {
            color: #667eea;
        }

        .chart-controls select {
            padding: 8px 12px;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            font-size: 0.9rem;
        }

        .chart-container {
            position: relative;
            height: 300px;
        }

        /* Exam History */
        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
        }

        .card-header h3 {
            margin: 0;
        }

        .filters select {
            padding: 8px 12px;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
        }

        .exam-item {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
        }

        .exam-item:hover {
            border-color: #667eea;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
        }

        .exam-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
        }

        .exam-header h4 {
            color: #334155;
            margin: 0;
        }

        .exam-type {
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .exam-date {
            color: #64748b;
            font-size: 0.9rem;
        }

        .delete-btn {
            background: none;
            border: none;
            color: #ef4444;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        .delete-btn:hover {
            background: #fef2f2;
        }

        .exam-summary {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .total-score {
            font-size: 1.1rem;
        }

        .subject-scores {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }

        .subject-score {
            background: #f8fafc;
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 0.9rem;
            color: #64748b;
        }

        /* Weak Subjects */
        .weak-subject-item {
            border: 1px solid #fef3c7;
            background: #fffbeb;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 15px;
        }

        .weak-subject-item.critical {
            border-color: #fecaca;
            background: #fef2f2;
        }

        .subject-info h4 {
            color: #92400e;
            margin-bottom: 10px;
        }

        .subject-stats {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }

        .percentage {
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 4px;
        }

        .percentage.warning {
            background: #fef3c7;
            color: #92400e;
        }

        .percentage.critical {
            background: #fecaca;
            color: #991b1b;
        }

        .average, .trend {
            color: #64748b;
            font-size: 0.9rem;
        }

        .trend.positive {
            color: #059669;
        }

        .trend.negative {
            color: #dc2626;
        }

        .subject-recommendations h5 {
            color: #374151;
            margin-bottom: 10px;
        }

        .subject-recommendations ul {
            padding-left: 20px;
            color: #64748b;
        }

        .subject-recommendations li {
            margin-bottom: 5px;
        }

        /* Utility Classes */
        .no-data, .no-weak-subjects {
            text-align: center;
            padding: 40px;
            color: #64748b;
        }

        .no-weak-subjects {
            color: #059669;
            font-size: 1.1rem;
        }

        /* Toast */
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            padding: 15px 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(100%);
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .toast.show {
            transform: translateX(0);
        }

        .toast-success {
            border-left: 4px solid #22c55e;
        }

        .toast-success i {
            color: #22c55e;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .container {
                padding: 0 15px;
            }

            .header-content {
                flex-direction: column;
                gap: 15px;
            }

            .nav {
                flex-wrap: wrap;
                justify-content: center;
            }

            .form-row {
                grid-template-columns: 1fr;
            }

            .charts-grid {
                grid-template-columns: 1fr;
            }

            .exam-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }

            .subject-scores {
                flex-direction: column;
                gap: 8px;
            }
        }
    </style>
</body>
</html>