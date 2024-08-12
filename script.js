// Element Variables
const gameContainer = document.getElementById("gameContainer");
const model = document.getElementById("model");
const levelDisplay = document.getElementById("levelDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const upgradeButton = document.getElementById("upgradeButton");
const progressBar = document.getElementById("progressBar");
const boostButton = document.getElementById("boostButton");
const cooldownBar = document.getElementById("cooldownBar");
const storeBackdrop = document.getElementById("storeBackdrop");
const storeContainer = document.getElementById("storeContainer");
const menuContainer = document.getElementById("menuContainer");

// Game Variables
let totalClick = parseInt(localStorage.getItem('totalClick')) || 0;
let score = parseInt(localStorage.getItem('score')) || 0;
let currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
let clickValue = parseInt(localStorage.getItem('clickValue')) || 1;
let upgradeLevel = parseInt(localStorage.getItem('upgradeLevel')) || 1;
let upgradeCost = parseInt(localStorage.getItem('upgradeCost')) || 100;
let boostActive = false;
let boostCooldown = false;

const levels = [
    { score: 1, background: 'Assets/Model/Peanut00.svg' },
    { score: 100000, background: 'Assets/Model/Peanut01.svg' },
    { score: 100000000, background: 'Assets/Model/Peanut02.svg' },
    { score: 100000000000, background: 'Assets/Model/Peanut03.svg' }
];

// Audio Variables
let musicAudio = new Audio("Assets/Audio/music.mp3");
let soundAudio = new Audio("Assets/Audio/sound.mp3");

// Shake The Score
function scoreShake() {
    scoreDisplay.classList.add('shake');
    scoreDisplay.addEventListener('animationend', () => {
        scoreDisplay.classList.remove('shake');
    });
}

// Shrink Effect
function shrink() {
    model.style.transform = "translate(-50%, -50%) scale(0.90)";

    setTimeout(function() {
        model.style.transform = "translate(-50%, -50%) scale(1)";
    }, 100);
}


// PopUp Effect
function popUp(event) {
    const popup = document.createElement('span');

    popup.classList.add('popup');
    popup.textContent = `+${clickValue}`;
    popup.style.left = `calc(${event.clientX}px - 25px)`;
    popup.style.top = `calc(${event.clientY}px - 25px)`;

    gameContainer.appendChild(popup);

    popup.addEventListener("animationend", () => {
        popup.remove();
    });
}


// Random PopUp Effect
function randomPopUp(value) {
    const popup = document.createElement('span');

    popup.classList.add('popup');
    popup.textContent = `+${value}`;

    const modelRect = model.getBoundingClientRect();
    const x = Math.random() * (modelRect.width - 100) + (modelRect.left + 50);
    const y = Math.random() * (modelRect.height - 100) + (modelRect.top + 50);

    popup.style.left = `calc(${x}px - 25px)`;
    popup.style.top = `calc(${y}px - 25px)`;

    gameContainer.appendChild(popup);
    popup.addEventListener("animationend", () => popup.remove());
}


// Particle Effect
function particle(event) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');

        particle.classList.add('particle');
        particle.style.top = `${event.clientY}px`;
        particle.style.left = `${event.clientX}px`;

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 50;

        particle.style.setProperty('--translateX', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--translateY', `${Math.sin(angle) * distance}px`);

        gameContainer.appendChild(particle);

        particle.addEventListener('animationend', () => {particle.remove();});
    }
}


// Update Content
window.addEventListener("load", function() {
    // Display Update
    levelDisplay.textContent = `Level ${currentLevel}`;
    scoreDisplay.textContent = score.toString().padStart(12, '0').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    model.style.backgroundImage = `url('${levels[currentLevel - 1].background}')`;
    upgradeButton.textContent = `Upgrade Click ${upgradeLevel}`;

    // Update Functions
    updateProgressBar();
    updateModel();
    updateUpgradeButton();

    // Audio Update
    musicAudio.volume = 0;
    musicAudio.loop = true;
    soundAudio.volume = 0.75;
    soundAudio.loop = false;

    // Store Update
    if (localStorage.getItem('clickMinerPurchased')) {
        setInterval(() => {
            score += 1;
            updateScore();
            updateModel();
            updateProgressBar();
        }, 20);
    }
    if (localStorage.getItem('autoClickerPurchased')) {
        setInterval(() => {
            score += 1;
            updateScore();
            updateModel();
            updateProgressBar();
        }, 10);
    }
});


// Update Level Progress
function updateProgressBar() {
    let nextLevel = levels[currentLevel] || levels[levels.length - 1];
    let previousLevelScore = levels[currentLevel - 1]?.score || 0;
    let levelRange = nextLevel.score - previousLevelScore;
    let progress = ((score - previousLevelScore) / levelRange) * 100;

    progressBar.style.width = `${progress}%`;

    if (score >= nextLevel.score) {
        progressBar.style.width = '0%';
    }
}


