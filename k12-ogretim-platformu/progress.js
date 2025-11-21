// Progress Tracking JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeProgressCharts();
    initializeAchievements();
    initializeGoals();
    initializeActivityHeatmap();
    loadProgressData();
});

// Chart Initialization
function initializeProgressCharts() {
    createProgressChart();
    createSubjectChart();
    createStudyTimeChart();
    createSuccessRateChart();
}

// Progress Chart (Line Chart)
function createProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
            datasets: [{
                label: 'Günlük İlerleme',
                data: [65, 72, 80, 75, 85, 78, 92],
                borderColor: '#4A90E2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4A90E2',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
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
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    hoverRadius: 8
                }
            }
        }
    });
}

// Subject Distribution Chart (Doughnut Chart)
function createSubjectChart() {
    const ctx = document.getElementById('subjectChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Matematik', 'Fen Bilgisi', 'Türkçe', 'İngilizce', 'Sosyal'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    '#4A90E2',
                    '#50C878',
                    '#FF6B6B',
                    '#FFD93D',
                    '#6C5CE7'
                ],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Study Time Chart
function createStudyTimeChart() {
    const ctx = document.getElementById('studyTimeChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
            datasets: [{
                label: 'Çalışma Saati',
                data: [2.5, 3.2, 4.1, 2.8, 3.5, 1.5, 4.2],
                backgroundColor: '#4A90E2',
                borderRadius: 4,
                borderSkipped: false
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
                    beginAtZero: true,
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + 'h';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Success Rate Chart
function createSuccessRateChart() {
    const ctx = document.getElementById('successRateChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Matematik', 'Fen Bilgisi', 'Türkçe', 'İngilizce', 'Sosyal'],
            datasets: [{
                label: 'Başarı Oranı',
                data: [92, 85, 78, 88, 82],
                borderColor: '#4A90E2',
                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: '#4A90E2',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
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
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        stepSize: 20
                    }
                }
            }
        }
    });
}

// Activity Heatmap
function initializeActivityHeatmap() {
    const heatmap = document.getElementById('activityHeatmap');
    if (!heatmap) return;

    // Generate heatmap for the last 12 weeks (84 days)
    const days = 84;
    const weeks = 12;
    
    let html = '';
    for (let week = 0; week < weeks; week++) {
        html += '<div class="heatmap-week">';
        for (let day = 0; day < 7; day++) {
            const dayIndex = week * 7 + day;
            if (dayIndex < days) {
                const level = Math.floor(Math.random() * 5); // Random activity level
                const date = new Date();
                date.setDate(date.getDate() - (days - dayIndex));
                
                html += `<div class="heatmap-day level-${level}" 
                        title="${date.toLocaleDateString('tr-TR')} - ${level * 25}% aktivite"
                        onclick="showDayDetails('${date.toISOString().split('T')[0]}')"></div>`;
            }
        }
        html += '</div>';
    }
    
    heatmap.innerHTML = html;
}

function showDayDetails(date) {
    alert(`${date} tarihindeki aktivite detayları burada gösterilecek.`);
}

// Tab Management
function showProgressTab(tabId) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.progress-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabId}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked menu item
    const clickedItem = event.target.closest('.menu-item');
    if (clickedItem) {
        clickedItem.classList.add('active');
    }
    
    // Initialize tab-specific features
    if (tabId === 'analytics') {
        setTimeout(() => {
            createStudyTimeChart();
            createSuccessRateChart();
            initializeActivityHeatmap();
        }, 100);
    }
}

// Subject Functions
function filterSubjects(filter) {
    const subjects = document.querySelectorAll('.subject-card');
    
    subjects.forEach(subject => {
        if (filter === 'all' || subject.getAttribute('data-subject') === filter) {
            subject.style.display = 'block';
        } else {
            subject.style.display = 'none';
        }
    });
}

function goToSubject(subjectId) {
    // Navigate to subject page
    window.location.href = `courses.html?subject=${subjectId}`;
}

function viewSubjectDetails(subjectId) {
    const subjectData = getSubjectData(subjectId);
    alert(`${subjectData.name} detayları:\n\nToplam Ders: ${subjectData.totalLessons}\nTamamlanan: ${subjectData.completed}\nBaşarı Oranı: ${subjectData.successRate}%`);
}

function getSubjectData(subjectId) {
    const subjects = {
        mathematics: {
            name: 'Matematik',
            totalLessons: 12,
            completed: 8,
            successRate: 92
        },
        science: {
            name: 'Fen Bilgisi',
            totalLessons: 10,
            completed: 6,
            successRate: 85
        },
        turkish: {
            name: 'Türkçe',
            totalLessons: 15,
            completed: 10,
            successRate: 78
        }
    };
    
    return subjects[subjectId] || subjects.mathematics;
}

// Achievement Functions
function initializeAchievements() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterAchievements(category);
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterAchievements(category) {
    const achievements = document.querySelectorAll('.achievement-card');
    
    achievements.forEach(achievement => {
        if (category === 'all' || achievement.getAttribute('data-category') === category) {
            achievement.style.display = 'block';
        } else {
            achievement.style.display = 'none';
        }
    });
}

// Goals Functions
function initializeGoals() {
    const goalForm = document.getElementById('add-goal-form');
    if (goalForm) {
        goalForm.addEventListener('submit', handleGoalSubmission);
    }
}

function showAddGoalModal() {
    const modal = document.getElementById('add-goal-modal');
    modal.style.display = 'flex';
}

function closeAddGoalModal() {
    const modal = document.getElementById('add-goal-modal');
    modal.style.display = 'none';
}

function handleGoalSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const goalData = {
        name: formData.get('name'),
        description: formData.get('description'),
        category: formData.get('category'),
        target: formData.get('target'),
        deadline: formData.get('deadline')
    };
    
    addGoal(goalData);
    closeAddGoalModal();
    e.target.reset();
}

function addGoal(goalData) {
    const goalsList = document.querySelector('.goals-list');
    const goalElement = document.createElement('div');
    goalElement.className = 'goal-card';
    goalElement.innerHTML = `
        <div class="goal-header">
            <div class="goal-icon">
                <i class="fas fa-bullseye"></i>
            </div>
            <div class="goal-info">
                <h3>${goalData.name}</h3>
                <p>${goalData.description}</p>
            </div>
            <div class="goal-status in-progress">
                <i class="fas fa-clock"></i>
            </div>
        </div>
        <div class="goal-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-info">
                <span>0/${goalData.target}</span>
                <span>Son tarih: ${formatDate(goalData.deadline)}</span>
            </div>
        </div>
    `;
    
    goalsList.appendChild(goalElement);
    showNotification('Yeni hedef başarıyla eklendi!', 'success');
}

// Progress Data Management
function loadProgressData() {
    const savedData = localStorage.getItem('studentProgress');
    if (savedData) {
        const progressData = JSON.parse(savedData);
        updateProgressDisplay(progressData);
    } else {
        // Initialize with default data
        const defaultData = {
            totalLessons: 24,
            averageSuccess: 89,
            totalPoints: 156,
            badges: 12,
            weeklyProgress: [65, 72, 80, 75, 85, 78, 92]
        };
        
        localStorage.setItem('studentProgress', JSON.stringify(defaultData));
        updateProgressDisplay(defaultData);
    }
}

function updateProgressDisplay(data) {
    // Update summary stats
    const statCards = document.querySelectorAll('.stat-card .stat-number');
    if (statCards.length >= 4) {
        statCards[0].textContent = data.totalLessons;
        statCards[1].textContent = data.averageSuccess + '%';
        statCards[2].textContent = data.totalPoints;
        statCards[3].textContent = data.badges;
    }
    
    // Update progress percentage
    const progressPercentage = document.querySelector('.progress-percentage');
    if (progressPercentage) {
        const percentage = Math.round((data.totalLessons / 30) * 100); // Assuming 30 total lessons
        progressPercentage.textContent = percentage + '%';
    }
}

function saveProgressData() {
    const progressData = {
        totalLessons: parseInt(document.querySelector('.stat-card .stat-number').textContent),
        averageSuccess: parseInt(document.querySelector('.stat-card:nth-child(2) .stat-number').textContent),
        totalPoints: parseInt(document.querySelector('.stat-card:nth-child(3) .stat-number').textContent),
        badges: parseInt(document.querySelector('.stat-card:nth-child(4) .stat-number').textContent),
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('studentProgress', JSON.stringify(progressData));
}

// Export and Share Functions
function exportProgress() {
    const progressData = JSON.parse(localStorage.getItem('studentProgress') || '{}');
    const reportData = {
        student: 'Ahmet Öğrenci',
        class: '9. Sınıf',
        reportDate: new Date().toLocaleDateString('tr-TR'),
        ...progressData
    };
    
    // Create and download JSON file
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ilerleme-raporu-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('İlerleme raporu başarıyla indirildi!', 'success');
}

function shareProgress() {
    if (navigator.share) {
        const progressPercentage = document.querySelector('.progress-percentage').textContent;
        const totalPoints = document.querySelector('.stat-card:nth-child(3) .stat-number').textContent;
        
        navigator.share({
            title: 'K-12 Eğitim Platformu İlerlemem',
            text: `Bu hafta ${progressPercentage} ilerleme kaydettim ve ${totalPoints} puan topladım! 📚✨`,
            url: window.location.href
        }).then(() => {
            showNotification('İlerleme başarıyla paylaşıldı!', 'success');
        }).catch(err => {
            console.log('Paylaşım hatası:', err);
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    const progressPercentage = document.querySelector('.progress-percentage').textContent;
    const totalPoints = document.querySelector('.stat-card:nth-child(3) .stat-number').textContent;
    
    const shareText = `Bu hafta ${progressPercentage} ilerleme kaydettim ve ${totalPoints} puan topladım! K-12 Eğitim Platformu 📚✨`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Paylaşım metni panoya kopyalandı!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Paylaşım metni panoya kopyalandı!', 'success');
    }
}

// Chart Filter Functions
function updateChartPeriod(period) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-period') === period) {
            btn.classList.add('active');
        }
    });
    
    // Update chart data based on period
    switch(period) {
        case 'week':
            updateProgressChartData([65, 72, 80, 75, 85, 78, 92]);
            break;
        case 'month':
            updateProgressChartData([60, 68, 75, 82, 88, 85, 92, 89]);
            break;
        case 'semester':
            updateProgressChartData([45, 52, 61, 68, 74, 79, 85, 88, 92]);
            break;
    }
}

function updateProgressChartData(newData) {
    // This would update the chart with new data
    // Implementation depends on the chart library being used
    console.log('Updating chart with data:', newData);
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: 'white',
        zIndex: '10000',
        fontSize: '14px',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    });
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        notification.style.transition = 'transform 0.3s ease';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Event Listeners
document.addEventListener('click', function(e) {
    // Close modals when clicking outside
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
    
    // Handle filter button clicks
    if (e.target.classList.contains('filter-btn')) {
        const period = e.target.getAttribute('data-period');
        if (period) {
            updateChartPeriod(period);
        }
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close all modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});

// Auto-save progress data periodically
setInterval(saveProgressData, 30000); // Save every 30 seconds