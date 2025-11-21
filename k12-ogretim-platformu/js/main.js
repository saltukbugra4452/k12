// ===== MAIN JAVASCRIPT FILE =====
// EduPlatform Ana JavaScript Dosyası

// ===== GLOBAL VARIABLES =====
let currentUser = null;
let isLoggedIn = false;

// ===== UTILITY FUNCTIONS =====

/**
 * DOM Ready fonksiyonu
 */
function domReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

/**
 * Element seçici yardımcı fonksiyon
 */
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Animate CSS sınıfı ekleme
 */
function animateCSS(element, animationName, callback = null) {
    const node = typeof element === 'string' ? $(element) : element;
    if (!node) return;
    
    node.classList.add('animate__animated', `animate__${animationName}`);
    
    function handleAnimationEnd() {
        node.classList.remove('animate__animated', `animate__${animationName}`);
        node.removeEventListener('animationend', handleAnimationEnd);
        
        if (typeof callback === 'function') callback();
    }
    
    node.addEventListener('animationend', handleAnimationEnd);
}

/**
 * Loading gösterici
 */
function showLoading(message = 'Yükleniyor...') {
    let loadingEl = $('#globalLoading');
    if (!loadingEl) {
        loadingEl = document.createElement('div');
        loadingEl.id = 'globalLoading';
        loadingEl.className = 'loading-overlay active';
        loadingEl.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loadingEl);
    } else {
        loadingEl.querySelector('p').textContent = message;
        loadingEl.classList.add('active');
    }
}

function hideLoading() {
    const loadingEl = $('#globalLoading');
    if (loadingEl) {
        loadingEl.classList.remove('active');
    }
}

/**
 * Toast bildirimleri
 */
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Toast container oluştur
    let container = $('#toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(toast);
    
    // Animasyon
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto hide
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

/**
 * Modal işlemleri
 */
function showModal(modalId) {
    const modal = $(`#${modalId}`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = $(`#${modalId}`);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Form validasyonu
 */
function validateForm(formId) {
    const form = $(`#${formId}`);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const errorEl = $(`#${input.name}Error`) || $(`#${input.id}Error`);
        
        if (!input.value.trim()) {
            showFieldError(input, 'Bu alan zorunludur');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showFieldError(input, 'Geçerli bir e-posta adresi girin');
            isValid = false;
        } else {
            hideFieldError(input);
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('error');
    const errorEl = $(`#${input.name}Error`) || $(`#${input.id}Error`);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

function hideFieldError(input) {
    input.classList.remove('error');
    const errorEl = $(`#${input.name}Error`) || $(`#${input.id}Error`);
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Local Storage yardımcıları
 */
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Local storage error:', error);
    }
}

function getLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Local storage error:', error);
        return defaultValue;
    }
}

function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Local storage error:', error);
    }
}

/**
 * API istekleri için yardımcı fonksiyon
 */
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
    
    // Auth token varsa ekle
    const token = getLocalStorage('auth_token');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
        showLoading();
        const response = await fetch(url, finalOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Bir hata oluştu');
        }
        
        return data;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

/**
 * Tarih formatlaması
 */
function formatDate(date, format = 'DD.MM.YYYY') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    switch (format) {
        case 'DD.MM.YYYY':
            return `${day}.${month}.${year}`;
        case 'DD.MM.YYYY HH:mm':
            return `${day}.${month}.${year} ${hours}:${minutes}`;
        case 'relative':
            return getRelativeTime(d);
        default:
            return `${day}.${month}.${year}`;
    }
}

function getRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Az önce';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`;
    
    return formatDate(date);
}

/**
 * Dosya boyutu formatlaması
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * URL parametrelerini al
 */
function getURLParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Smooth scroll
 */
function smoothScrollTo(element, offset = 0) {
    const targetElement = typeof element === 'string' ? $(element) : element;
    if (!targetElement) return;
    
    const targetPosition = targetElement.offsetTop - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Debounce fonksiyonu
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle fonksiyonu
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== NAVIGATION =====

/**
 * Mobil menu toggle
 */
function initMobileMenu() {
    const hamburger = $('.hamburger');
    const navMenu = $('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Menu linklerine tıklandığında menu'yu kapat
        const navLinks = $$('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

/**
 * Navbar scroll effect
 */
function initNavbarScroll() {
    const header = $('.header');
    if (!header) return;
    
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 100));
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const anchorLinks = $$('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = $(`#${targetId}`);
            
            if (targetElement) {
                smoothScrollTo(targetElement, 80);
            }
        });
    });
}

