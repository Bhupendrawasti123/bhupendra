// Birthday data
const birthdayData = {
    name: "....", // Default name
    pic: "https://i.imgur.com/JQWUQfZ.jpg", // Default photo
    wishes: [
        {
            message: "Every year is another peak to conquer. May this birthday mark the beginning of your most victorious climb yet!",
            icon: "⛰️",
            animation: "rotate-animation"
        },
        {
            message: "Like the phoenix, may you rise stronger with each passing year. Your best chapters are still being written!",
            icon: "🔥",
            animation: "bounce-animation"
        },
        {
            message: "May this birthday point you toward your true north - where purpose meets passion and dreams become destinations.",
            icon: "🧭",
            animation: "rotate-animation"
        },
        {
            message: "Today begins a new chapter in your extraordinary story. Make it one where obstacles become opportunities!",
            icon: "📖",
            animation: "bounce-animation"
        },
        {
            message: "You've been a light for so many others - may this birthday illuminate your own brightest path forward.",
            icon: "💡",
            animation: "rotate-animation"
        }
    ]
};

// Get parameters from URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('name')) birthdayData.name = urlParams.get('name');
if (urlParams.get('pic')) birthdayData.pic = urlParams.get('pic');
if (urlParams.get('theme')) {
    document.body.className = urlParams.get('theme');
}

// DOM elements
const birthdayName = document.getElementById('birthdayName');
const birthdayPic = document.getElementById('birthdayPic');
const birthdayMessage = document.getElementById('birthdayMessage');
const themeIcon = document.getElementById('themeIcon');
const refreshBtn = document.getElementById('refreshBtn');
const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const closeInfo = document.getElementById('closeInfo');

// Preload images
const preloadImage = new Image();
preloadImage.src = 'https://i.imgur.com/JQWUQfZ.jpg';

// Load user image if different
if (birthdayData.pic !== preloadImage.src) {
    const userImage = new Image();
    userImage.src = birthdayData.pic;
}

// Randomly select and display a wish
let randomWish;

function getRandomWish() {
    randomWish = birthdayData.wishes[Math.floor(Math.random() * birthdayData.wishes.length)];
    applyWish();
}

function applyWish() {
    birthdayName.textContent = birthdayData.name;
    birthdayPic.src = birthdayData.pic;
    birthdayMessage.textContent = randomWish.message;
    
    themeIcon.textContent = randomWish.icon;
    themeIcon.className = 'theme-icon ' + randomWish.animation;
    
    // Ensure image is visible after load
    birthdayPic.onload = function() {
        this.style.opacity = 1;
    };
    
    birthdayPic.onerror = function() {
        this.src = 'https://i.imgur.com/JQWUQfZ.jpg';
        this.style.opacity = 1;
    };
}

// Change color theme
function changeTheme(theme) {
    document.body.className = theme;
    // Update URL without reload
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('theme', theme);
    window.history.pushState({}, '', newUrl);
}

// Create optimized confetti
function createConfetti() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 10 : 20;
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', '#ff9ff3', '#a29bfe'];
    
    // Reuse existing confetti elements if possible
    const existingConfetti = document.querySelectorAll('.confetti');
    const reusable = Math.min(existingConfetti.length, count);
    
    for (let i = 0; i < count; i++) {
        let confetti;
        if (i < reusable) {
            confetti = existingConfetti[i];
            confetti.style.animation = 'none';
            void confetti.offsetWidth; // Trigger reflow
        } else {
            confetti = document.createElement('div');
            confetti.className = 'confetti';
            document.body.appendChild(confetti);
        }
        
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 2) + 's';
        confetti.style.animationName = 'confettiFall';
        
        setTimeout(() => {
            if (confetti.parentNode === document.body) {
                confetti.remove();
            }
        }, 5000);
    }
}

// Info modal functionality
infoBtn.addEventListener('click', function() {
    infoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

closeInfo.addEventListener('click', function() {
    infoModal.style.display = 'none';
    document.body.style.overflow = '';
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === infoModal) {
        infoModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        location.reload();
    }
    if (e.key === 'Escape' && infoModal.style.display === 'flex') {
        infoModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Make theme buttons keyboard accessible
document.querySelectorAll('.theme-btn').forEach((btn, index) => {
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            btn.click();
        }
    });
});

// Add touch feedback for mobile
refreshBtn.addEventListener('touchstart', function() {
    this.style.transform = 'scale(0.95)';
});

refreshBtn.addEventListener('touchend', function() {
    this.style.transform = 'scale(1)';
});

// Initial setup
getRandomWish();

// Create confetti on load and every 3 seconds
window.addEventListener('load', function() {
    createConfetti();
    
    // Only continue animation if not in reduced motion mode
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInterval(createConfetti, 3000);
    }
    
    // Set focus on the refresh button for keyboard users
    refreshBtn.focus();
});

// Handle theme persistence on page refresh
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('theme')) {
        document.body.className = urlParams.get('theme');
    }
});