// Update Score
function updateScore() {
    formattedScore = score.toString().padStart(12, '0').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    scoreDisplay.textContent = `${formattedScore}`;
    localStorage.setItem('score', score);
}


// Update Model
function updateModel() {
    for (let i = currentLevel; i < levels.length; i++) {
        if (score >= levels[i].score) {
            model.style.backgroundImage = `url('${levels[i].background}')`;
            currentLevel = i + 1;
            localStorage.setItem('currentLevel', currentLevel);
            levelDisplay.textContent = `Level ${currentLevel}`;
            updateProgressBar();
        }
    }
}


// Tap Function
function tap(event) {
    // Play Sound Effects
    soundAudio.currentTime = 0;
    soundAudio.play();

    // Basic Tap Effects
    shrink();
    popUp(event);
    particle(event);

    // Update Level
    updateProgressBar();

    // Update Score
    score += clickValue;
    updateScore();

    //Update Total Click
    totalClick += 1;
    localStorage.setItem('totalClick', totalClick);

    // Update Model
    updateModel();

    // Debugging
    console.log("Upgrade Level: " + upgradeLevel);
    console.log("Upgrade Cost: " + upgradeCost);
    console.log("Click Value: " + clickValue);
}


// Update Upgrade Level
function updateUpgradeButton() {
    if (upgradeLevel >= 10) {
        upgradeLevel = 10;
        upgradeButton.textContent = `Upgrade Click Max`;
    } else {
        upgradeButton.textContent = `Upgrade Click ${upgradeLevel}`;
    }
    localStorage.setItem('upgradeLevel', upgradeLevel);
}

// Show Upgrade Error
function scoreDecrease() {
    const upgradeDecrease = document.createElement('div');
    upgradeDecrease.classList.add('upgradeDecrease');
    upgradeDecrease.textContent = `-${upgradeCost}`;

    const scoreRect = scoreDisplay.getBoundingClientRect();
    upgradeDecrease.style.right = `${scoreRect.right }px`;
    upgradeDecrease.style.top = `${scoreRect.bottom }px`;

    document.body.appendChild(upgradeDecrease);

    upgradeDecrease.addEventListener('animationend', () => {
        upgradeDecrease.remove();
    });
}

// Upgrade Click Funtion
function upgradeClick() {
    soundAudio.currentTime = 0;
    soundAudio.play();

    if (score >= upgradeCost) {
        if (upgradeLevel < 10) {
            // Update Score
            score = (score-upgradeCost);
            updateScore();

            // Update Progress Bar
            updateProgressBar();
            
            // Show Score Decrease
            scoreDecrease();

            // Update Upgrade Level
            upgradeLevel += 1;
            clickValue *= 2;
            upgradeCost *= 2;
            localStorage.setItem('clickValue', clickValue);
            localStorage.setItem('upgradeCost', upgradeCost);
            updateUpgradeButton();
        }
    } else {
        scoreShake();
    }
}


// Boost Click Function
function boostClick() {
    soundAudio.currentTime = 0;
    soundAudio.play();

    if (boostCooldown) {
        return;
    }

    boostActive = true;
    boostCooldown = true;

    let start = null;
    let duration = 10000;
    const decreaseCooldown = (timestamp) => {
        if (!start) start = timestamp;
        let progress = timestamp - start;
        let percent = Math.max(0, 100 - (progress / duration) * 100);
        cooldownBar.style.height = `${percent}%`;

        if (progress < duration) {
            requestAnimationFrame(decreaseCooldown);
        } else {
            start = null;
            duration = 60000;
            requestAnimationFrame(increaseCooldown);
        }
    };

    const increaseCooldown = (timestamp) => {
        if (!start) start = timestamp;
        let progress = timestamp - start;
        let percent = Math.min(100, (progress / duration) * 100);
        cooldownBar.style.height = `${percent}%`;

        if (progress < duration) {
            requestAnimationFrame(increaseCooldown);
        } else {
            boostCooldown = false;
        }
    };

    requestAnimationFrame(decreaseCooldown);

    let boostEffect = setInterval(() => {
        score += clickValue;
        updateScore();
        updateModel();
        updateProgressBar();
        randomPopUp(clickValue);
    }, 100);

    setTimeout(() => {
        clearInterval(boostEffect);
        boostActive = false;
    }, 10000);
}

// Update Music Volume
function updateMusicVolume(value) {
    musicAudio.play();
    musicValue.textContent = value + '%';
    musicAudio.volume = value / 100;
}

// Update Sound Volume
function updateSoundVolume(value) {
    soundAudio.play();
    soundValue.textContent = value + '%';
    soundAudio.volume = value / 100;
}

