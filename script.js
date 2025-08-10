// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

// DOM elements
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const playerNameDisplay = document.getElementById("playerName");
const retryBtn = document.getElementById("retryBtn");

// Game variables
let playerName = prompt("Enter your name:") || "Player";
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let stars = [];
let player = { x: 180, y: 350, width: 40, height: 40 };
let gameOver = false;

// Set player name & high score on screen
playerNameDisplay.textContent = playerName;
highScoreDisplay.textContent = highScore;

// Star object
function createStar() {
  let x = Math.random() * (canvas.width - 20);
  let y = -20;
  let speed = Math.random() * 2 + 1;
  stars.push({ x, y, speed });
}

// Update high score
function updateHighScore(score) {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.textContent = highScore;
  }
}

// Restart game
function restartGame() {
  score = 0;
  stars = [];
  player.x = 180;
  gameOver = false;
  scoreDisplay.textContent = score;
  retryBtn.style.display = "none";
  gameLoop();
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw stars
function drawStars() {
  ctx.fillStyle = "white";
  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Update stars position & check collision
function updateStars() {
  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].y += stars[i].speed;

    // Collision with player
    if (
      stars[i].y + 10 >= player.y &&
      stars[i].x >= player.x &&
      stars[i].x <= player.x + player.width
    ) {
      score++;
      scoreDisplay.textContent = score;
      updateHighScore(score);
      stars.splice(i, 1);
    }
    // Missed star
    else if (stars[i].y > canvas.height) {
      gameOver = true;
    }
  }
}

// Game over screen
function showGameOver() {
  ctx.fillStyle = "red";
  ctx.font = "30px Arial
