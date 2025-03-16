const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player details
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    speed: 5
};

// Map offset
let offsetX = 0;
let offsetY = 0;

// Trees
const trees = [
    { x: 100, y: 200 },
    { x: 500, y: 300 },
    { x: 800, y: 600 },
    { x: 1200, y: 100 },
    { x: 1500, y: 700 }
];

// Game controls
const keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Update function
function update() {
    if (keys["ArrowUp"]) offsetY += player.speed;
    if (keys["ArrowDown"]) offsetY -= player.speed;
    if (keys["ArrowLeft"]) offsetX += player.speed;
    if (keys["ArrowRight"]) offsetX -= player.speed;
}

// Draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Draw trees
    trees.forEach(tree => {
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(tree.x + offsetX, tree.y + offsetY, 30, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();



















