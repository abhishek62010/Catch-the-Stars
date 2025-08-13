const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const playerNameDisplay = document.getElementById("playerName");
const retryBtn = document.getElementById("retryBtn");

let score = 0;
let stars = [];
let gameRunning = true;
let speedMultiplier = 1;


// Smooth basket movement variables
let basketX = 160;
let basketTargetX = 160;

// Ask player name on start
let playerName = prompt("Enter your name:") || "Guest";
playerNameDisplay.textContent = playerName;

// Get saved high score or 0
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.textContent = highScore;

// Basket properties
const basket = { y: 450, width: 80, height: 20, speed: 8 };

function createStar() {
  stars.push({
    x: Math.random() * (canvas.width - 20) + 10,
    y: -20,
    size: 20,
    speed: 1 + Math.random() * 2,
    caught: false,  // Initialize caught to false
  });
}

// Hover event to catch stars
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  stars.forEach((star) => {
    if (!star.caught) {
      const dx = mouseX - star.x;
      const dy = mouseY - star.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < star.size / 2) {
        star.caught = true;
        score++;
        scoreDisplay.textContent = score;
      }
    }
  });
});

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

function drawStars() {
  ctx.fillStyle = "#ffd60a";
  ctx.shadowColor = "#ffd60abb";
  ctx.shadowBlur = 20;
  stars.forEach((star) => {
    ctx.beginPath();
    // Draw star shape:
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

function moveStars() {
  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].y += stars[i].speed * speedMultiplier; // <- applies multiplier;

    if (stars[i].caught) {
      stars.splice(i, 1);
      continue;
    }

    // Check collision with basket
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

function updateHighScore(score) {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.textContent = highScore;
  }
}

function endGame() {
  if (!gameRunning) return;
  gameRunning = false;
  updateHighScore(score);
  alert(`${playerName}, Game Over! Your score: ${score} | High Score: ${highScore}`);
  retryBtn.style.display = "inline-block";
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
   // Slowly increase difficulty
  speedMultiplier += 0.0005; // adjust to make it faster/slower

  // Smooth basket movement (lerp)
  basketX += (basketTargetX - basketX) * 0.2;

  drawBasket();
  drawStars();
  moveStars();

  requestAnimationFrame(gameLoop);
}

// Keyboard input for basket control
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    basketTargetX = Math.max(basketTargetX - basket.speed, 0);
  }
  if (e.key === "ArrowRight") {
    basketTargetX = Math.min(basketTargetX + basket.speed, canvas.width - basket.width);
  }
});

retryBtn.addEventListener("click", () => {
  score = 0;
  stars = [];
  scoreDisplay.textContent = score;
  gameRunning = true;
  retryBtn.style.display = "none";
  gameLoop();
});

// Start spawning stars after 2 seconds
setTimeout(() => {
  setInterval(() => {
    if (gameRunning) createStar();
  }, 1200);
}, 2000);

gameLoop();