// ===== ANIMATIONS =====

/**
 * Scroll reveal animasyonları
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elements = $$('.feature-card, .course-card, .stat-card, .testimonial-card');
    elements.forEach(el => {
        observer.observe(el);
    });
}

// ===== FORM HANDLERS =====

/**
 * İletişim formu
 */
function initContactForm() {
    const contactForm = $('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm('contactForm')) return;
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Simüle edilmiş API çağrısı
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showToast('Mesajınız başarıyla gönderildi!', 'success');
            contactForm.reset();
        } catch (error) {
            showToast('Mesaj gönderirken bir hata oluştu.', 'error');
        }
    });
}

// ===== SEARCH FUNCTIONALITY =====

/**
 * Arama işlevi
 */
function initSearch() {
    const searchInput = $('.search-box input');
    if (!searchInput) return;
    
    const debouncedSearch = debounce(performSearch, 300);
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            debouncedSearch(query);
        }
    });
}

async function performSearch(query) {
    try {
        // Simüle edilmiş arama
        console.log('Searching for:', query);
        
        // Gerçek uygulamada API çağrısı yapılacak
        // const results = await apiRequest('/api/search', {
        //     method: 'POST',
        //     body: JSON.stringify({ query })
        // });
        
        // showSearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
    }
}

// ===== USER AUTHENTICATION =====

/**
 * Kullanıcı giriş durumunu kontrol et
 */
function checkAuthStatus() {
    const token = getLocalStorage('auth_token');
    const userData = getLocalStorage('user_data');
    
    if (token && userData) {
        isLoggedIn = true;
        currentUser = userData;
        updateUIForLoggedInUser();
    } else {
        isLoggedIn = false;
        currentUser = null;
        updateUIForLoggedOutUser();
    }
}

function updateUIForLoggedInUser() {
    const authButtons = $('.nav-auth');
    if (authButtons && currentUser) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <img src="${currentUser.avatar || '../images/default-avatar.jpg'}" alt="Profil" class="user-avatar">
                <span>${currentUser.firstName}</span>
                <div class="dropdown">
                    <a href="pages/dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                    <a href="pages/profile.html"><i class="fas fa-user"></i> Profil</a>
                    <a href="pages/settings.html"><i class="fas fa-cog"></i> Ayarlar</a>
                    <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Çıkış</a>
                </div>
            </div>
        `;
    }
}

function updateUIForLoggedOutUser() {
    const authButtons = $('.nav-auth');
    if (authButtons) {
        authButtons.innerHTML = `
            <a href="pages/login.html" class="btn btn-outline">Giriş Yap</a>
            <a href="pages/register.html" class="btn btn-primary">Kayıt Ol</a>
        `;
    }
}

function logout() {
    removeLocalStorage('auth_token');
    removeLocalStorage('user_data');
    isLoggedIn = false;
    currentUser = null;
    
    showToast('Başarıyla çıkış yapıldı', 'success');
    
    // Ana sayfaya yönlendir
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

// ===== THEME MANAGEMENT =====

/**
 * Tema yönetimi
 */
function initTheme() {
    const savedTheme = getLocalStorage('theme', 'light');
    setTheme(savedTheme);
    
    const themeToggle = $('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    setLocalStorage('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// ===== PERFORMANCE OPTIMIZATION =====

/**
 * Lazy loading for images
 */
function initLazyLoading() {
    const lazyImages = $$('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// ===== ERROR HANDLING =====

/**
 * Global error handler
 */
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        
        // Kullanıcıya gösterilmeyecek teknik hatalar için
        if (process.env.NODE_ENV === 'development') {
            showToast(`Error: ${e.error.message}`, 'error');
        }
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        
        if (process.env.NODE_ENV === 'development') {
            showToast(`Promise Error: ${e.reason}`, 'error');
        }
    });
}

// ===== INITIALIZATION =====

/**
 * Ana başlatma fonksiyonu
 */
function init() {
    // Auth durumunu kontrol et
    checkAuthStatus();
    
    // Temel işlevleri başlat
    initMobileMenu();
    initNavbarScroll();
    initSmoothScroll();
    initScrollReveal();
    initContactForm();
    initSearch();
    initTheme();
    initLazyLoading();
    initErrorHandling();
    
    console.log('EduPlatform initialized successfully');
}

// ===== DOM READY =====
domReady(init);

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showToast,
        showModal,
        hideModal,
        validateForm,
        apiRequest,
        formatDate,
        formatFileSize,
        setLocalStorage,
        getLocalStorage,
        removeLocalStorage
    };
}