// Birthday data
const birthdayData = {
    name: "...", // Default name
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
        },
        {
            message: "The mightiest oaks grow from small seeds. Keep nurturing your potential - your growth inspires us all!",
            icon: "🌱",
            animation: "bounce-animation"
        },
        {
            message: "Your potential is as limitless as the stars. Chart a course this year that makes the universe proud!",
            icon: "🌠",
            animation: "rotate-animation"
        },
        {
            message: "Birthdays are bridges to better versions of ourselves. Step boldly onto yours - the view gets better ahead!",
            icon: "🌉",
            animation: "bounce-animation"
        },
        {
            message: "Remember: Diamonds form under pressure. Every challenge you've faced has made you more brilliant!",
            icon: "💎",
            animation: "rotate-animation"
        },
        {
            message: "May your coming year have just enough wind to be exciting, and just enough calm to enjoy the journey.",
            icon: "⛵",
            animation: "bounce-animation"
        },
        {
            message: "Your life is your greatest masterpiece - keep adding bold strokes this year!",
            icon: "🎨",
            animation: "rotate-animation"
        },
        {
            message: "Like a fine wine, you just keep getting better with time. Cheers to your vintage year!",
            icon: "🍷",
            animation: "bounce-animation"
        },
        {
            message: "May your birthday sparkle with moments of love, laughter, and happy surprises!",
            icon: "✨",
            animation: "rotate-animation"
        },
        {
            message: "You're not getting older, you're leveling up! What amazing power will you unlock this year?",
            icon: "🎮",
            animation: "bounce-animation"
        },
        {
            message: "Birthdays are nature's way of telling us to eat more cake! Enjoy every delicious moment.",
            icon: "🎂",
            animation: "rotate-animation"
        },
        {
            message: "Your smile is contagious, your spirit is inspiring - may your birthday be as wonderful as you are!",
            icon: "😊",
            animation: "bounce-animation"
        },
        {
            message: "Today we celebrate the incredible person you are and the amazing person you're becoming!",
            icon: "🌟",
            animation: "rotate-animation"
        },
        {
            message: "Like a shooting star, may your birthday wishes all come true in brilliant fashion!",
            icon: "🌠",
            animation: "bounce-animation"
        },
        {
            message: "You're the CEO of your life - may this birthday bring a raise in happiness!",
            icon: "💼",
            animation: "rotate-animation"
        },
        {
            message: "Age is merely the number of years the world has been enjoying you. Here's to many more!",
            icon: "🎉",
            animation: "bounce-animation"
        }
    ]
};

// Sound effects
const soundEffects = {
    confetti: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'),
    message: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3'),
    theme: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3'),
    form: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3')
};

// Get parameters from URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('name')) birthdayData.name = urlParams.get('name');
if (urlParams.get('pic')) birthdayData.pic = urlParams.get('pic');
if (urlParams.get('theme')) {
    document.body.className = urlParams.get('theme');
}

// Randomly select a wish
let randomWish;

function getRandomWish() {
    soundEffects.message.currentTime = 0;
    soundEffects.message.volume = 0.5;
    soundEffects.message.play();
    randomWish = birthdayData.wishes[Math.floor(Math.random() * birthdayData.wishes.length)];
    applyWish();
}

function applyWish() {
    document.getElementById('birthdayName').textContent = birthdayData.name;
    document.getElementById('birthdayPic').src = birthdayData.pic;
    document.getElementById('birthdayMessage').textContent = randomWish.message;
    
    const themeIcon = document.getElementById('themeIcon');
    themeIcon.textContent = randomWish.icon;
    themeIcon.className = 'theme-icon ' + randomWish.animation;
}

// Change color theme
function changeTheme(theme) {
    soundEffects.theme.currentTime = 0;
    soundEffects.theme.volume = 0.3;
    soundEffects.theme.play();
    document.body.className = theme;
    // Save to local storage
    localStorage.setItem('birthdayTheme', theme);
    // Update URL without reload
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('theme', theme);
    window.history.pushState({}, '', newUrl);
}

// Initialize form with messages
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
}

