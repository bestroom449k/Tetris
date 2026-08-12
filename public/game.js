// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const previewCanvas = document.getElementById('previewCanvas');
const previewCtx = previewCanvas.getContext('2d');

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const BLOCK_SIZE = canvas.width / GRID_WIDTH;

let grid = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null));
let currentPiece = null;
let score = 0;
let lines = 0;
let level = 1;
let gameRunning = false;
let gamePaused = false;
let gameOver = false;
let dropCounter = 0;
let dropInterval = 1000;

// Tetromino shapes
const TETROMINOES = [
    [[1, 1, 1, 1]],           // I
    [[1, 1], [1, 1]],         // O
    [[0, 1, 0], [1, 1, 1]],   // T
    [[0, 1, 1], [1, 1, 0]],   // S
    [[1, 1, 0], [0, 1, 1]],   // Z
    [[1, 0, 0], [1, 1, 1]],   // J
    [[0, 0, 1], [1, 1, 1]]    // L
];

// Default colors for each tetromino type
const TETROMINO_COLORS = [
    '#00FFFF', // I - Cyan
    '#FFFF00', // O - Yellow
    '#FF00FF', // T - Purple
    '#00FF00', // S - Green
    '#FF0000', // Z - Red
    '#0000FF', // J - Blue
    '#FFA500'  // L - Orange
];

// Color selection state
let selectedColor = null;
let userSelectedColor = false;

// Piece constructor
function Piece(shape, typeIndex) {
    this.shape = shape;
    this.x = Math.floor(GRID_WIDTH / 2) - Math.floor(shape[0].length / 2);
    this.y = 0;
    this.typeIndex = typeIndex;
    // Use selected color if user chose one, otherwise use type's default color
    this.color = userSelectedColor && selectedColor ? selectedColor : TETROMINO_COLORS[typeIndex];
}

// Get random piece
function getRandomPiece() {
    const typeIndex = Math.floor(Math.random() * TETROMINOES.length);
    const shape = TETROMINOES[typeIndex];
    return new Piece(shape, typeIndex);
}

// Draw block on canvas
function drawBlock(x, y, color) {
    const drawX = x * BLOCK_SIZE;
    const drawY = y * BLOCK_SIZE;
    
    ctx.fillStyle = color;
    ctx.fillRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
}

// Draw grid
function drawGrid() {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= GRID_WIDTH; i++) {
        ctx.beginPath();
        ctx.moveTo(i * BLOCK_SIZE, 0);
        ctx.lineTo(i * BLOCK_SIZE, canvas.height);
        ctx.stroke();
    }
    
    for (let i = 0; i <= GRID_HEIGHT; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * BLOCK_SIZE);
        ctx.lineTo(canvas.width, i * BLOCK_SIZE);
        ctx.stroke();
    }
}

// Draw placed blocks
function drawPlacedBlocks() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (grid[y][x]) {
                drawBlock(x, y, grid[y][x]);
            }
        }
    }
}

// Draw current piece
function drawCurrentPiece() {
    if (!currentPiece) return;
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                drawBlock(currentPiece.x + x, currentPiece.y + y, currentPiece.color);
            }
        }
    }
}

// Draw canvas
function draw() {
    drawGrid();
    drawPlacedBlocks();
    drawCurrentPiece();
}

// Check collision
function canMoveTo(x, y, shape) {
    for (let dy = 0; dy < shape.length; dy++) {
        for (let dx = 0; dx < shape[dy].length; dx++) {
            if (!shape[dy][dx]) continue;
            
            const newX = x + dx;
            const newY = y + dy;
            
            if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
                return false;
            }
            
            if (newY >= 0 && grid[newY][newX]) {
                return false;
            }
        }
    }
    return true;
}

// Move piece left
function moveLeft() {
    if (!currentPiece || gamePaused || gameOver) return;
    if (canMoveTo(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x--;
    }
}

// Move piece right
function moveRight() {
    if (!currentPiece || gamePaused || gameOver) return;
    if (canMoveTo(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x++;
    }
}

// Drop piece faster
function moveDown() {
    if (!currentPiece || gamePaused || gameOver) return;
    dropCounter = Math.max(0, dropCounter - 1500);
}

// Rotate piece
function rotatePiece() {
    if (!currentPiece || gamePaused || gameOver) return;
    
    const rotated = currentPiece.shape[0].map((_, i) => 
        currentPiece.shape.map(row => row[i]).reverse()
    );
    
    if (canMoveTo(currentPiece.x, currentPiece.y, rotated)) {
        currentPiece.shape = rotated;
    }
}

// Drop piece all the way down
function dropPiece() {
    if (!currentPiece || gamePaused || gameOver) return;
    
    while (canMoveTo(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
        currentPiece.y++;
    }
    dropCounter = dropInterval;
}

// Place piece on grid
function placePiece() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                const gridY = currentPiece.y + y;
                const gridX = currentPiece.x + x;
                
                if (gridY >= 0 && gridY < GRID_HEIGHT && gridX >= 0 && gridX < GRID_WIDTH) {
                    grid[gridY][gridX] = currentPiece.color;
                }
            }
        }
    }
    
    checkLines();
    currentPiece = null;
}

