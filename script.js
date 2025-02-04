const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

canvas.width = 600;
canvas.height = 600;
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let trail = [];

const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'];

function drawGame() {
 moveSnake();
 
 if (checkGameOver()) return;
 
 ctx.fillStyle = '#0a0a0a';
 ctx.fillRect(0, 0, canvas.width, canvas.height);
 
 trail.forEach((pos, i) => {
   const alpha = (i / trail.length) * 0.5;
   ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
   ctx.fillRect(pos.x * gridSize, pos.y * gridSize, gridSize - 2, gridSize - 2);
 });
 
 snake.forEach((pos, i) => {
   const gradient = ctx.createRadialGradient(
     pos.x * gridSize + gridSize/2,
     pos.y * gridSize + gridSize/2,
     0,
     pos.x * gridSize + gridSize/2,
     pos.y * gridSize + gridSize/2,
     gridSize
   );
   gradient.addColorStop(0, colors[i % colors.length]);
   gradient.addColorStop(1, 'transparent');
   
   ctx.fillStyle = gradient;
   ctx.fillRect(pos.x * gridSize, pos.y * gridSize, gridSize - 1, gridSize - 1);
   ctx.shadowBlur = 15;
   ctx.shadowColor = colors[i % colors.length];
 });

 const pulseSize = Math.sin(Date.now() / 200) * 2;
 ctx.fillStyle = '#ff0000';
 ctx.shadowBlur = 15;
 ctx.shadowColor = '#ff0000';
 ctx.beginPath();
 ctx.arc(
   (food.x * gridSize) + gridSize/2,
   (food.y * gridSize) + gridSize/2,
   (gridSize/2 - 2) + pulseSize,
   0,
   Math.PI * 2
 );
 ctx.fill();
 
 scoreElement.textContent = `Score: ${score}`;
}

function moveSnake() {
 trail = [...snake];
 
 const newHead = {
   x: snake[0].x + dx,
   y: snake[0].y + dy
 };
 
 snake.unshift(newHead);
 
 if (newHead.x === food.x && newHead.y === food.y) {
   score += 10;
   generateFood();
 } else {
   snake.pop();
 }
}

function generateFood() {
 food = {
   x: Math.floor(Math.random() * tileCount),
   y: Math.floor(Math.random() * tileCount)
 };
 
 if (snake.some(pos => pos.x === food.x && pos.y === food.y)) {
   generateFood();
 }
}

function checkGameOver() {
 const head = snake[0];
 
 if (head.x < 0 || head.x >= tileCount || 
     head.y < 0 || head.y >= tileCount ||
     snake.slice(1).some(pos => pos.x === head.x && pos.y === head.y)) {
   gameOverElement.classList.remove('hidden');
   finalScoreElement.textContent = score;
   clearInterval(gameLoop);
   return true;
 }
 return false;
}

function startGame() {
 snake = [{ x: 10, y: 10 }];
 dx = 0;
 dy = 0;
 score = 0;
 trail = [];
 gameOverElement.classList.add('hidden');
 generateFood();
 if (gameLoop) clearInterval(gameLoop);
 gameLoop = setInterval(drawGame, 100);
}

document.addEventListener('keydown', (e) => {
 switch(e.key) {
   case 'ArrowUp':
     if (dy === 0) { dx = 0; dy = -1; }
     break;
   case 'ArrowDown':
     if (dy === 0) { dx = 0; dy = 1; }
     break;
   case 'ArrowLeft':
     if (dx === 0) { dx = -1; dy = 0; }
     break;
   case 'ArrowRight':
     if (dx === 0) { dx = 1; dy = 0; }
     break;
 }
});

startGame();
