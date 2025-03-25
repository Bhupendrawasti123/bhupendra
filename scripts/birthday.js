// Birthday data
const birthdayData = {
    name: "Friend",
    pic: "https://i.imgur.com/JQWUQfZ.jpg",
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
        // ... (include all 20 messages from previous code)
    ]
};

// Sound effects
const soundEffects = {
    confetti: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'),
    message: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3'),
    theme: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3'),
    form: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3')
};

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
let randomWish;

// Initialize the page
function init() {
    // Set from URL parameters if they exist
    if (urlParams.get('name')) birthdayData.name = urlParams.get('name');
    if (urlParams.get('pic')) birthdayData.pic = urlParams.get('pic');
    
    // Initialize form
    initializeForm();
    
    // Set theme
    const theme = urlParams.get('theme') || localStorage.getItem('birthdayTheme') || 'default';
    changeTheme(theme);
    document.getElementById('userTheme').value = theme;
    
    // Set message
    if (urlParams.get('message')) {
        const messageIndex = parseInt(urlParams.get('message'));
        if (messageIndex >= 0 && messageIndex < birthdayData.wishes.length) {
            randomWish = birthdayData.wishes[messageIndex];
            document.getElementById('userMessage').value = messageIndex;
        } else {
            getRandomWish();
        }
    } else {
        getRandomWish();
    }
    
    // Apply the wish
    applyWish();
    
    // Show share URL if custom parameters exist
    if (urlParams.toString()) {
        generateShareUrl();
    }
    
    // Start confetti
    createConfetti();
    setInterval(createConfetti, 3000);
}

// Get random wish
function getRandomWish() {
    soundEffects.message.currentTime = 0;
    soundEffects.message.volume = 0.5;
    soundEffects.message.play();
    randomWish = birthdayData.wishes[Math.floor(Math.random() * birthdayData.wishes.length)];
}

// Apply wish to the page
function applyWish() {
    document.getElementById('birthdayName').textContent = birthdayData.name;
    document.getElementById('birthdayPic').src = birthdayData.pic;
    document.getElementById('birthdayMessage').textContent = randomWish.message;
    
    const themeIcon = document.getElementById('themeIcon');
    themeIcon.textContent = randomWish.icon;
    themeIcon.className = 'theme-icon ' + randomWish.animation;
}

// Change theme
function changeTheme(theme) {
    soundEffects.theme.currentTime = 0;
    soundEffects.theme.volume = 0.3;
    soundEffects.theme.play();
    document.body.className = theme;
    localStorage.setItem('birthdayTheme', theme);
}

// Initialize form
function initializeForm() {
    const messageSelect = document.getElementById('userMessage');
    
    // Clear existing options except the first one
    while (messageSelect.options.length > 1) {
        messageSelect.remove(1);
    }
    
    // Add all messages as options
    birthdayData.wishes.forEach((wish, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = wish.message.substring(0, 50) + '...';
        messageSelect.appendChild(option);
    });
    
    // Set form values
    document.getElementById('userName').value = birthdayData.name;
    document.getElementById('userPic').value = birthdayData.pic;
}

// Form submission
document.getElementById('birthdayForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    soundEffects.form.currentTime = 0;
    soundEffects.form.volume = 0.4;
    soundEffects.form.play();
    
    // Get form values
    birthdayData.name = document.getElementById('userName').value || "Friend";
    birthdayData.pic = document.getElementById('userPic').value || "https://i.imgur.com/JQWUQfZ.jpg";
    
    const messageIndex = document.getElementById('userMessage').value;
    if (messageIndex === 'random') {
        getRandomWish();
    } else {
        randomWish = birthdayData.wishes[messageIndex];
    }
    
    // Apply theme
    const theme = document.getElementById('userTheme').value;
    changeTheme(theme);
    
    // Update the card
    applyWish();
    
    // Hide form and show share URL
    document.getElementById('customizeForm').style.display = 'none';
    generateShareUrl();
});

// Generate share URL
function generateShareUrl() {
    const shareUrl = new URL(window.location.href);
    
    // Set parameters
    shareUrl.searchParams.set('name', birthdayData.name);
    shareUrl.searchParams.set('pic', birthdayData.pic);
    shareUrl.searchParams.set('theme', document.body.className);
    
    // If specific message was selected, include its index
    const messageSelect = document.getElementById('userMessage');
    if (messageSelect.value !== 'random') {
        shareUrl.searchParams.set('message', messageSelect.value);
    } else {
        shareUrl.searchParams.delete('message');
    }
    
    // Display the URL
    document.getElementById('shareUrl').value = shareUrl.toString();
    document.getElementById('shareUrlContainer').style.display = 'block';
}

// Copy URL to clipboard
document.getElementById('copyUrlBtn').addEventListener('click', function() {
    const shareUrl = document.getElementById('shareUrl');
    shareUrl.select();
    document.execCommand('copy');
    
    // Show feedback
    const originalText = this.textContent;
    this.textContent = 'Copied!';
    setTimeout(() => {
        this.textContent = originalText;
    }, 2000);
});

// Show customization form
document.getElementById('showCustomizeBtn').addEventListener('click', function() {
    soundEffects.form.currentTime = 0;
    soundEffects.form.volume = 0.4;
    soundEffects.form.play();
    
    document.getElementById('shareUrlContainer').style.display = 'none';
    document.getElementById('customizeForm').style.display = 'block';
});

// Cancel customization
document.getElementById('cancelCustomize').addEventListener('click', function() {
    document.getElementById('customizeForm').style.display = 'none';
});

// Info button
document.getElementById('infoBtn').addEventListener('click', function() {
    document.getElementById('infoModal').style.display = 'flex';
});

document.getElementById('closeInfo').addEventListener('click', function() {
    document.getElementById('infoModal').style.display = 'none';
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('infoModal')) {
        document.getElementById('infoModal').style.display = 'none';
    }
    if (event.target == document.getElementById('customizeForm')) {
        document.getElementById('customizeForm').style.display = 'none';
    }
});

// Create confetti
function createConfetti() {
    soundEffects.confetti.currentTime = 0;
    soundEffects.confetti.volume = 0.3;
    soundEffects.confetti.play();
    
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', '#ff9ff3', '#a29bfe'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 2) + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Mute button
let isMuted = false;
document.getElementById('muteBtn').addEventListener('click', function() {
    isMuted = !isMuted;
    this.textContent = isMuted ? '🔇' : '🔊';
    Object.values(soundEffects).forEach(sound => {
        sound.volume = isMuted ? 0 : (sound === soundEffects.message ? 0.5 : 0.3);
    });
});

// Theme buttons
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('userTheme').value = this.getAttribute('onclick').match(/'([^']+)'/)[1];
    });
});

// Handle image errors
document.getElementById('birthdayPic').onerror = function() {
    this.src = "https://i.imgur.com/JQWUQfZ.jpg";
};

// Initialize the page
window.onload = init;

// Keyboard controls
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        location.reload();
    }
    if (e.key === 'Escape') {
        document.getElementById('customizeForm').style.display = 'none';
        document.getElementById('infoModal').style.display = 'none';
    }
});
