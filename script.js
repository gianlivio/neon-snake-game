const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const coffeeCounter = document.getElementById('coffee-counter');
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
let coffees = 0;
let gameLoop;
let trail = [];
let lastFoodTime = 0;

const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'];

function drawGame() {
   moveSnake();
   
   if (checkGameOver()) return;
   
   ctx.fillStyle = '#9bbc0f';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
   
   // Draw trail
   trail.forEach((pos, i) => {
       const alpha = (i / trail.length) * 0.5;
       ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
       ctx.fillRect(pos.x * gridSize, pos.y * gridSize, gridSize - 2, gridSize - 2);
   });
   
   // Draw snake
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

   // Draw coffee cup
   const pulseSize = Math.sin(Date.now() / 200) * 2;
   
   // Base della tazza
   ctx.fillStyle = '#8B4513';
   ctx.beginPath();
   ctx.ellipse(
       food.x * gridSize + gridSize/2,
       food.y * gridSize + gridSize/2 + 5,
       gridSize/2 + pulseSize,
       gridSize/4,
       0,
       0,
       2 * Math.PI
   );
   ctx.fill();

   // Corpo della tazza
   ctx.fillRect(
       food.x * gridSize + 3,
       food.y * gridSize,
       gridSize - 6,
       gridSize - 5
   );

   // Manico
   ctx.beginPath();
   ctx.arc(
       food.x * gridSize + gridSize - 2,
       food.y * gridSize + gridSize/2,
       gridSize/4,
       -Math.PI/2,
       Math.PI/2
   );
   ctx.strokeStyle = '#8B4513';
   ctx.lineWidth = 3;
   ctx.stroke();

   // Vapore animato
   ctx.beginPath();
   ctx.strokeStyle = 'rgba(255,255,255,0.7)';
   ctx.lineWidth = 2;
   for(let i = 0; i < 3; i++) {
       let xOffset = i * 5 - 5;
       let yStart = food.y * gridSize - 2;
       ctx.moveTo(food.x * gridSize + gridSize/2 + xOffset, yStart);
       ctx.quadraticCurveTo(
           food.x * gridSize + gridSize/2 + xOffset + 5,
           yStart - 5 + Math.sin(Date.now()/200 + i) * 3,
           food.x * gridSize + gridSize/2 + xOffset,
           yStart - 10
       );
   }
   ctx.stroke();
   
   scoreElement.textContent = `Score: ${score}`;
   coffeeCounter.textContent = `☕: ${coffees}`;
}

function moveSnake() {
   trail = [...snake];
   
   const newHead = {
       x: snake[0].x + dx,
       y: snake[0].y + dy
   };
   
   snake.unshift(newHead);
   
   const now = Date.now();
   if (newHead.x === food.x && newHead.y === food.y) {
       score += 10;
       coffees++;
       showMessage(getRandomMessage());
       lastFoodTime = now;
       setTimeout(generateFood, 1000);
   } else {
       snake.pop();
   }
}

function getRandomMessage() {
   const messages = [
       "☕ Dev Fuel ++!",
       "Coffee Break! 🎉",
       "Time to refactor! ⚡",
       "Stack Overflow time! 📚",
       "Debugging fuel! 🐛",
       "Git push --coffee!",
       "npm install caffeine",
       "while(coding) { coffee++ }"
   ];
   return messages[Math.floor(Math.random() * messages.length)];
}

function generateFood() {
   food = {
       x: Math.floor(Math.random() * tileCount),
       y: Math.floor(Math.random() * tileCount)
   };
   
   // Evita che il cibo appaia sul serpente
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
       showMessage("Exception: CaffeineLevelTooLow!");
       clearInterval(gameLoop);
       return true;
   }
   return false;
}

function showMessage(text) {
   const msg = document.createElement('div');
   msg.textContent = text;
   msg.style.position = 'absolute';
   msg.style.left = '50%';
   msg.style.top = '50%';
   msg.style.transform = 'translate(-50%, -50%)';
   msg.style.color = '#00ffff';
   msg.style.fontSize = '24px';
   msg.style.textShadow = '0 0 10px #00ffff';
   msg.style.animation = 'fadeOut 1s forwards';
   msg.style.zIndex = '1000';
   document.querySelector('.screen-frame').appendChild(msg);
   
   setTimeout(() => msg.remove(), 1000);
}

function startGame() {
   snake = [{ x: 10, y: 10 }];
   dx = 0;
   dy = 0;
   score = 0;
   coffees = 0;
   trail = [];
   lastFoodTime = Date.now();
   gameOverElement.classList.add('hidden');
   generateFood();
   if (gameLoop) clearInterval(gameLoop);
   gameLoop = setInterval(drawGame, 100);
}

document.addEventListener('keydown', (e) => {
   if (e.ctrlKey && e.altKey && e.key === 'Delete') {
       snake = snake.map(pos => ({
           x: pos.x,
           y: pos.y,
           color: colors[Math.floor(Math.random() * colors.length)]
       }));
       showMessage("BUG MODE ACTIVATED!");
   }
   
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
