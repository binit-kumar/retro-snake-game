# API Documentation

## Core Functions

### Pure Functions (Testable)

#### `generateFoodPosition(snake, tileCount)`
Generates a random food position that doesn't overlap with the snake body.

**Parameters:**
- `snake` (Array): Array of snake segment objects with x,y coordinates
- `tileCount` (Number): Number of tiles per row/column on the game grid

**Returns:**
- `Object`: Food position with x,y coordinates

**Example:**
```javascript
const snake = [{x: 5, y: 5}, {x: 4, y: 5}];
const food = generateFoodPosition(snake, 20);
// Returns: {x: 12, y: 8} (example, varies due to randomness)
```

#### `calculateNewHead(currentHead, dx, dy)`
Calculates the next position of the snake's head based on current position and direction.

**Parameters:**
- `currentHead` (Object): Current head position {x, y}
- `dx` (Number): Horizontal movement (-1, 0, or 1)
- `dy` (Number): Vertical movement (-1, 0, or 1)

**Returns:**
- `Object`: New head position {x, y}

**Example:**
```javascript
const head = {x: 10, y: 10};
const newHead = calculateNewHead(head, 1, 0);
// Returns: {x: 11, y: 10}
```

#### `isGameOver(head, snake, tileCount)`
Determines if the game should end based on collision detection.

**Parameters:**
- `head` (Object): Snake head position {x, y}
- `snake` (Array): Complete snake body including head
- `tileCount` (Number): Grid size for boundary checking

**Returns:**
- `Boolean`: True if game should end, false otherwise

**Example:**
```javascript
const head = {x: -1, y: 5};
const snake = [{x: 5, y: 5}];
const gameOver = isGameOver(head, snake, 20);
// Returns: true (wall collision)
```

#### `checkFoodCollision(head, food)`
Checks if the snake head has collided with food.

**Parameters:**
- `head` (Object): Snake head position {x, y}
- `food` (Object): Food position {x, y}

**Returns:**
- `Boolean`: True if collision detected, false otherwise

**Example:**
```javascript
const head = {x: 10, y: 10};
const food = {x: 10, y: 10};
const collision = checkFoodCollision(head, food);
// Returns: true
```

#### `calculateNewSpeed(score, currentSpeed)`
Calculates new game speed based on score milestones.

**Parameters:**
- `score` (Number): Current player score
- `currentSpeed` (Number): Current game loop interval in milliseconds

**Returns:**
- `Number`: New speed interval (minimum 50ms)

**Example:**
```javascript
const newSpeed = calculateNewSpeed(50, 200);
// Returns: 180 (decreased by 20ms)
```

## Game Loop Functions

### `moveSnake()`
Updates snake position, handles collisions, and manages game state.

**Side Effects:**
- Modifies global `snake` array
- Updates `score` and DOM elements
- Triggers game reset on collision
- Spawns new food on consumption

### `drawGame()`
Renders the current game state to the canvas.

**Side Effects:**
- Draws to canvas context
- Updates visual representation of snake and food

### `gameLoop()`
Main game tick function that orchestrates movement and rendering.

**Side Effects:**
- Calls `moveSnake()` and `drawGame()`
- Executed by `setInterval`

### `resetGame()`
Resets all game state to initial values.

**Side Effects:**
- Resets snake position and length
- Resets score and speed
- Clears and restarts game interval
- Spawns new food

## Event Handlers

### Keyboard Input
Handles directional input with reverse-direction prevention.

**Supported Keys:**
- Arrow keys (↑↓←→)
- WASD keys
- Prevents 180-degree turns

### Restart Button
Triggers `resetGame()` function when clicked.

## Global Variables

| Variable | Type | Description |
|----------|------|-------------|
| `snake` | Array | Snake segments with {x,y} coordinates |
| `food` | Object | Food position {x,y} |
| `dx, dy` | Number | Movement direction vectors |
| `score` | Number | Current player score |
| `gameSpeed` | Number | Game loop interval (ms) |
| `gameInterval` | Number | setInterval reference |
| `gridSize` | Number | Pixel size of each grid tile (20) |
| `tileCount` | Number | Number of tiles per dimension (20) |

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| Canvas Size | 400x400px | Game area dimensions |
| Grid Size | 20px | Individual tile size |
| Initial Speed | 200ms | Starting game loop interval |
| Speed Increase | Every 50 points | Score threshold for speed boost |
| Speed Decrement | 20ms | Amount speed increases per milestone |
| Minimum Speed | 50ms | Fastest possible game speed |
| Initial Snake Length | 3 segments | Starting snake size |