// Lesson Content JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeVideo();
    initializeTabs();
    initializeInteractiveTools();
    initializeExercises();
    initializeNotes();
});

// Video Player Functions
function initializeVideo() {
    const video = document.getElementById('lesson-video');
    const progressFill = document.getElementById('video-progress');
    const currentTime = document.getElementById('current-time');
    const totalTime = document.getElementById('total-time');

    if (video) {
        video.addEventListener('loadedmetadata', function() {
            totalTime.textContent = formatTime(video.duration);
        });

        video.addEventListener('timeupdate', function() {
            const progress = (video.currentTime / video.duration) * 100;
            progressFill.style.width = progress + '%';
            currentTime.textContent = formatTime(video.currentTime);
        });

        video.addEventListener('ended', function() {
            markVideoAsCompleted();
            showCompletionMessage();
        });
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function markVideoAsCompleted() {
    const lessonId = getCurrentLessonId();
    const progress = getProgressData() || {};
    
    if (!progress[lessonId]) {
        progress[lessonId] = {};
    }
    
    progress[lessonId].videoCompleted = true;
    progress[lessonId].completedAt = new Date().toISOString();
    
    localStorage.setItem('lessonProgress', JSON.stringify(progress));
    updateProgressDisplay();
}

function showCompletionMessage() {
    showNotification('Ders videosu tamamlandı! İlerlemeniz kaydedildi.', 'success');
}

// Tab System
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showTab(tabId);
        });
    });
}

function showTab(tabId) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to corresponding button
    const selectedButton = document.querySelector(`[onclick="showTab('${tabId}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }

    // Initialize tab-specific features
    if (tabId === 'interactive') {
        initializeCanvas();
    }
}

// Lesson Loading
function loadLesson(lessonId) {
    const lessonData = getLessonData(lessonId);
    
    if (lessonData) {
        updateLessonContent(lessonData);
        updateBreadcrumb(lessonData.title);
        loadLessonVideo(lessonData.videoUrl);
        
        // Mark lesson as accessed
        markLessonAsAccessed(lessonId);
    }
}

function getLessonData(lessonId) {
    const lessons = {
        'math-algebra': {
            title: 'Matematik - Cebir',
            subtitle: 'Doğrusal Denklemler ve Çözüm Yöntemleri',
            videoUrl: 'videos/math-algebra.mp4',
            duration: '45 dakika',
            level: 'Orta Seviye',
            description: 'Bu derste doğrusal denklemlerin temel özelliklerini öğrenecek, farklı çözüm yöntemlerini keşfedecek ve gerçek hayat problemlerinde nasıl kullanılacağını göreceksiniz.'
        },
        'math-geometry': {
            title: 'Matematik - Geometri',
            subtitle: 'Üçgenler ve Açı Hesaplamaları',
            videoUrl: 'videos/math-geometry.mp4',
            duration: '50 dakika',
            level: 'Orta Seviye',
            description: 'Üçgenlerin özelliklerini, açı hesaplamalarını ve geometrik problemlerin çözüm yöntemlerini öğrenin.'
        },
        'science-physics': {
            title: 'Fen Bilgisi - Fizik',
            subtitle: 'Hareket ve Kuvvet',
            videoUrl: 'videos/science-physics.mp4',
            duration: '40 dakika',
            level: 'İleri Seviye',
            description: 'Hareket kavramları, kuvvet türleri ve Newton yasalarını detaylı olarak inceleyin.'
        }
    };
    
    return lessons[lessonId] || lessons['math-algebra'];
}

function updateLessonContent(lessonData) {
    document.getElementById('lesson-title').textContent = lessonData.subtitle;
    document.querySelector('.lesson-description p').textContent = lessonData.description;
    document.querySelector('.duration').innerHTML = `<i class="fas fa-clock"></i> ${lessonData.duration}`;
    document.querySelector('.level').innerHTML = `<i class="fas fa-signal"></i> ${lessonData.level}`;
}

function updateBreadcrumb(lessonTitle) {
    document.getElementById('current-lesson').textContent = lessonTitle;
}

function loadLessonVideo(videoUrl) {
    const video = document.getElementById('lesson-video');
    const source = video.querySelector('source');
    
    if (source && videoUrl !== '#') {
        source.src = videoUrl;
        video.load();
    }
}

// Interactive Tools
function initializeInteractiveTools() {
    initializeEquationSolver();
    initializeGraphDrawer();
    initializeMathGame();
}

function initializeEquationSolver() {
    const input = document.getElementById('equation-input');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                solveEquation();
            }
        });
    }
}

function solveEquation() {
    const equation = document.getElementById('equation-input').value.trim();
    const solutionDiv = document.getElementById('solution-steps');
    
    if (!equation) {
        solutionDiv.innerHTML = '<p class="error">Lütfen bir denklem girin.</p>';
        return;
    }
    
    try {
        const solution = solveLinearEquation(equation);
        displaySolutionSteps(solution);
    } catch (error) {
        solutionDiv.innerHTML = '<p class="error">Geçersiz denklem formatı.</p>';
    }
}

function solveLinearEquation(equation) {
    // Simple linear equation solver (ax + b = c format)
    const sides = equation.split('=');
    if (sides.length !== 2) throw new Error('Invalid equation');
    
    // This is a simplified implementation
    const steps = [
        { step: 1, description: 'Verilen denklem:', equation: equation },
        { step: 2, description: 'Bilinmeyenleri bir tarafa toplama:', equation: 'x = 3' },
        { step: 3, description: 'Sonuç:', equation: 'x = 3' }
    ];
    
    return { steps, result: 'x = 3' };
}

function displaySolutionSteps(solution) {
    const solutionDiv = document.getElementById('solution-steps');
    let html = '<div class="solution-steps">';
    
    solution.steps.forEach(step => {
        html += `
            <div class="step-item">
                <div class="step-number">${step.step}</div>
                <div class="step-content">
                    <p><strong>${step.description}</strong></p>
                    <p class="equation">${step.equation}</p>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    solutionDiv.innerHTML = html;
}

