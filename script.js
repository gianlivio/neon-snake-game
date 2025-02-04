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

const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'];

// Coffee emoji sprite
const coffeeEmoji = "☕";

function drawGame() {
    moveSnake();
    
    if (checkGameOver()) return;
    
    ctx.fillStyle = '#9bbc0f';
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

    // Draw coffee with pulse effect
    const pulseSize = Math.sin(Date.now() / 200) * 2;
    ctx.font = `${gridSize + pulseSize}px Arial`;
    ctx.fillStyle = '#8b4513';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(coffeeEmoji, 
        food.x * gridSize + gridSize/2,
        food.y * gridSize + gridSize/2
    );
    
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
    
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        coffees++;
        showMessage("Dev Fuel ++!");
        generateFood();
    } else {
        snake.pop();
    }
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
    document.querySelector('.screen-frame').appendChild(msg);
    
    setTimeout(() => msg.remove(), 1000);
}

// ... resto del codice invariato ...

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
