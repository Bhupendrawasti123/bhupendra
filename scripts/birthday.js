// Birthday data
const birthdayData = {
    name: "...",
    pic: "https://i.imgur.com/JQWUQfZ.jpg",
    wishes: [
        {
            title: "Mountain Theme",
            message: "Every year is another peak to conquer. May this birthday mark your most victorious climb yet!",
            icon: "⛰️",
            animation: "rotate-animation"
        },
        {
            title: "Phoenix Theme",
            message: "Like the phoenix, may you rise stronger with each passing year!",
            icon: "🔥",
            animation: "bounce-animation"
        },
        // Add more messages as needed
    ]
};

// DOM Elements
const elements = {
    birthdayName: document.getElementById('birthdayName'),
    birthdayPic: document.getElementById('birthdayPic'),
    birthdayMessage: document.getElementById('birthdayMessage'),
    themeIcon: document.getElementById('themeIcon'),
    customizeForm: document.getElementById('customizeForm'),
    shareSection: document.getElementById('shareSection'),
    customName: document.getElementById('customName'),
    customPic: document.getElementById('customPic'),
    customMessage: document.getElementById('customMessage'),
    saveBtn: document.getElementById('saveBtn'),
    shareUrl: document.getElementById('shareUrl'),
    copyBtn: document.getElementById('copyBtn'),
    backBtn: document.getElementById('backBtn'),
    imagePreview: document.getElementById('imagePreview'),
    refreshBtn: document.getElementById('refreshBtn'),
    infoBtn: document.getElementById('infoBtn'),
    infoModal: document.getElementById('infoModal'),
    closeInfo: document.getElementById('closeInfo')
};

// Initialize the app
function initApp() {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Set values from URL or defaults
    birthdayData.name = urlParams.get('name') || birthdayData.name;
    birthdayData.pic = urlParams.get('pic') || birthdayData.pic;
    
    // Set theme from URL or default
    const theme = urlParams.get('theme') || 'default';
    document.body.className = theme;
    
    // Check if shared card
    if (urlParams.toString()) {
        document.body.classList.add('shared-card');
        elements.shareSection.style.display = 'block';
        elements.customizeForm.style.display = 'none';
        elements.refreshBtn.style.display = 'none';
    }
    
    // Initialize form values
    elements.customName.value = birthdayData.name;
    elements.customPic.value = birthdayData.pic;
    
    // Initialize message dropdown
    initMessageDropdown();
    
    // Set initial wish
    const messageIndex = urlParams.has('message') ? parseInt(urlParams.get('message')) : null;
    applyWish(messageIndex);
    
    // Initialize theme buttons
    initThemeButtons();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load image preview
    updateImagePreview();
}

// Initialize message dropdown
function initMessageDropdown() {
    // Clear existing options except first
    while (elements.customMessage.options.length > 1) {
        elements.customMessage.remove(1);
    }
    
    // Add all wishes as options
    birthdayData.wishes.forEach((wish, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = wish.title;
        elements.customMessage.appendChild(option);
    });
}

// Apply wish to the card
function applyWish(selectedIndex = null) {
    // Get selected or random wish
    const wish = selectedIndex !== null && selectedIndex >= 0 && selectedIndex < birthdayData.wishes.length
        ? birthdayData.wishes[selectedIndex]
        : birthdayData.wishes[Math.floor(Math.random() * birthdayData.wishes.length)];
    
    // Update card display
    elements.birthdayName.textContent = birthdayData.name;
    elements.birthdayPic.src = birthdayData.pic;
    elements.birthdayMessage.textContent = wish.message;
    elements.themeIcon.textContent = wish.icon;
    elements.themeIcon.className = `theme-icon ${wish.animation}`;
    
    // Update dropdown selection
    elements.customMessage.value = selectedIndex !== null ? selectedIndex : 'random';
    
    // Handle image loading
    elements.birthdayPic.onload = () => {
        elements.birthdayPic.style.opacity = 1;
        elements.imagePreview.style.backgroundImage = `url(${birthdayData.pic})`;
        elements.imagePreview.style.display = 'block';
    };
    elements.birthdayPic.onerror = () => {
        elements.birthdayPic.src = 'https://i.imgur.com/JQWUQfZ.jpg';
        elements.birthdayPic.style.opacity = 1;
    };
}

