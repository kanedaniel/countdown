
// Reference to the countdown state in Firebase
const countdownRef = database.ref('countdownState');

// DOM elements
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const statusElement = document.getElementById('status');

// Variables
let resetSignal = 0;
let connectionRef = database.ref('.info/connected');

// Initialize the countdown state if it doesn't exist
countdownRef.once('value', (snapshot) => {
    if (!snapshot.exists()) {
        countdownRef.set({
            isActive: false,
            startTime: null,
            duration: 10000,
            resetSignal: 0
        });
    } else {
        const data = snapshot.val();
        resetSignal = data.resetSignal || 0;
    }
});

// Listen for connection status
connectionRef.on('value', (snap) => {
    if (snap.val() === true) {
        statusElement.textContent = 'Display connected';
        statusElement.className = 'status connected';
    } else {
        statusElement.textContent = 'Display disconnected';
        statusElement.className = 'status disconnected';
    }
});

// Start button click handler
startButton.addEventListener('click', () => {
    countdownRef.update({
        isActive: true,
        startTime: Date.now(),
        duration: 10000
    });
    
    // Disable start button temporarily
    startButton.disabled = true;
    setTimeout(() => {
        startButton.disabled = false;
    }, 1000);
});

// Reset button click handler
resetButton.addEventListener('click', () => {
    resetSignal++;
    countdownRef.update({
        isActive: false,
        resetSignal: resetSignal
    });
});

// Listen for countdown state changes
countdownRef.on('value', (snapshot) => {
    const data = snapshot.val() || {};
    
    if (data.isActive) {
        startButton.disabled = true;
        setTimeout(() => {
            startButton.disabled = false;
        }, 10000); // Enable after countdown finishes
    }
});
