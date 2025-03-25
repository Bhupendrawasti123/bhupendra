// Birthday data
const birthdayData = {
    name: "Friend", // Default name
    pic: "https://i.imgur.com/JQWUQfZ.jpg", // Default photo
    wishes: [
        {
            title: "Mountain Climbing Theme",
            message: "Every year is another peak to conquer. May this birthday mark the beginning of your most victorious climb yet!",
            icon: "⛰️",
            animation: "rotate-animation"
        },
        {
            title: "Phoenix Rising Theme",
            message: "Like the phoenix, may you rise stronger with each passing year. Your best chapters are still being written!",
            icon: "🔥",
            animation: "bounce-animation"
        },
        {
            title: "True North Theme",
            message: "May this birthday point you toward your true north - where purpose meets passion and dreams become destinations.",
            icon: "🧭",
            animation: "rotate-animation"
        },
        {
            title: "New Chapter Theme",
            message: "Today begins a new chapter in your extraordinary story. Make it one where obstacles become opportunities!",
            icon: "📖",
            animation: "bounce-animation"
        },
        {
            title: "Light Inspiration Theme",
            message: "You've been a light for so many others - may this birthday illuminate your own brightest path forward.",
            icon: "💡",
            animation: "rotate-animation"
        },
        {
            title: "Growing Oak Theme",
            message: "The mightiest oaks grow from small seeds. Keep nurturing your potential - your growth inspires us all!",
            icon: "🌱",
            animation: "bounce-animation"
        },
        {
            title: "Starry Potential Theme",
            message: "Your potential is as limitless as the stars. Chart a course this year that makes the universe proud!",
            icon: "🌠",
            animation: "rotate-animation"
        },
        {
            title: "Bridge to Better Theme",
            message: "Birthdays are bridges to better versions of ourselves. Step boldly onto yours - the view gets better ahead!",
            icon: "🌉",
            animation: "bounce-animation"
        },
        {
            title: "Diamond Strength Theme",
            message: "Remember: Diamonds form under pressure. Every challenge you've faced has made you more brilliant!",
            icon: "💎",
            animation: "rotate-animation"
        },
        {
            title: "Sailing Adventure Theme",
            message: "May your coming year have just enough wind to be exciting, and just enough calm to enjoy the journey.",
            icon: "⛵",
            animation: "bounce-animation"
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

// Check if this is a shared card view
if (urlParams.has('name') || urlParams.has('pic') || urlParams.has('theme') || urlParams.has('message')) {
    document.body.classList.add('shared-card');
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
const customName = document.getElementById('customName');
const customPic = document.getElementById('customPic');
const customMessage = document.getElementById('customMessage');
const saveBtn = document.getElementById('saveBtn');
const shareUrl = document.getElementById('shareUrl');
const copyBtn = document.getElementById('copyBtn');
const backBtn = document.getElementById('backBtn');
const customizeForm = document.getElementById('customizeForm');
const shareSection = document.getElementById('shareSection');

// Preload images
const preloadImage = new Image();
preloadImage.src = 'https://i.imgur.com/JQWUQfZ.jpg';

// Load user image if different
if (birthdayData.pic !== preloadImage.src) {
    const userImage = new Image();
    userImage.src = birthdayData.pic;
}

// Initialize message dropdown
function initMessageDropdown() {
    // Clear existing options except first
    while (customMessage.options.length > 1) {
        customMessage.remove(1);
    }
    
    // Add message options
    birthdayData.wishes.forEach((wish, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = wish.title;
        customMessage.appendChild(option);
    });
}

// Randomly select and display a wish
let randomWish;

function getRandomWish() {
    randomWish = birthdayData.wishes[Math.floor(Math.random() * birthdayData.wishes.length)];
    applyWish();
}

function applyWish(selectedIndex = null) {
    if (selectedIndex !== null && selectedIndex >= 0 && selectedIndex < birthdayData.wishes.length) {
        randomWish = birthdayData.wishes[selectedIndex];
    } else {
        // Get random wish if no specific selection
        randomWish = birthdayData.wishes[Math.floor(Math.random() * birthdayData.wishes.length)];
    }
    
    birthdayName.textContent = birthdayData.name;
    birthdayPic.src = birthdayData.pic;
    birthdayMessage.textContent = randomWish.message;
    
    themeIcon.textContent = randomWish.icon;
    themeIcon.className = 'theme-icon ' + randomWish.animation;
    
    // Update dropdown to show current selection
    if (selectedIndex !== null) {
        customMessage.value = selectedIndex;
    } else {
        customMessage.value = 'random';
    }
    
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

// Theme selection in form
function selectTheme(theme) {
    document.querySelectorAll('.theme-btn-form').forEach(btn => {
        btn.classList.remove('active-theme');
    });
    event.target.classList.add('active-theme');
    changeTheme(theme);
}

// Save and create share link
saveBtn.addEventListener('click', function() {
    const name = customName.value.trim() || 'Friend';
    const pic = customPic.value.trim() || 'https://i.imgur.com/JQWUQfZ.jpg';
    const theme = document.body.className;
    const messageIndex = customMessage.value === 'random' ? null : parseInt(customMessage.value);
    
    // Update the display
    birthdayData.name = name;
    birthdayData.pic = pic;
    applyWish(messageIndex);
    
    // Generate share URL
    const url = new URL(window.location.href);
    url.searchParams.set('name', encodeURIComponent(name));
    if (pic !== 'https://i.imgur.com/JQWUQfZ.jpg') {
        url.searchParams.set('pic', encodeURIComponent(pic));
    }
    url.searchParams.set('theme', theme);
    
    // Add message index if specific message is selected
    if (messageIndex !== null) {
        url.searchParams.set('message', messageIndex);
    }
    
    shareUrl.value = url.toString();
    
    // Show share section
    customizeForm.style.display = 'none';
    shareSection.style.display = 'block';
});

// Copy link to clipboard
copyBtn.addEventListener('click', function() {
    shareUrl.select();
    document.execCommand('copy');
    
    // Show feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 2000);
});

// Back to customization
backBtn.addEventListener('click', function() {
    shareSection.style.display = 'none';
    customizeForm.style.display = 'block';
});

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
        getRandomWish();
    }
    if (e.key === 'Escape' && infoModal.style.display === 'flex') {
        infoModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Make theme buttons keyboard accessible
document.querySelectorAll('.theme-btn, .theme-btn-form').forEach((btn, index) => {
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

// Initialize on load
window.addEventListener('load', function() {
    initMessageDropdown();
    
    // Handle URL message parameter
    if (urlParams.has('message')) {
        const messageIndex = parseInt(urlParams.get('message'));
        if (!isNaN(messageIndex) {
            applyWish(messageIndex);
            customMessage.value = messageIndex;
        } else {
            getRandomWish();
        }
    } else {
        getRandomWish();
    }
    
    // Set form values
    customName.value = birthdayData.name;
    customPic.value = birthdayData.pic;
    
    // Initialize theme buttons
    document.querySelectorAll('.theme-btn-form').forEach(btn => {
        if (btn.classList.contains(document.body.className.replace('theme-', '') + '-btn')) {
            btn.classList.add('active-theme');
        }
    });
    
    // Create confetti
    createConfetti();
    
    // Only continue animation if not in reduced motion mode
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInterval(createConfetti, 3000);
    }
    
    // Set focus on the name field for keyboard users
    if (!document.body.classList.contains('shared-card')) {
        customName.focus();
    }
});

// Refresh button functionality
refreshBtn.addEventListener('click', function() {
    getRandomWish();
});
