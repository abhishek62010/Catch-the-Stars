const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 500;

let score = 0;
const scoreDisplay = document.getElementById("score");

// Basket
const basket = { x: 160, y: 450, width: 80, height: 20, speed: 5 };

// Star
let stars = [];

function createStar() {
  stars.push({
    x: Math.random() * (canvas.width - 20),
    y: 0,
    size: 20,
    speed: 2 + Math.random() * 3,
  });
}

function drawBasket() {
  ctx.fillStyle = "#ffd60a";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawStars() {
  ctx.fillStyle = "#fca311";
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function moveStars() {
  stars.forEach((star, index) => {
    star.y += star.speed;

    // Collision detection
    if (
      star.y + star.size > basket.y &&
      star.x > basket.x &&
      star.x < basket.x + basket.width
    ) {
      score++;
      scoreDisplay.textContent = score;
      stars.splice(index, 1);
    }

    // Remove if out of screen
    if (star.y > canvas.height) {
      stars.splice(index, 1);
    }
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawStars();
  moveStars();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && basket.x > 0) basket.x -= basket.speed;
  if (e.key === "ArrowRight" && basket.x < canvas.width - basket.width)
    basket.x += basket.speed;
});

setInterval(createStar, 1000);
gameLoop();
