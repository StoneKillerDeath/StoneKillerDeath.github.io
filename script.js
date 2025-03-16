// Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");
canvas.width = 800;
canvas.height = 400;

// Players and Ball properties
const stickman1 = {
    x: 50,
    y: canvas.height / 2 - 50,
    width: 30,
    height: 80,
    color: "blue",
    moveSpeed: 5,
};

const stickman2 = {
    x: canvas.width - 80,
    y: canvas.height / 2 - 50,
    width: 30,
    height: 80,
    color: "red",
    moveSpeed: 5,
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    color: "white",
    speedX: 4,
    speedY: 2,
    lastHitBy: null, // Tracks who hit the ball last
};

let gameOver = false;
let winner = null;

// Controls
const keys = {};

// Event listeners for keypresses
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// Draw stickman
function drawStickman(stickman) {
    ctx.fillStyle = stickman.color;
    ctx.fillRect(stickman.x, stickman.y, stickman.width, stickman.height);
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// Move and check ball collision
function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Bounce ball off top and bottom walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.speedY *= -1;
    }

    // Check collision with stickman1
    if (
        ball.x - ball.radius <= stickman1.x + stickman1.width &&
        ball.x > stickman1.x &&
        ball.y >= stickman1.y &&
        ball.y <= stickman1.y + stickman1.height
    ) {
        ball.speedX *= -1;
        ball.lastHitBy = "blue";
    }

    // Check collision with stickman2
    if (
        ball.x + ball.radius >= stickman2.x &&
        ball.x < stickman2.x + stickman2.width &&
        ball.y >= stickman2.y &&
        ball.y <= stickman2.y + stickman2.height
    ) {
        ball.speedX *= -1;
        ball.lastHitBy = "red";
    }

    // Game over condition: If the ball goes off the left or right side
    if (ball.x + ball.radius < 0) {
        gameOver = true;
        winner = "Red";
    }

    if (ball.x - ball.radius > canvas.width) {
        gameOver = true;
        winner = "Blue";
    }
}

// Display Game Over and Restart Button
function handleGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText(`${winner} Wins!`, canvas.width / 2 - 100, canvas.height / 2 - 20);
    restartButton.style.display = "block";
}

// Game loop
function gameLoop() {
    if (gameOver) {
        handleGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Movement logic for stickman1
    if (keys["w"] && stickman1.y > 0) stickman1.y -= stickman1.moveSpeed; // Move up
    if (keys["s"] && stickman1.y < canvas.height - stickman1.height) stickman1.y += stickman1.moveSpeed; // Move down

    // Movement logic for stickman2
    if (keys["ArrowUp"] && stickman2.y > 0) stickman2.y -= stickman2.moveSpeed; // Move up
    if (keys["ArrowDown"] && stickman2.y < canvas.height - stickman2.height) stickman2.y += stickman2.moveSpeed; // Move down

    // Update and draw ball
    updateBall();
    drawBall();

    // Draw players
    drawStickman(stickman1);
    drawStickman(stickman2);

    requestAnimationFrame(gameLoop);
}

// Restart game logic
function restartGame() {
    // Reset positions and states
    stickman1.y = canvas.height / 2 - 50;
    stickman2.y = canvas.height / 2 - 50;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 4;
    ball.speedY = 2;
    ball.lastHitBy = null;
    gameOver = false;
    winner = null;
    restartButton.style.display = "none"; // Hide restart button
    gameLoop();
}

// Event listener for restart button
restartButton.addEventListener("click", restartGame);

// Start the game
gameLoop();











