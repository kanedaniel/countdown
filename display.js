// Reference to the countdown state in Firebase
const countdownRef = database.ref('countdownState');

// DOM elements
const countdownElement = document.getElementById('countdown');
const stopMessageElement = document.getElementById('stop-message');

// Variables to track the countdown
let countdownTimer = null;
let startTime = 0;
let duration = 10000; // 10 seconds in milliseconds

// Listen for changes in the countdown state
countdownRef.on('value', (snapshot) => {
    const data = snapshot.val() || {};
    
    // If there's no data yet, initialize it
    if (!data.hasOwnProperty('isActive')) {
        countdownRef.set({
            isActive: false,
            startTime: null,
            duration: 10000,
            resetSignal: 0
        });
        return;
    }
    
    if (data.isActive && data.startTime) {
        // Start the countdown
        startCountdown(data.startTime, data.duration || 10000);
    } else if (data.resetSignal !== undefined) {
        // Reset the countdown
        resetCountdown();
    }
});

// Function to start the countdown
function startCountdown(startTimeVal, durationVal) {
    // Clear any existing countdown
    clearInterval(countdownTimer);
    
    startTime = startTimeVal;
    duration = durationVal;
    
    // Show countdown, hide stop message
    countdownElement.style.display = 'block';
    stopMessageElement.style.display = 'none';
    
    // Start the countdown ticker
    countdownTimer = setInterval(updateCountdown, 50);
    updateCountdown();
}

// Function to update the countdown display
function updateCountdown() {
    // Calculate remaining time
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const remainingTime = Math.max(0, duration - elapsedTime);
    
    if (remainingTime <= 0) {
        // Time's up!
        clearInterval(countdownTimer);
        countdownElement.style.display = 'none';
        stopMessageElement.style.display = 'block';
        return;
    }
    
    // Display the remaining time in seconds
    const remainingSeconds = Math.ceil(remainingTime / 1000);
    countdownElement.textContent = remainingSeconds;
    
    // Flash red in the last 3 seconds
    if (remainingSeconds <= 3) {
        countdownElement.classList.toggle('flash-red');
    } else {
        countdownElement.classList.remove('flash-red');
    }
}

// Function to reset the countdown
function resetCountdown() {
    clearInterval(countdownTimer);
    countdownElement.textContent = '10';
    countdownElement.style.display = 'block';
    countdownElement.classList.remove('flash-red');
    stopMessageElement.style.display = 'none';
}
