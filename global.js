// ==========================================
// TEETEES ERRANDS - GLOBAL SCRIPTS
// ==========================================

// ==========================================
// 1. DARK MODE - CONTROLS ALL PAGES!
// ==========================================

// Toggle dark mode
function toggleDarkMode() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply theme
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button icon
    updateDarkToggleIcon(newTheme);
    
    console.log(`🌗 Theme changed to: ${newTheme}`);
}

// Update the toggle button icon
function updateDarkToggleIcon(theme) {
    const buttons = document.querySelectorAll('.dark-toggle');
    buttons.forEach(btn => {
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
}

// Load saved theme on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateDarkToggleIcon(savedTheme);
    console.log(`🌗 Theme loaded: ${savedTheme}`);
}

// Listen for theme changes across tabs/windows
window.addEventListener('storage', function(e) {
    if (e.key === 'theme') {
        const newTheme = e.newValue || 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateDarkToggleIcon(newTheme);
        console.log(`🌗 Theme synced from another tab: ${newTheme}`);
    }
});

// ==========================================
// 2. SERVICE WORKER REGISTRATION
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(reg) {
                console.log('✅ Service Worker registered!');
            })
            .catch(function(err) {
                console.log('❌ Service Worker error:', err);
            });
    });
}

// ==========================================
// 3. PWA INSTALL PROMPT
// ==========================================
let deferredPrompt;

window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    console.log('✅ App is installable!');
    
    // Show install banner if it exists
    const banner = document.getElementById('installBanner');
    if (banner) {
        banner.style.display = 'block';
    }
});

// Handle install banner click
document.addEventListener('DOMContentLoaded', function() {
    const banner = document.getElementById('installBanner');
    if (banner) {
        banner.addEventListener('click', function() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function(choiceResult) {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('✅ User installed the app!');
                        banner.style.display = 'none';
                    }
                    deferredPrompt = null;
                });
            } else {
                alert('📱 To install:\n\nOn Android: Tap menu → "Add to Home Screen"\nOn iPhone: Tap share → "Add to Home Screen"');
            }
        });
    }
});

// Hide install banner if already installed
window.addEventListener('appinstalled', function() {
    console.log('✅ App installed successfully!');
    const banner = document.getElementById('installBanner');
    if (banner) banner.style.display = 'none';
});

// Check if already installed
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    const banner = document.getElementById('installBanner');
    if (banner) banner.style.display = 'none';
    console.log('✅ App already installed');
}

// ==========================================
// 4. QUICK ORDER NAVIGATION
// ==========================================
function quickOrder(type) {
    const services = {
        groceries: '/grocery.html',
        prescription: '/prescription.html',
        gift: '/gift.html',
        dispatch: '/dispatch.html',
        elderly: '/elderly.html'
    };
    window.location.href = services[type] || '/services.html';
}

// ==========================================
// 5. TIME-BASED GREETING
// ==========================================
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good morning!';
    if (hour < 17) return '🌞 Good afternoon!';
    return '🌙 Good evening!';
}

// ==========================================
// 6. INITIALIZE EVERYTHING ON PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Load dark mode
    loadSavedTheme();
    
    // Update greeting if element exists
    const greetingEl = document.getElementById('greetingText');
    if (greetingEl) {
        greetingEl.textContent = getGreeting();
    }
    
    console.log('🚀 Teetees Errands PWA loaded!');
});