// Check for completed lines
function checkLines() {
    const linesToClear = [];
    
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
        if (grid[y].every(block => block !== null)) {
            linesToClear.push(y);
        }
    }
    
    if (linesToClear.length > 0) {
        lines += linesToClear.length;
        score += linesToClear.length * 100 * level;
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        
        linesToClear.forEach(y => {
            grid.splice(y, 1);
            grid.unshift(Array(GRID_WIDTH).fill(null));
        });
    }
    
    updateStats();
}

// Update stats display
function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

// Game loop
let lastTime = 0;
function gameLoop(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    if (!gameRunning || gamePaused) {
        draw();
        requestAnimationFrame(gameLoop);
        return;
    }
    
    dropCounter += deltaTime;
    
    if (dropCounter > dropInterval) {
        if (currentPiece && canMoveTo(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
            currentPiece.y++;
        } else if (currentPiece) {
            placePiece();
        }
        
        if (!currentPiece) {
            currentPiece = getRandomPiece();
            
            if (!canMoveTo(currentPiece.x, currentPiece.y, currentPiece.shape)) {
                gameRunning = false;
                gameOver = true;
                document.getElementById('startBtn').textContent = 'Game Over! Start New Game';
                document.getElementById('pauseBtn').disabled = true;
            }
        }
        
        dropCounter = 0;
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    if (gameOver) {
        resetGame();
        return;
    }
    
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        gameOver = false;
        currentPiece = getRandomPiece();
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = 'Pause';
        lastTime = 0;
        dropCounter = 0;
        requestAnimationFrame(gameLoop);
    }
}

// Pause/Resume game
function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    document.getElementById('pauseBtn').textContent = gamePaused ? 'Resume' : 'Pause';
    
    if (!gamePaused) {
        lastTime = 0;
        requestAnimationFrame(gameLoop);
    }
}

// Reset game
function resetGame() {
    grid = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null));
    currentPiece = null;
    score = 0;
    lines = 0;
    level = 1;
    gameRunning = false;
    gamePaused = false;
    gameOver = false;
    dropCounter = 0;
    dropInterval = 1000;
    
    document.getElementById('startBtn').textContent = 'Start Game';
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('pauseBtn').textContent = 'Pause';
    
    updateStats();
    draw();
}

// Draw preview
function drawPreview() {
    previewCtx.fillStyle = '#fff';
    previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.strokeStyle = '#ccc';
    previewCtx.lineWidth = 1;
    previewCtx.strokeRect(0, 0, previewCanvas.width, previewCanvas.height);

    const previewBlockSize = 30;
    let centerX = (previewCanvas.width - 30) / 2;
    let centerY = (previewCanvas.height - 30) / 2;

    if (userSelectedColor && selectedColor) {
        previewCtx.fillStyle = selectedColor;
        previewCtx.fillRect(centerX, centerY, previewBlockSize, previewBlockSize);
        previewCtx.strokeStyle = '#000';
        previewCtx.lineWidth = 2;
        previewCtx.strokeRect(centerX, centerY, previewBlockSize, previewBlockSize);
    } else {
        // Draw default colors to show variety
        const blockColors = TETROMINO_COLORS;
        const blockSize = 10;
        let startX = centerX - 20;
        let startY = centerY - 20;
        for (let i = 0; i < blockColors.length; i++) {
            previewCtx.fillStyle = blockColors[i];
            previewCtx.fillRect(startX + (i % 3) * 12, startY + Math.floor(i / 3) * 12, blockSize, blockSize);
            previewCtx.strokeStyle = '#000';
            previewCtx.lineWidth = 0.5;
            previewCtx.strokeRect(startX + (i % 3) * 12, startY + Math.floor(i / 3) * 12, blockSize, blockSize);
        }
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveLeft();
    if (e.key === 'ArrowRight') moveRight();
    if (e.key === 'ArrowDown') moveDown();
    if (e.key === 'ArrowUp' || e.key === 'z' || e.key === 'Z') rotatePiece();
    if (e.key === ' ') {
        e.preventDefault();
        dropPiece();
    }
});

// Button controls
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.getElementById('resetBtn').addEventListener('click', resetGame);

// Color selection
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        selectedColor = btn.getAttribute('data-color');
        userSelectedColor = true;
        
        const colorName = btn.getAttribute('title');
        document.getElementById('previewType').textContent = `Color: ${colorName}`;
        drawPreview();
    });
});

// Initialize
resetGame();
document.getElementById('previewType').textContent = 'Default: Each block has unique color';
drawPreview();
