const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

let gridSize = 20;
let tileCount = canvas.width / gridSize;

/**
 * Adjusts canvas size based on screen size while maintaining aspect ratio
 */
function resizeCanvas() {
    const maxSize = Math.min(window.innerWidth - 40, window.innerHeight - 200, 400);
    const minSize = 160; // Minimum playable size
    const finalSize = Math.max(maxSize, minSize);
    canvas.width = finalSize;
    canvas.height = finalSize;
    gridSize = finalSize / 20;
    tileCount = 20;
}

let snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 200;
let gameInterval;

// Pure functions for testing

/**
 * Generates a random food position that doesn't overlap with snake body
 * Keeps generating until it finds an empty spot
 */
function generateFoodPosition(snake, tileCount) {
    let food;
    do {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
}

/**
 * Calculates the next head position based on current position and direction
 */
function calculateNewHead(currentHead, dx, dy) {
    return {x: currentHead.x + dx, y: currentHead.y + dy};
}

/**
 * Checks if game should end due to wall collision or self-collision
 */
function isGameOver(head, snake, tileCount) {
    return head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
           snake.some(segment => segment.x === head.x && segment.y === head.y);
}

/**
 * Checks if snake head has collided with food
 */
function checkFoodCollision(head, food) {
    return head.x === food.x && head.y === food.y;
}

/**
 * Calculates new game speed - increases every 50 points with minimum limit
 */
function calculateNewSpeed(score, currentSpeed) {
    if (score % 50 === 0) {
        return Math.max(50, currentSpeed - 20); // Decrease interval = increase speed
    }
    return currentSpeed;
}

// Game functions

/**
 * Spawns new food at a random position avoiding snake body
 */
function randomFood() {
    food = generateFoodPosition(snake, tileCount);
}

/**
 * Renders the game state to canvas - background, snake, and food
 */
function drawGame() {
    // Clear canvas with dark background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake - red head, green body
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#f00' : '#0f0'; // Head red, body green
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    
    // Draw white food
    ctx.fillStyle = '#fff';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

/**
 * Main game logic - moves snake, handles collisions, food consumption, and scoring
 */
function moveSnake() {
    const head = calculateNewHead(snake[0], dx, dy);
    
    // Check for game over conditions
    if (isGameOver(head, snake, tileCount)) {
        resetGame();
        return;
    }
    
    // Add new head to snake
    snake.unshift(head);
    
    // Check if food was eaten
    if (checkFoodCollision(head, food)) {
        score += 10;
        scoreElement.textContent = score;
        
        // Increase speed every 50 points
        const newSpeed = calculateNewSpeed(score, gameSpeed);
        if (newSpeed !== gameSpeed) {
            gameSpeed = newSpeed;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
        
        randomFood(); // Spawn new food
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
}

/**
 * Resets all game state to initial values
 */
function resetGame() {
    snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}]; // Reset to 3 segments
    dx = 0; // Stop horizontal movement
    dy = 0; // Stop vertical movement
    score = 0; // Reset score
    gameSpeed = 200; // Reset to initial speed
    scoreElement.textContent = score; // Update score display
    clearInterval(gameInterval); // Clear old game loop
    gameInterval = setInterval(gameLoop, gameSpeed); // Start new game loop
    randomFood(); // Spawn initial food
}

/**
 * Handle keyboard input for snake movement
 * Prevents reverse direction to avoid instant death
 */
document.addEventListener('keydown', e => {
    if ((e.key === 'ArrowUp' || e.key === 'w') && dy !== 1) { dx = 0; dy = -1; } // Up
    if ((e.key === 'ArrowDown' || e.key === 's') && dy !== -1) { dx = 0; dy = 1; } // Down
    if ((e.key === 'ArrowLeft' || e.key === 'a') && dx !== 1) { dx = -1; dy = 0; } // Left
    if ((e.key === 'ArrowRight' || e.key === 'd') && dx !== -1) { dx = 1; dy = 0; } // Right
});

// Restart button event listener
restartBtn.addEventListener('click', resetGame);

/**
 * Handle touch controls for mobile devices
 */
document.querySelectorAll('.touch-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const direction = e.target.dataset.direction;
        switch(direction) {
            case 'up': if (dy !== 1) { dx = 0; dy = -1; } break;
            case 'down': if (dy !== -1) { dx = 0; dy = 1; } break;
            case 'left': if (dx !== 1) { dx = -1; dy = 0; } break;
            case 'right': if (dx !== -1) { dx = 1; dy = 0; } break;
        }
    });
});

/**
 * Handle window resize to maintain responsive canvas
 */
window.addEventListener('resize', resizeCanvas);

/**
 * Main game loop - called repeatedly by setInterval
 * Updates game state and renders to screen
 */
function gameLoop() {
    moveSnake(); // Update snake position and game logic
    drawGame(); // Render current state to canvas
}

// Initialize game
resizeCanvas(); // Set initial canvas size
randomFood(); // Spawn initial food
gameInterval = setInterval(gameLoop, gameSpeed); // Start game loop