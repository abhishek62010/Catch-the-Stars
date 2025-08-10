const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 500;

let score = 0;
let stars = [];

class Star {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = 20;
  }
  draw() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  update() {
    this.y += this.speed;
  }
}

function spawnStar() {
  const x = Math.random() * (canvas.width - 20) + 10;
  const speed = Math.random() * 3 + 1;
  stars.push(new Star(x, 0, speed));
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  stars = stars.filter(star => {
    const dist = Math.hypot(clickX - star.x, clickY - star.y);
    if (dist < star.size) {
      score++;
      document.getElementById("score").innerText = "Score: " + score;
      return false;
    }
    return true;
  });
});

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    star.update();
    star.draw();
  });
  stars = stars.filter(star => star.y < canvas.height);
}

setInterval(spawnStar, 1000);
setInterval(updateGame, 20);
