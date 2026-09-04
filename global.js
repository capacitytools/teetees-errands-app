// ==========================================
// TEETEES ERRANDS - GLOBAL SCRIPTS
// ==========================================

// DARK MODE
function toggleDarkMode() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    const btn = document.getElementById('darkToggle');
    if (btn) btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// LOAD SAVED THEME
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const btn = document.getElementById('darkToggle');
    if (btn) btn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
});

// SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Service Worker registered!'))
            .catch(err => console.log('❌ Service Worker error:', err));
    });
}

// PWA INSTALL
let deferredPrompt;
window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    console.log('✅ App is installable!');
});

// QUICK ORDER
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

// TIME-BASED GREETING
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good morning!';
    if (hour < 17) return '🌞 Good afternoon!';
    return '🌙 Good evening!';
}

console.log('🚀 Teetees Errands PWA loaded!');
