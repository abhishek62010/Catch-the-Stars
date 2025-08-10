const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 500;

let score = 0;
let stars = [];
let gameRunning = true;

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const retryBtn = document.getElementById("retryBtn");

let playerName = prompt("Enter your name:") || "Guest";
document.getElementById("playerName").textContent = playerName;

let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.textContent = highScore;

// Basket
const basket = { x: 160, y: 450, width: 80, height: 20, speed: 5 };

// Create Star
function createStar() {
  stars.push({
    x: Math.random() * (canvas.width - 20),
    y: 0,
    size: 20,
    speed: 2 + Math.random() * 3,
  });
}

// Draw Basket
function drawBasket() {
  ctx.fillStyle = "#ffd60a";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

// Draw Stars
function drawStars() {
  ctx.fillStyle = "#fca311";
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Move Stars
function moveStars() {
  stars.forEach((star, index) => {
    star.y += star.speed;

    // Catch star
    if (
      star.y + star.size > basket.y &&
      star.x > basket.x &&
      star.x < basket.x + basket.width
    ) {
      score++;
      scoreDisplay.textContent = score;
      stars.splice(index, 1);
    }

    // Missed star → Game Over
    if (star.y > canvas.height) {
      gameOver();
    }
  });
}

function updateHighScore(score) {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  highScoreDisplay.textContent = highScore;
}

// Game Over
function gameOver() {
  if (!gameRunning) return;
  gameRunning = false;
  updateHighScore(score);
  alert(`${playerName}, Game Over! Your score: ${score} | High Score: ${highScore}`);
  retryBtn.style.display = "block";
}

// Restart Game
retryBtn.addEventListener("click", () => {
  score = 0;
  stars = [];
  scoreDisplay.textContent = score;
  gameRunning = true;
  retryBtn.style.display = "none";
  setInterval(createStar, 1000);
  gameLoop();
});

// Game Loop
function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawStars();
  moveStars();
  requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && basket.x > 0) basket.x -= basket.speed;
  if (e.key === "ArrowRight" && basket.x < canvas.width - basket.width)
    basket.x += basket.speed;
});

setInterval(createStar, 1000);
gameLoop();
