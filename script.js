// Stopwatch functionality
class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.laps = [];
        
        this.displayElement = document.getElementById('stopwatch-display');
        this.startBtn = document.getElementById('stopwatch-start');
        this.pauseBtn = document.getElementById('stopwatch-pause');
        this.resetBtn = document.getElementById('stopwatch-reset');
        this.lapBtn = document.getElementById('stopwatch-lap');
        this.lapList = document.getElementById('lap-list');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());
    }
    
    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.updateDisplay(), 10);
            this.isRunning = true;
            this.updateButtons();
        }
    }
    
    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            this.updateButtons();
        }
    }
    
    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.elapsedTime = 0;
        this.laps = [];
        this.updateDisplay();
        this.updateButtons();
        this.lapList.innerHTML = '';
    }
    
    recordLap() {
        if (this.isRunning) {
            const lapTime = this.elapsedTime;
            this.laps.push(lapTime);
            this.displayLap(this.laps.length, lapTime);
        }
    }
    
    updateDisplay() {
        this.elapsedTime = Date.now() - this.startTime;
        this.displayElement.textContent = this.formatTime(this.elapsedTime);
    }
    
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);
        
        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}:${this.pad(ms)}`;
    }
    
    displayLap(lapNumber, lapTime) {
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${lapNumber}</span>
            <span class="lap-time">${this.formatTime(lapTime)}</span>
        `;
        this.lapList.insertBefore(lapItem, this.lapList.firstChild);
    }
    
    updateButtons() {
        this.startBtn.disabled = this.isRunning;
        this.pauseBtn.disabled = !this.isRunning;
        this.lapBtn.disabled = !this.isRunning;
    }
    
    pad(value) {
        return value.toString().padStart(2, '0');
    }
}

// Timer functionality
class Timer {
    constructor() {
        this.totalTime = 0;
        this.remainingTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        
        this.hoursInput = document.getElementById('hours');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        this.displayElement = document.getElementById('timer-display');
        this.startBtn = document.getElementById('timer-start');
        this.pauseBtn = document.getElementById('timer-pause');
        this.resetBtn = document.getElementById('timer-reset');
        this.alertElement = document.getElementById('timer-alert');
        
        this.initializeEventListeners();
        this.validateInputs();
    }
    
    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Validate inputs on change
        [this.hoursInput, this.minutesInput, this.secondsInput].forEach(input => {
            input.addEventListener('input', () => this.validateInputs());
            input.addEventListener('change', () => this.validateInputs());
        });
    }
    
    validateInputs() {
        // Validate hours
        let hours = parseInt(this.hoursInput.value) || 0;
        if (hours < 0) hours = 0;
        if (hours > 99) hours = 99;
        this.hoursInput.value = hours;
        
        // Validate minutes
        let minutes = parseInt(this.minutesInput.value) || 0;
        if (minutes < 0) minutes = 0;
        if (minutes > 59) minutes = 59;
        this.minutesInput.value = minutes;
        
        // Validate seconds
        let seconds = parseInt(this.secondsInput.value) || 0;
        if (seconds < 0) seconds = 0;
        if (seconds > 59) seconds = 59;
        this.secondsInput.value = seconds;
        
        // Calculate total time
        this.totalTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
        this.remainingTime = this.totalTime;
        this.updateDisplay();
    }
    
    start() {
        if (!this.isRunning && this.totalTime > 0) {
            if (this.remainingTime === this.totalTime) {
                // Starting fresh
                this.remainingTime = this.totalTime;
            }
            
            this.timerInterval = setInterval(() => this.updateTimer(), 100);
            this.isRunning = true;
            this.updateButtons();
            this.alertElement.classList.add('hidden');
            this.disableInputs(true);
        }
    }
    
    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            this.updateButtons();
        }
    }
    
    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.validateInputs();
        this.updateButtons();
        this.alertElement.classList.add('hidden');
        this.disableInputs(false);
        this.displayElement.parentElement.classList.remove('timer-complete');
    }
    
    updateTimer() {
        this.remainingTime -= 100;
        
        if (this.remainingTime <= 0) {
            this.remainingTime = 0;
            this.complete();
        }
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        const totalSeconds = Math.ceil(this.remainingTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        this.displayElement.textContent = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    }
    
    complete() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.updateButtons();
        this.disableInputs(false);
        
        // Show alert
        this.alertElement.textContent = '⏰ Timer Complete!';
        this.alertElement.classList.remove('hidden');
        
        // Add completion animation
        this.displayElement.parentElement.classList.add('timer-complete');
        
        // Play sound alert
        this.playAlertSound();
        
        // Show browser notification if permission granted
        this.showNotification();
    }
    
    playAlertSound() {
        try {
            // Use Web Audio API to generate a beep sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800; // Frequency in Hz
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            
            // Play multiple beeps
            setTimeout(() => {
                const oscillator2 = audioContext.createOscillator();
                const gainNode2 = audioContext.createGain();
                
                oscillator2.connect(gainNode2);
                gainNode2.connect(audioContext.destination);
                
                oscillator2.frequency.value = 800;
                oscillator2.type = 'sine';
                
                gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator2.start(audioContext.currentTime);
                oscillator2.stop(audioContext.currentTime + 0.5);
            }, 600);
        } catch (err) {
            console.log('Could not play alert sound:', err);
        }
    }
    
    async showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
                body: 'Your countdown timer has finished.',
                icon: '⏰'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Timer Complete!', {
                        body: 'Your countdown timer has finished.',
                        icon: '⏰'
                    });
                }
            });
        }
    }
    
    updateButtons() {
        this.startBtn.disabled = this.isRunning || this.totalTime === 0;
        this.pauseBtn.disabled = !this.isRunning;
    }
    
    disableInputs(disabled) {
        this.hoursInput.disabled = disabled;
        this.minutesInput.disabled = disabled;
        this.secondsInput.disabled = disabled;
    }
    
    pad(value) {
        return value.toString().padStart(2, '0');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Initialize stopwatch and timer
    const stopwatch = new Stopwatch();
    const timer = new Timer();
    
    console.log('Digital Stopwatch & Timer App initialized!');
});
