const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const gameContainer = document.getElementById('gameContainer');

let bird = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.8,
    jump: -10
};

let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 2;
let score = 0;
let gameRunning = false;
let gameStarted = false;

function drawBird() {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    ctx.fillStyle = '#FFA500';
    ctx.fillRect(bird.x + 5, bird.y + 5, 20, 10); // beak
    ctx.fillStyle = '#000';
    ctx.fillRect(bird.x + 20, bird.y + 5, 5, 5); // eye
}

function drawPipes() {
    ctx.fillStyle = '#228B22';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
    });
}

function updateBird() {
    if (gameStarted) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
    }
}

function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        let topHeight = Math.random() * (canvas.height - pipeGap - 50) + 50;
        let bottomHeight = canvas.height - topHeight - pipeGap;
        pipes.push({
            x: canvas.width,
            topHeight: topHeight,
            bottomHeight: bottomHeight
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function checkCollision() {
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameRunning = false;
    }

    pipes.forEach(pipe => {
        if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x) {
            if (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight) {
                gameRunning = false;
            }
        }
        if (bird.x === pipe.x + pipeWidth) {
            score++;
            scoreElement.textContent = `Score: ${score}`;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPipes();
    drawBird();
}

function update() {
    updateBird();
    updatePipes();
    checkCollision();
}

function gameLoop() {
    if (gameRunning) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    } else {
        gameOver();
    }
}

function gameOver() {
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

function restartGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    gameOverElement.style.display = 'none';
    gameRunning = true;
    gameStarted = false;
    // Don't start gameLoop here, wait for click
}

function startGame() {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    gameRunning = true;
    gameStarted = false;
    // Game loop will start on first click
}

canvas.addEventListener('click', () => {
    if (gameRunning) {
        if (!gameStarted) {
            gameStarted = true;
            bird.velocity = bird.jump;
            gameLoop();
        } else {
            bird.velocity = bird.jump;
        }
    }
});

restartBtn.addEventListener('click', restartGame);
startBtn.addEventListener('click', startGame);