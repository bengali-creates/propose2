let initialPositions = new Map();
const MOVEMENT_THRESHOLD = 50; // Minimum 50px movement required

// Modified centerCards function with reflow trigger
function centerCards() {
    const cardWidth = 350;
    const cardHeight = 275;
    const centerX = ((window.innerWidth - cardWidth) / 2)-20;
    const centerY =( (window.innerHeight - cardHeight) / 2)-35;

    const cards = document.querySelectorAll('.card');
    initialPositions.clear();
    
    cards.forEach((card, index) => {
        const offset = index * 20;
        card.style.transform = `translate(${centerX+offset}px, ${centerY +offset}px)`;
        
        // Force layout reflow to ensure transform is applied
        void card.offsetHeight; // This triggers layout recalculation
        
        // Store initial position
        const rect = card.getBoundingClientRect();
        initialPositions.set(card, {
            x: rect.left,
            y: rect.top
        });
    });
}

// Center cards on page load
window.addEventListener('load', centerCards);
// Updated checkIfAllCardsMoved
function checkIfAllCardsMoved() {
    let allMoved = true;

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const initial = initialPositions.get(card);
        
        // Card must move in BOTH X and Y directions
        const xMoved = Math.abs(rect.left - initial.x) >= MOVEMENT_THRESHOLD;
        const yMoved = Math.abs(rect.top - initial.y) >= MOVEMENT_THRESHOLD;
        
        if (!xMoved || !yMoved) {
            allMoved = false;
        }
    });

    if (allMoved) {
        const container = document.querySelector('.container');
        container.style.display = 'block';
        container.classList.add('active');
    }
}
// Drag and Drop functionality
const cards = document.querySelectorAll('.card');
let currentCard = null;
let offsetX = 0;
let offsetY = 0;

cards.forEach(card => {
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);
});

function dragStart(e) {
    currentCard = this;
    const rect = this.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
}

function dragEnd(e) {
    updatePosition(e.clientX, e.clientY);
}

document.addEventListener('dragover', e => {
    e.preventDefault();
});

document.addEventListener('drop', e => {
    e.preventDefault();
    updatePosition(e.clientX, e.clientY);
});

function updatePosition(clientX, clientY) {
    if (!currentCard) return;
    
    const maxX = window.innerWidth - currentCard.offsetWidth;
    const maxY = window.innerHeight - currentCard.offsetHeight;
    
    let x = clientX - offsetX;
    let y = clientY - offsetY;

    // Keep within screen boundaries
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    currentCard.style.transform = `translate(${x}px, ${y}px)`;
    currentCard = null;

    // Show Valentine's content if all cards are moved
    checkIfAllCardsMoved();
}


  // Add resize handler
window.addEventListener('resize', centerCards);

const messages = [
    "Are you sure?",
    "Really sure??",
    "Are you positive?",
    "Pookie please...",
    "Just think about it!",
    "If you say no, I will be really sad...",
    "I will be very sad...",
    "I will be very very very sad...",
    "Ok fine, I will stop asking...",
    "Just kidding, say yes please! ❤️"
];

let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;
}

function handleYesClick() {
    window.location.href = "yes_page.html";
}