// Play Game Function
function playGame() {
    menuContainer.classList.toggle("toggle");
    soundAudio.currentTime = 0;
    soundAudio.play();
}

// Quit Game Function
function quitGame() {
    soundAudio.currentTime = 0;
    soundAudio.play();
}

// Open Setting Function
function openSetting() {
    menuBackdrop.classList.toggle("toggle");
    menuSetting.classList.toggle("toggle");
    soundAudio.currentTime = 0;
    soundAudio.play();
}

// Open Stats Function
function openStats() {
    menuBackdrop.classList.toggle("toggle")
    menuStats.classList.toggle("toggle");
    soundAudio.currentTime = 0;
    soundAudio.play();

    totalClickValue.textContent = `${totalClick}`;
    currentClickValue.textContent = `${clickValue}`;
    currentLevelValue.textContent = `${currentLevel}`;
}

// Open About Function
function openAbout() {
    menuBackdrop.classList.toggle("toggle")
    menuAbout.classList.toggle("toggle");
    soundAudio.currentTime = 0;
    soundAudio.play();
}

// Open Store Function
function openStore() {
    storeBackdrop.classList.toggle("toggle");
    storeContainer.classList.toggle("toggle");
    soundAudio.currentTime = 0;
    soundAudio.play();
}

// Store Upgrades
function clickMiner() {
    soundAudio.currentTime = 0;
    soundAudio.play();

    if (score >= 150000 && !localStorage.getItem('clickMinerPurchased')) {
        score -= 150000;
        updateScore();
        updateProgressBar();
        scoreDecrease();

        localStorage.setItem('clickMinerPurchased', 'true');

        setInterval(() => {
            score += 1;
            updateScore();
            updateModel();
            updateProgressBar();
        }, 20);
    } else if (localStorage.getItem('clickMinerPurchased')) {
        setInterval(() => {
            score += 1;
            updateScore();
            updateModel();
            updateProgressBar();
        }, 20);
    } else {
        scoreShake();
    }
}

function autoClicker() {
    soundAudio.currentTime = 0;
    soundAudio.play();

    if (score >= 300000 && !localStorage.getItem('autoClickerPurchased')) {
        score -= 300000;
        updateScore();
        updateProgressBar();
        scoreDecrease();

        localStorage.setItem('autoClickerPurchased', 'true');

        setInterval(() => {
            score += 1;
            updateScore();
            updateModel();
            updateProgressBar();
        }, 10);
    } else if (localStorage.getItem('autoClickerPurchased')) {
        setInterval(() => {
            score += 1;
            updateScore();
            updateModel();
            updateProgressBar();
        }, 10);
    } else {
        scoreShake();
    }
}

function increaseClick() {
    soundAudio.currentTime = 0;
    soundAudio.play();

    if (score >= 600000 && !localStorage.getItem('increaseClickPurchased')) {
        score -= 600000;
        updateScore();
        updateProgressBar();
        scoreDecrease();

        clickValue += 88;
        localStorage.setItem('clickValue', clickValue);
        localStorage.setItem('increaseClickPurchased', 'true');
    } else if (localStorage.getItem('increaseClickPurchased')) {
        console.log("Clicker Mayhem has already been purchased.");
    } else {
        scoreShake();
    }
}

function clickMultiplyer() {
    soundAudio.currentTime = 0;
    soundAudio.play();

    if (score >= 1200000 && !localStorage.getItem('clickMultiplyerPurchased')) {
        score -= 1200000;
        updateScore();
        updateProgressBar();
        scoreDecrease();

        clickValue *= 2;
        localStorage.setItem('clickValue', clickValue);
        localStorage.setItem('clickMultiplyerPurchased', 'true');
    } else if (localStorage.getItem('clickMultiplyerPurchased')) {
        console.log("Clicker Mayhem has already been purchased.");
    } else {
        scoreShake();
    }
}

function clickerMayhem() {
    soundAudio.currentTime = 0;
    soundAudio.play();

    if (score >= 2400000 && !localStorage.getItem('clickerMayhemPurchased')) {
        score -= 2400000;
        updateScore();
        updateProgressBar();
        scoreDecrease();

        localStorage.setItem('clickerMayhemPurchased', 'true');

        let originalClickValue = 2400000;
        let boostedClickValue = originalClickValue * 10;
        let interval = 10;
        let duration = 30000;
        let increments = duration / interval;
        let incrementValue = boostedClickValue / (increments / 10);

        let mayhemInterval = setInterval(() => {
            score += boostedClickValue;
            updateScore();
            updateModel();
            updateProgressBar();
            randomPopUp(incrementValue);
        }, interval);

        setTimeout(() => {
            clearInterval(mayhemInterval);
        }, 30000);
    } else if (localStorage.getItem('clickerMayhemPurchased')) {
        console.log("Clicker Mayhem has already been purchased.");
    } else {
        scoreShake();
    }
}