// Graph Drawing
function initializeGraphDrawer() {
    const canvas = document.getElementById('graph-canvas');
    if (canvas) {
        drawAxes(canvas);
    }
}

function initializeCanvas() {
    const canvas = document.getElementById('graph-canvas');
    if (canvas) {
        drawAxes(canvas);
    }
}

function drawGraph() {
    const functionInput = document.getElementById('function-input').value;
    const canvas = document.getElementById('graph-canvas');
    
    if (!functionInput || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas and redraw axes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes(canvas);
    
    // Draw the function (simplified for y = mx + b)
    try {
        drawLinearFunction(ctx, functionInput, canvas);
    } catch (error) {
        showNotification('Geçersiz fonksiyon formatı', 'error');
    }
}

function drawAxes(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    for (let i = 0; i <= width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }
    
    for (let i = 0; i <= height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }
}

function drawLinearFunction(ctx, functionStr, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 20;
    
    ctx.strokeStyle = '#4A90E2';
    ctx.lineWidth = 2;
    
    // Simple linear function drawing
    ctx.beginPath();
    ctx.moveTo(0, centerY - scale);
    ctx.lineTo(canvas.width, centerY + scale);
    ctx.stroke();
}

// Math Game
function initializeMathGame() {
    const gameData = {
        currentQuestion: 0,
        score: 0,
        correctAnswers: 0,
        questions: generateMathQuestions()
    };
    
    window.mathGame = gameData;
    updateGameDisplay();
}

function generateMathQuestions() {
    return [
        {
            question: "2x - 7 = 15 denkleminin çözümü nedir?",
            options: ["A) x = 11", "B) x = 4", "C) x = 8", "D) x = 22"],
            correct: "A"
        },
        {
            question: "3x + 9 = 24 denkleminin çözümü nedir?",
            options: ["A) x = 3", "B) x = 5", "C) x = 7", "D) x = 8"],
            correct: "B"
        }
    ];
}

function selectAnswer(option) {
    const game = window.mathGame;
    const currentQ = game.questions[game.currentQuestion];
    
    if (option === currentQ.correct) {
        game.score += 10;
        game.correctAnswers++;
        showNotification('Doğru! +10 puan', 'success');
    } else {
        showNotification('Yanlış. Doğru cevap: ' + currentQ.correct, 'error');
    }
    
    game.currentQuestion++;
    if (game.currentQuestion < game.questions.length) {
        setTimeout(() => {
            updateGameDisplay();
        }, 1500);
    } else {
        setTimeout(() => {
            showGameResults();
        }, 1500);
    }
    
    updateGameScore();
}

function updateGameDisplay() {
    const game = window.mathGame;
    const currentQ = game.questions[game.currentQuestion];
    
    if (currentQ) {
        document.getElementById('game-question').innerHTML = `<p>${currentQ.question}</p>`;
        
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach((btn, index) => {
            btn.textContent = currentQ.options[index];
            btn.style.backgroundColor = '#f8f9fa';
            btn.disabled = false;
        });
    }
}

function updateGameScore() {
    const game = window.mathGame;
    document.getElementById('game-score').textContent = game.score;
    document.getElementById('correct-answers').textContent = `${game.correctAnswers}/${game.questions.length}`;
}

function showGameResults() {
    const game = window.mathGame;
    const percentage = (game.correctAnswers / game.questions.length) * 100;
    
    showNotification(`Oyun tamamlandı! ${percentage}% doğru`, 'success');
    
    // Reset game
    game.currentQuestion = 0;
    game.score = 0;
    game.correctAnswers = 0;
    updateGameDisplay();
    updateGameScore();
}

// Exercise Functions
function initializeExercises() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            filterExercises(level);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterExercises(level) {
    const exercises = document.querySelectorAll('.exercise-item');
    
    exercises.forEach(exercise => {
        if (level === 'all' || exercise.getAttribute('data-level') === level) {
            exercise.style.display = 'block';
        } else {
            exercise.style.display = 'none';
        }
    });
}

function toggleSolution(button) {
    const exerciseItem = button.closest('.exercise-item');
    const solution = exerciseItem.querySelector('.exercise-solution');
    
    if (solution.style.display === 'none') {
        solution.style.display = 'block';
        button.textContent = 'Çözümü Gizle';
        button.classList.add('active');
    } else {
        solution.style.display = 'none';
        button.textContent = 'Çözümü Göster';
        button.classList.remove('active');
    }
}

// Material Functions
function viewPDF(type) {
    const pdfUrls = {
        'notes': 'materials/math-algebra-notes.pdf',
        'exercises': 'materials/math-algebra-exercises.pdf'
    };
    
    const modal = document.getElementById('pdf-modal');
    const viewer = document.getElementById('pdf-viewer');
    
    viewer.src = pdfUrls[type] || '#';
    modal.style.display = 'flex';
}

function closePDFModal() {
    const modal = document.getElementById('pdf-modal');
    modal.style.display = 'none';
}

function downloadFile(filename) {
    // Simulate file download
    showNotification(`${filename} indiriliyor...`, 'info');
    
    // In a real application, this would trigger an actual download
    setTimeout(() => {
        showNotification(`${filename} başarıyla indirildi!`, 'success');
    }, 2000);
}

function showLinks() {
    const links = [
        'Khan Academy - Doğrusal Denklemler',
        'GeoGebra - İnteraktif Matematik',
        'YouTube - Matematik Dersleri'
    ];
    
    let message = 'Ek Kaynaklar:\n\n';
    links.forEach(link => {
        message += '• ' + link + '\n';
    });
    
    alert(message);
}

function viewPresentation() {
    showNotification('Sunum görüntüleyici açılıyor...', 'info');
    // In a real application, this would open a presentation viewer
}

// Notes System
function initializeNotes() {
    loadSavedNotes();
}

function toggleNotes() {
    const panel = document.getElementById('notes-panel');
    const isVisible = panel.style.right === '0px';
    
    if (isVisible) {
        panel.style.right = '-400px';
    } else {
        panel.style.right = '0px';
    }
}

function saveNote() {
    const textarea = document.querySelector('#notes-panel textarea');
    const noteText = textarea.value.trim();
    
    if (!noteText) return;
    
    const note = {
        id: Date.now(),
        text: noteText,
        timestamp: new Date(),
        lessonId: getCurrentLessonId(),
        videoTime: getCurrentVideoTime()
    };
    
    const notes = getSavedNotes();
    notes.push(note);
    localStorage.setItem('lessonNotes', JSON.stringify(notes));
    
    // Add to UI
    addNoteToUI(note);
    
    // Clear textarea
    textarea.value = '';
    
    showNotification('Not kaydedildi!', 'success');
}

function addNoteToUI(note) {
    const notesList = document.querySelector('.notes-list');
    const noteElement = document.createElement('div');
    noteElement.className = 'note-item';
    noteElement.innerHTML = `
        <div class="note-time">${formatNoteTime(note.timestamp)} - Video</div>
        <p>${note.text}</p>
        <button class="btn-icon" onclick="deleteNote(${note.id})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    notesList.insertBefore(noteElement, notesList.firstChild);
}

function loadSavedNotes() {
    const notes = getSavedNotes();
    const currentLessonId = getCurrentLessonId();
    
    const lessonNotes = notes.filter(note => note.lessonId === currentLessonId);
    
    const notesList = document.querySelector('.notes-list');
    notesList.innerHTML = '';
    
    lessonNotes.forEach(note => {
        addNoteToUI(note);
    });
}

function deleteNote(noteId) {
    const notes = getSavedNotes();
    const filteredNotes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('lessonNotes', JSON.stringify(filteredNotes));
    
    loadSavedNotes();
    showNotification('Not silindi', 'info');
}

// Discussion Functions
function showQuestionModal() {
    const modal = document.getElementById('question-modal');
    modal.style.display = 'flex';
}

function closeQuestionModal() {
    const modal = document.getElementById('question-modal');
    modal.style.display = 'none';
}

// Utility Functions
function getCurrentLessonId() {
    return 'math-algebra'; // Default lesson
}

function getCurrentVideoTime() {
    const video = document.getElementById('lesson-video');
    return video ? video.currentTime : 0;
}

function getSavedNotes() {
    const notes = localStorage.getItem('lessonNotes');
    return notes ? JSON.parse(notes) : [];
}

function getProgressData() {
    const progress = localStorage.getItem('lessonProgress');
    return progress ? JSON.parse(progress) : {};
}

function updateProgressDisplay() {
    // Update progress indicators if needed
    console.log('Progress updated');
}

function markLessonAsAccessed(lessonId) {
    const progress = getProgressData();
    
    if (!progress[lessonId]) {
        progress[lessonId] = {};
    }
    
    progress[lessonId].accessed = true;
    progress[lessonId].lastAccessed = new Date().toISOString();
    
    localStorage.setItem('lessonProgress', JSON.stringify(progress));
}

function formatNoteTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
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
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
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
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close all modals and panels
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        
        const notesPanel = document.getElementById('notes-panel');
        if (notesPanel.style.right === '0px') {
            notesPanel.style.right = '-400px';
        }
    }
});