// Initialize theme buttons
function initThemeButtons() {
    document.querySelectorAll('.theme-btn, .theme-btn-form').forEach(btn => {
        btn.classList.remove('active-theme');
        if (btn.classList.contains(document.body.className.replace('theme-', '') + '-btn')) {
            btn.classList.add('active-theme');
        }
    });
}

// Change theme
function changeTheme(theme) {
    document.body.className = theme;
    initThemeButtons();
}

// Select theme from form
function selectTheme(theme) {
    changeTheme(theme);
    document.querySelectorAll('.theme-btn-form').forEach(btn => {
        btn.classList.remove('active-theme');
    });
    event.target.classList.add('active-theme');
}

// Update image preview
function updateImagePreview() {
    // Set initial preview
    if (birthdayData.pic) {
        elements.imagePreview.style.backgroundImage = `url(${birthdayData.pic})`;
        elements.imagePreview.style.display = 'block';
    }
    
    // Update on input change
    elements.customPic.addEventListener('input', () => {
        if (elements.customPic.value) {
            elements.imagePreview.style.backgroundImage = `url(${elements.customPic.value})`;
            elements.imagePreview.style.display = 'block';
        } else {
            elements.imagePreview.style.display = 'none';
        }
    });
}

// Create shareable link
function createShareLink() {
    const name = elements.customName.value.trim() || 'Friend';
    const pic = elements.customPic.value.trim() || 'https://i.imgur.com/JQWUQfZ.jpg';
    const theme = document.body.className;
    const messageIndex = elements.customMessage.value === 'random' ? null : parseInt(elements.customMessage.value);
    
    // Update display
    birthdayData.name = name;
    birthdayData.pic = pic;
    applyWish(messageIndex);
    
    // Create URL
    const url = new URL(window.location.href.split('?')[0]);
    url.searchParams.set('name', encodeURIComponent(name));
    if (pic !== 'https://i.imgur.com/JQWUQfZ.jpg') {
        url.searchParams.set('pic', encodeURIComponent(pic));
    }
    url.searchParams.set('theme', theme);
    if (messageIndex !== null) {
        url.searchParams.set('message', messageIndex);
    }
    
    elements.shareUrl.value = url.toString();
    elements.customizeForm.style.display = 'none';
    elements.shareSection.style.display = 'block';
}

// Copy link to clipboard
function copyToClipboard() {
    elements.shareUrl.select();
    document.execCommand('copy');
    
    // Show feedback
    const originalText = elements.copyBtn.innerHTML;
    elements.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
        elements.copyBtn.innerHTML = originalText;
    }, 2000);
}

// Share on WhatsApp
function shareOnWhatsApp() {
    const text = `Check out this birthday card for ${birthdayData.name}: ${elements.shareUrl.value}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// Share via Email
function shareViaEmail() {
    const subject = `Birthday Wishes for ${birthdayData.name}`;
    const body = `Here's a special birthday card for ${birthdayData.name}:\n\n${elements.shareUrl.value}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

// Set up event listeners
function setupEventListeners() {
    // Save button
    elements.saveBtn.addEventListener('click', createShareLink);
    
    // Copy button
    elements.copyBtn.addEventListener('click', copyToClipboard);
    
    // Back button
    elements.backBtn.addEventListener('click', () => {
        elements.shareSection.style.display = 'none';
        elements.customizeForm.style.display = 'block';
    });
    
    // Refresh button
    elements.refreshBtn.addEventListener('click', () => applyWish());
    
    // Info button
    elements.infoBtn.addEventListener('click', () => {
        elements.infoModal.style.display = 'flex';
    });
    
    // Close info modal
    elements.closeInfo.addEventListener('click', () => {
        elements.infoModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    elements.infoModal.addEventListener('click', (e) => {
        if (e.target === elements.infoModal) {
            elements.infoModal.style.display = 'none';
        }
    });
    
    // Make sure form is scrollable on mobile
    if ('ontouchstart' in window) {
        elements.customizeForm.addEventListener('touchstart', function(e) {
            this.style.overflowY = 'auto';
        }, { passive: true });
        
        elements.customizeForm.addEventListener('touchmove', function(e) {
            if (this.scrollHeight > this.clientHeight) {
                e.stopPropagation();
            }
        }, { passive: false });
    }
    
    // Auto-scroll to bottom when opening form
    if (!document.body.classList.contains('shared-card')) {
        setTimeout(() => {
            elements.customizeForm.scrollTop = elements.customizeForm.scrollHeight;
        }, 300);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
