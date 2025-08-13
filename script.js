const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const playerNameDisplay = document.getElementById("playerName");
const retryBtn = document.getElementById("retryBtn");

let score = 0;
let stars = [];
let bombs = [];
let gameRunning = true;
let speedMultiplier = 1;

// Smooth basket movement
let basketX = 160;
let basketTargetX = 160;

// Ask player name
let playerName = prompt("Enter your name:") || "Guest";
playerNameDisplay.textContent = playerName;

// High score
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.textContent = highScore;

// Basket properties
const basket = { y: 450, width: 80, height: 20, speed: 8 };

// Create stars
function createStar() {
  stars.push({
    x: Math.random() * (canvas.width - 20) + 10,
    y: -20,
    size: 20,
    speed: 1 + Math.random() * 2,
    caught: false
  });
}

// Create bombs
function createBomb() {
  bombs.push({
    x: Math.random() * (canvas.width - 20) + 10,
    y: -20,
    size: 25,
    speed: (1 + Math.random() * 2) * speedMultiplier
  });
}

// Draw basket
function drawBasket() {
  ctx.fillStyle = "#ffcc33";
  ctx.shadowColor = "#ffcc33bb";
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.moveTo(basketX, basket.y);
  ctx.lineTo(basketX + basket.width * 0.1, basket.y - 15);
  ctx.lineTo(basketX + basket.width * 0.9, basket.y - 15);
  ctx.lineTo(basketX + basket.width, basket.y);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
}

// Draw stars
function drawStars() {
  ctx.fillStyle = "#ffd60a";
  ctx.shadowColor = "#ffd60abb";
  ctx.shadowBlur = 20;
  stars.forEach(star => {
    ctx.beginPath();
    const cx = star.x;
    const cy = star.y;
    const spikes = 5;
    const outerRadius = star.size / 2;
    const innerRadius = outerRadius / 2.5;
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * outerRadius;
      let y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  });
  ctx.shadowBlur = 0;
}

// Draw bombs
function drawBombs() {
  ctx.fillStyle = "red";
  ctx.shadowColor = "#ff0000bb";
  ctx.shadowBlur = 15;
  bombs.forEach(bomb => {
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, bomb.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;
}

// Move stars
function moveStars() {
  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].y += stars[i].speed * speedMultiplier;

    if (stars[i].caught) {
      stars.splice(i, 1);
      continue;
    }

    if (
      stars[i].y + stars[i].size > basket.y &&
      stars[i].x > basketX &&
      stars[i].x < basketX + basket.width
    ) {
      score++;
      scoreDisplay.textContent = score;
      stars.splice(i, 1);
    } else if (stars[i].y > canvas.height) {
      endGame();
      return;
    }
  }
}

// Move bombs
function moveBombs() {
  for (let i = bombs.length - 1; i >= 0; i--) {
    bombs[i].y += bombs[i].speed * speedMultiplier;

    if (
      bombs[i].y + bombs[i].size > basket.y &&
      bombs[i].x > basketX &&
      bombs[i].x < basketX + basket.width
    ) {
      endGame();
      return;
    } else if (bombs[i].y > canvas.height) {
      bombs.splice(i, 1);
    }
  }
}

// Update high score
function updateHighScore(score) {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.textContent = highScore;
  }
}

// End game
function endGame() {
  if (!gameRunning) return;
  gameRunning = false;
  updateHighScore(score);
  alert(`${playerName}, Game Over! Your score: ${score} | High Score: ${highScore}`);
  retryBtn.style.display = "inline-block";
}

// Game loop
function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  speedMultiplier += 0.0005;

  basketX += (basketTargetX - basketX) * 0.2;

  drawBasket();
  drawStars();
  drawBombs();
  moveStars();
  moveBombs();

  requestAnimationFrame(gameLoop);
}

// Keyboard controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") {
    basketTargetX = Math.max(basketTargetX - basket.speed, 0);
  }
  if (e.key === "ArrowRight") {
    basketTargetX = Math.min(basketTargetX + basket.speed, canvas.width - basket.width);
  }
});

// Retry button
retryBtn.addEventListener("click", () => {
  score = 0;
  stars = [];
  bombs = [];
  speedMultiplier = 1;
  scoreDisplay.textContent = score;
  gameRunning = true;
  retryBtn.style.display = "none";
  gameLoop();
});

// Spawn stars & bombs
setTimeout(() => {
  setInterval(() => {
    if (gameRunning) {
      createStar();
      if (Math.random() < 0.3) {
        createBomb();
      }
    }
  }, 1200);
}, 2000);

gameLoop();
