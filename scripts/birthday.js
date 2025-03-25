/**
 * Birthday Card Application with Scoring System
 * Loads messages from /bhupendra/data/birthday.json
 */

// Configuration
const CONFIG = {
    defaultName: "....",
    defaultPic: "https://i.imgur.com/JQWUQfZ.jpg",
    messagesFile: ".../bhupendra/data/birthday.json",
    sounds: {
        confetti: "https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3",
        message: "https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3",
        theme: "https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3",
        form: "https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3"
    },
    scoring: {
        baseMultiplier: 1,
        streakMultiplier: 0.5, // Additional 50% per streak
        maxStreak: 5,
        streakBonus: 20
    }
};

// Application State
const state = {
    name: CONFIG.defaultName,
    pic: CONFIG.defaultPic,
    messages: [],
    currentWish: null,
    isMuted: false,
    audioElements: {},
    score: 0,
    streak: 0,
    lastClickTime: 0,
    streakTimeout: null
};

// DOM Elements
const elements = {
    // Card Elements
    birthdayName: document.getElementById('birthdayName'),
    birthdayPic: document.getElementById('birthdayPic'),
    birthdayMessage: document.getElementById('birthdayMessage'),
    themeIcon: document.getElementById('themeIcon'),
    
    // Score Elements
    currentScore: document.getElementById('currentScore'),
    currentStreak: document.getElementById('currentStreak'),
    streakDisplay: document.querySelector('.streak-display'),
    
    // Form Elements
    customizeForm: document.getElementById('customizeForm'),
    userName: document.getElementById('userName'),
    userPic: document.getElementById('userPic'),
    userMessage: document.getElementById('userMessage'),
    userTheme: document.getElementById('userTheme'),
    birthdayForm: document.getElementById('birthdayForm'),
    
    // Button Elements
    refreshBtn: document.getElementById('refreshBtn'),
    showCustomizeBtn: document.getElementById('showCustomizeBtn'),
    cancelCustomize: document.getElementById('cancelCustomize'),
    
    // Modal Elements
    infoModal: document.getElementById('infoModal'),
    infoBtn: document.getElementById('infoBtn'),
    closeInfo: document.getElementById('closeInfo'),
    
    // Other UI Elements
    muteBtn: document.getElementById('muteBtn'),
    themeSelector: document.querySelector('.theme-selector')
};

// Initialize the application
async function init() {
    initializeAudio();
    loadFromURL();
    await loadMessages();
    setupEventListeners();
    applyWish();
    createConfetti();
    setInterval(createConfetti, 3000);
}

// Initialize audio elements
function initializeAudio() {
    for (const [key, url] of Object.entries(CONFIG.sounds)) {
        state.audioElements[key] = new Audio(url);
    }
}

// Load data from URL parameters
function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('name')) state.name = params.get('name');
    if (params.get('pic')) state.pic = params.get('pic');
    if (params.get('theme')) changeTheme(params.get('theme'));
}

