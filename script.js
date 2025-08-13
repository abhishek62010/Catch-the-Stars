// =========================
// 1. BASIC GAME VARIABLES
// =========================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const retryBtn = document.getElementById("retryBtn");
const playerNameEl = document.getElementById("playerName");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

// Get player name
let playerName = prompt("Enter your name:") || "Guest";
playerNameEl.textContent = playerName;

// Game data
let stars = [];      // List of star objects
let bombs = [];      // List of bomb objects
let basketX = canvas.width / 2 - 25;
let basketTargetX = basketX;
let basketWidth = 50;
let basketHeight = 20;
let score = 0;
let highScore = localStorage.getItem("catchStarsHighScore") || 0;
highScoreEl.textContent = highScore;
let speedMultiplier = 1;  // Controls falling speed
let gameRunning = true;

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
let mouseDown = false;

// =========================
// 2. EVENT LISTENERS
// =========================
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

canvas.addEventListener("mousedown", () => {
  mouseDown = true;
});

canvas.addEventListener("mouseup", () => {
  mouseDown = false;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") basketTargetX -= 30;
  if (e.key === "ArrowRight") basketTargetX += 30;
});

retryBtn.addEventListener("click", resetGame);

// =========================
// 3. DRAW FUNCTIONS
// =========================
function drawBasket() {
  ctx.fillStyle = "#ff6600";
  ctx.fillRect(basketX, canvas.height - basketHeight - 10, basketWidth, basketHeight);
}

function drawStars() {
  ctx.fillStyle = "yellow";
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBombs() {
  ctx.fillStyle = "red";
  bombs.forEach((bomb) => {
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// =========================
// 4. STAR & BOMB MOVEMENT
// =========================
function moveStars() {
  stars.forEach((star, index) => {
    star.y += star.speed * speedMultiplier;

    // Check if star caught by basket
    if (
      star.y + star.radius > canvas.height - basketHeight - 10 &&
      star.x > basketX &&
      star.x < basketX + basketWidth
    ) {
      score++;
      scoreEl.textContent = score;
      stars.splice(index, 1);
    }
    // If star missed (goes off screen)
    else if (star.y - star.radius > canvas.height) {
      gameOver();
    }
  });

  // Spawn new stars randomly
  if (Math.random() < 0.02) {
    stars.push({
      x: Math.random() * canvas.width,
      y: 0,
      radius: 8,
      speed: 2 + Math.random() * 2,
    });
  }
}

function moveBombs() {
  bombs.forEach((bomb, index) => {
    bomb.y += bomb.speed * speedMultiplier;

    // If bomb hits basket → Game Over
    if (
      bomb.y + bomb.radius > canvas.height - basketHeight - 10 &&
      bomb.x > basketX &&
      bomb.x < basketX + basketWidth
    ) {
      gameOver();
    }
    // Remove bomb if off screen
    else if (bomb.y - bomb.radius > canvas.height) {
      bombs.splice(index, 1);
    }
  });

  // Spawn bombs less frequently than stars
  if (Math.random() < 0.005) {
    bombs.push({
      x: Math.random() * canvas.width,
      y: 0,
      radius: 10,
      speed: 2 + Math.random() * 2,
    });
  }
}

// =========================
// 5. MOUSE CLICK / HOVER CATCH
// =========================
function checkMouseOnStars() {
  // Click or hover to catch stars
  stars.forEach((star, index) => {
    const dx = mouseX - star.x;
    const dy = mouseY - star.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If mouse is over star
    if (distance < star.radius + 2) {
      if (mouseDown || true) { // true allows hover
        score++;
        scoreEl.textContent = score;
        stars.splice(index, 1);
      }
    }
  });

  // Clicking or hovering on bomb ends game
  bombs.forEach((bomb) => {
    const dx = mouseX - bomb.x;
    const dy = mouseY - bomb.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < bomb.radius + 2) {
      gameOver();
    }
  });
}

// =========================
// 6. GAME OVER
// =========================
function gameOver() {
  gameRunning = false;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("catchStarsHighScore", highScore);
  }
  highScoreEl.textContent = highScore;
  retryBtn.style.display = "block";
}

// =========================
// 7. RESET GAME
// =========================
function resetGame() {
  score = 0;
  scoreEl.textContent = score;
  stars = [];
  bombs = [];
  speedMultiplier = 1;
  gameRunning = true;
  retryBtn.style.display = "none";
  gameLoop();
}

// =========================
// 8. GAME LOOP
// =========================
function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Increase speed slowly over time
  speedMultiplier += 0.0005;

  // Smooth basket movement
  basketX += (basketTargetX - basketX) * 0.2;

  // Draw elements
  drawBasket();
  drawStars();
  drawBombs();

  // Check for mouse catches
  checkMouseOnStars();

  // Move elements
  moveStars();
  moveBombs();

  requestAnimationFrame(gameLoop);
}

gameLoop();
