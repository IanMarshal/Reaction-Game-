const startBtn = document.getElementById("startBtn");
const box = document.getElementById("box");
const statusText = document.getElementById("status");
const resultText = document.getElementById("result");
const bestScoreText = document.getElementById("bestScore");
const difficultySelect = document.getElementById("difficulty");

const clickSound = document.getElementById("clickSound");
const failSound = document.getElementById("failSound");

let startTime;
let timeoutId;
let gameActive = false;
let waitingForBox = false;

let bestTime = localStorage.getItem("bestTime");
if (bestTime) {
    bestScoreText.textContent = `Best Time: ${bestTime} ms`;
}

const difficultyDelay = {
    easy: [2000, 4000],
    medium: [1000, 3000],
    hard: [500, 2000]
};

startBtn.addEventListener("click", startGame);

function startGame() {
    resetGame();
    gameActive = true;
    waitingForBox = true;

    statusText.textContent = "Wait for the box...";

    const difficulty = difficultySelect.value;
    const [min, max] = difficultyDelay[difficulty];
    const delay = Math.random() * (max - min) + min;

    timeoutId = setTimeout(showBox, delay);
}

function showBox() {
    waitingForBox = false;

    const x = Math.random() * (window.innerWidth - 120);
    const y = Math.random() * (window.innerHeight - 120);

    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
    box.style.display = "block";

    startTime = Date.now();
}

box.addEventListener("click", () => {
    if (!gameActive) return;

    clickSound.play();
    const reactionTime = Date.now() - startTime;

    resultText.textContent = `Reaction Time: ${reactionTime} ms`;
    statusText.textContent = "Click Start to play again.";

    updateBestScore(reactionTime);
    endGame();
});

document.body.addEventListener("click", (e) => {
    if (
        gameActive &&
        waitingForBox &&
        e.target !== startBtn
    ) {
        failSound.play();
        statusText.textContent = "Too early! Wait for the box.";
        endGame();
    }
});

function updateBestScore(time) {
    if (!bestTime || time < bestTime) {
        bestTime = time;
        localStorage.setItem("bestTime", bestTime);
        bestScoreText.textContent = `Best Time: ${bestTime} ms`;
    }
}

function endGame() {
    clearTimeout(timeoutId);
    gameActive = false;
    waitingForBox = false;
    box.style.display = "none";
}

function resetGame() {
    clearTimeout(timeoutId);
    resultText.textContent = "";
    box.style.display = "none";
}