// Load messages from JSON file
async function loadMessages() {
    try {
        const response = await fetch(CONFIG.messagesFile);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        state.messages = await response.json();
        
        // Verify loaded messages
        if (!Array.isArray(state.messages) {
            throw new Error("Invalid data format: expected array");
        }
        
        // Initialize with random wish
        getRandomWish();
        initializeForm();
    } catch (error) {
        console.error("Error loading messages:", error);
        // Fallback to default messages
        state.messages = [{
            message: "Happy Birthday! Wishing you all the best!",
            icon: "🎉",
            animation: "bounce-animation",
            points: 10
        }];
        getRandomWish();
        initializeForm();
    }
}

// Get random wish from loaded messages
function getRandomWish() {
    if (state.messages.length === 0) return;
    
    playSound('message');
    const randomIndex = Math.floor(Math.random() * state.messages.length);
    state.currentWish = state.messages[randomIndex];
    
    // Update form selection if it exists
    if (elements.userMessage) {
        elements.userMessage.value = randomIndex;
    }
}

// Apply current wish to the UI
function applyWish() {
    elements.birthdayName.textContent = state.name;
    elements.birthdayPic.src = state.pic;
    elements.birthdayMessage.textContent = state.currentWish?.message || "Happy Birthday!";
    elements.themeIcon.textContent = state.currentWish?.icon || "🎂";
    elements.themeIcon.className = `theme-icon ${state.currentWish?.animation || "bounce-animation"}`;
}

// Initialize form with messages
function initializeForm() {
    if (!elements.userMessage) return;
    
    // Clear existing options except the first one
    while (elements.userMessage.options.length > 1) {
        elements.userMessage.remove(1);
    }
    
    // Add all messages as options
    state.messages.forEach((wish, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = wish.message.length > 50 
            ? wish.message.substring(0, 47) + "..." 
            : wish.message;
        elements.userMessage.appendChild(option);
    });
    
    // Set form values
    elements.userName.value = state.name;
    elements.userPic.value = state.pic;
}

// Change theme
function changeTheme(theme) {
    playSound('theme');
    document.body.className = theme;
    if (elements.userTheme) {
        elements.userTheme.value = theme;
    }
    localStorage.setItem('birthdayTheme', theme);
}

// Play sound with current volume
function playSound(soundKey) {
    if (state.isMuted || !state.audioElements[soundKey]) return;
    
    const sound = state.audioElements[soundKey];
    sound.currentTime = 0;
    sound.volume = soundKey === 'message' ? 0.5 : 0.3;
    
    sound.play().catch(error => {
        console.log("Audio playback error:", error);
    });
}

// Create confetti effect
function createConfetti() {
    playSound('confetti');
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', '#ff9ff3', '#a29bfe'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 2) + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Update score display
function updateScore(points) {
    state.score += points;
    elements.currentScore.textContent = state.score;
    elements.currentScore.classList.add('score-pop');
    setTimeout(() => {
        elements.currentScore.classList.remove('score-pop');
    }, 500);
}

// Update streak counter
function updateStreak() {
    const now = Date.now();
    const streakWindow = 5000; // 5 seconds to maintain streak
    
    if (now - state.lastClickTime < streakWindow) {
        state.streak = Math.min(state.streak + 1, CONFIG.scoring.maxStreak);
    } else {
        state.streak = 1;
    }
    
    state.lastClickTime = now;
    elements.currentStreak.textContent = state.streak;
    
    if (state.streak > 1) {
        elements.streakDisplay.classList.add('streak-active');
    } else {
        elements.streakDisplay.classList.remove('streak-active');
    }
    
    // Reset streak if no activity
    clearTimeout(state.streakTimeout);
    state.streakTimeout = setTimeout(() => {
        state.streak = 0;
        elements.currentStreak.textContent = '0';
        elements.streakDisplay.classList.remove('streak-active');
    }, streakWindow);
}

// Calculate points based on current streak
function calculatePoints() {
    if (!state.currentWish?.points) return 0;
    
    let points = state.currentWish.points * CONFIG.scoring.baseMultiplier;
    
    // Apply streak multiplier
    if (state.streak > 1) {
        points *= (1 + (CONFIG.scoring.streakMultiplier * (state.streak - 1)));
    }
    
    // Apply streak bonus
    if (state.streak >= CONFIG.scoring.maxStreak) {
        points += CONFIG.scoring.streakBonus;
    }
    
    return Math.floor(points);
}

// Setup all event listeners
function setupEventListeners() {
    // Form submission
    elements.birthdayForm?.addEventListener('submit', handleFormSubmit);
    
    // Button events
    elements.refreshBtn?.addEventListener('click', handleRefresh);
    elements.showCustomizeBtn?.addEventListener('click', showCustomizeForm);
    elements.cancelCustomize?.addEventListener('click', hideCustomizeForm);
    elements.muteBtn?.addEventListener('click', toggleMute);
    
    // Info modal
    elements.infoBtn?.addEventListener('click', showInfoModal);
    elements.closeInfo?.addEventListener('click', hideInfoModal);
    window.addEventListener('click', handleOutsideClick);
    
    // Theme buttons
    if (elements.themeSelector) {
        elements.themeSelector.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', handleThemeButtonClick);
        });
    }
    
    // Image error handling
    elements.birthdayPic.onerror = handleImageError;
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
}

// Event Handlers
function handleFormSubmit(e) {
    e.preventDefault();
    playSound('form');
    
    // Update state from form
    state.name = elements.userName.value || CONFIG.defaultName;
    state.pic = elements.userPic.value || CONFIG.defaultPic;
    
    // Get selected message
    if (elements.userMessage.value === 'random') {
        getRandomWish();
    } else {
        const selectedIndex = parseInt(elements.userMessage.value);
        if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < state.messages.length) {
            state.currentWish = state.messages[selectedIndex];
        }
    }
    
    // Apply theme
    changeTheme(elements.userTheme.value);
    
    // Update UI
    applyWish();
    hideCustomizeForm();
}

function handleRefresh() {
    getRandomWish();
    applyWish();
    
    updateStreak();
    const points = calculatePoints();
    updateScore(points);
    
    // Extra confetti for high scores
    if (points > state.currentWish?.points * 2) {
        createConfetti();
    }
}

function showCustomizeForm() {
    playSound('form');
    elements.customizeForm.style.display = 'block';
}

function hideCustomizeForm() {
    elements.customizeForm.style.display = 'none';
}

function toggleMute() {
    state.isMuted = !state.isMuted;
    elements.muteBtn.textContent = state.isMuted ? '🔇' : '🔊';
}

function showInfoModal() {
    elements.infoModal.style.display = 'flex';
}

function hideInfoModal() {
    elements.infoModal.style.display = 'none';
}

function handleOutsideClick(event) {
    if (event.target === elements.infoModal) {
        hideInfoModal();
    }
    if (event.target === elements.customizeForm) {
        hideCustomizeForm();
    }
}

function handleThemeButtonClick() {
    const theme = this.getAttribute('onclick').match(/'([^']+)'/)[1];
    elements.userTheme.value = theme;
}

function handleImageError() {
    this.src = CONFIG.defaultPic;
}

function handleKeyDown(e) {
    switch (e.key) {
        case ' ':
            handleRefresh();
            break;
        case 'Escape':
            hideCustomizeForm();
            hideInfoModal();
            break;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