// Form submission handler
document.getElementById('birthdayForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    soundEffects.form.currentTime = 0;
    soundEffects.form.volume = 0.4;
    soundEffects.form.play();
    
    // Get form values
    const name = document.getElementById('userName').value || birthdayData.name;
    const pic = document.getElementById('userPic').value || birthdayData.pic;
    const messageIndex = document.getElementById('userMessage').value;
    const theme = document.getElementById('userTheme').value;
    
    // Update birthday data
    birthdayData.name = name;
    birthdayData.pic = pic;
    
    // Set selected message or random
    if (messageIndex === 'random') {
        randomWish = birthdayData.wishes[Math.floor(Math.random() * birthdayData.wishes.length)];
    } else {
        randomWish = birthdayData.wishes[messageIndex];
    }
    
    // Apply theme
    changeTheme(theme);
    
    // Apply the customizations
    applyWish();
    
    // Hide form
    document.getElementById('customizeForm').style.display = 'none';
    
    // Show birthday card if hidden
    document.getElementById('birthdayModal').style.display = 'flex';
});

// Customize button functionality
document.getElementById('customizeBtn').addEventListener('click', function() {
    soundEffects.form.currentTime = 0;
    soundEffects.form.volume = 0.4;
    soundEffects.form.play();
    
    // Populate form with current values
    document.getElementById('userName').value = birthdayData.name;
    document.getElementById('userPic').value = birthdayData.pic;
    
    // Show form
    document.getElementById('customizeForm').style.display = 'block';
});

// Info button functionality
document.getElementById('infoBtn').addEventListener('click', function() {
    document.getElementById('infoModal').style.display = 'flex';
});

document.getElementById('closeInfo').addEventListener('click', function() {
    document.getElementById('infoModal').style.display = 'none';
});

// Close form when clicking outside
window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('customizeForm')) {
        document.getElementById('customizeForm').style.display = 'none';
    }
    if (event.target == document.getElementById('infoModal')) {
        document.getElementById('infoModal').style.display = 'none';
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

// Share functionality
document.getElementById('shareBtn').addEventListener('click', function() {
    const currentTheme = document.body.className || 'default';
    const shareUrl = new URL(window.location.href);
    
    // Ensure all parameters are set
    shareUrl.searchParams.set('name', birthdayData.name);
    shareUrl.searchParams.set('pic', birthdayData.pic);
    shareUrl.searchParams.set('theme', currentTheme);
    
    if (navigator.share) {
        navigator.share({
            title: `Birthday Wishes for ${birthdayData.name}`,
            text: `Send special birthday wishes to ${birthdayData.name}!`,
            url: shareUrl.toString()
        }).catch(err => {
            copyToClipboard(shareUrl.toString());
        });
    } else {
        copyToClipboard(shareUrl.toString());
    }
});

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    alert('Link copied to clipboard! Send it to share these birthday wishes.');
}

// Mute functionality
let isMuted = false;
document.getElementById('muteBtn').addEventListener('click', function() {
    isMuted = !isMuted;
    this.textContent = isMuted ? '🔇' : '🔊';
    
    // Set volume on all sounds
    Object.values(soundEffects).forEach(sound => {
        sound.volume = isMuted ? 0 : (sound === soundEffects.message ? 0.5 : 0.3);
    });
});

// Initial setup
initializeForm();
getRandomWish();

// Create confetti on load and every 3 seconds
window.onload = function() {
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('birthdayTheme');
    if (savedTheme) {
        document.body.className = savedTheme;
        document.getElementById('userTheme').value = savedTheme;
    } else if (urlParams.get('theme')) {
        document.body.className = urlParams.get('theme');
        document.getElementById('userTheme').value = urlParams.get('theme');
    }
    
    // Set name and pic from URL if they exist
    if (urlParams.get('name')) {
        document.getElementById('userName').value = urlParams.get('name');
    }
    if (urlParams.get('pic')) {
        document.getElementById('userPic').value = urlParams.get('pic');
    }
    
    createConfetti();
    setInterval(createConfetti, 3000);
};

// Add keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        location.reload();
    }
});

// Add touch support for mobile devices
document.addEventListener('touchstart', function() {}, {passive: true});

// Make sure the photo loads properly
document.getElementById('birthdayPic').onerror = function() {
    this.src = 'https://i.imgur.com/JQWUQfZ.jpg'; // Fallback image
};

// Add animation to theme buttons on hover
const themeButtons = document.querySelectorAll('.theme-btn');
themeButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
    });
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Add click animation to refresh button
const refreshBtn = document.querySelector('.refresh-btn');
refreshBtn.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
});

// Make info modal more accessible
document.getElementById('infoBtn').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        document.getElementById('infoModal').style.display = 'flex';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (document.getElementById('infoModal').style.display === 'flex') {
            document.getElementById('infoModal').style.display = 'none';
        }
        if (document.getElementById('customizeForm').style.display === 'block') {
            document.getElementById('customizeForm').style.display = 'none';
        }
    }
});
