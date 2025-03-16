// Select game elements
const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");
const healthBar = document.getElementById("health-bar");
const wallHealthBar = document.getElementById("wall-health-bar");
const coinCounter = document.getElementById("coin-counter");

let coins = 0;
let health = 10;
let wallHealth = 20;
let position = 50; // Player's initial horizontal position in percentage
let bulletSpeed = 7;
const maxEnemies = 4;
let enemies = [];
let gamePaused = false;

// Display initial stats
healthBar.textContent = `Health: ${health}`;
wallHealthBar.textContent = `Wall Health: ${wallHealth}`;
coinCounter.textContent = `Coins: ${coins}`;

// Shooting on screen touch
gameArea.addEventListener("click", () => {
    if (!gamePaused) {
        shootBullet(); // Shoot when the screen is tapped
    }
});

// Player follows finger on drag
gameArea.addEventListener("touchmove", (event) => {
    if (!gamePaused) {
        const touchX = event.touches[0].clientX; // Get finger position
        const gameAreaRect = gameArea.getBoundingClientRect();
        const gameWidth = gameAreaRect.width;

        // Calculate percentage-based position
        position = ((touchX - gameAreaRect.left) / gameWidth) * 100;

        // Clamp the player's position to stay within the game area
        if (position < 0) position = 0;
        if (position > 100) position = 100;

        player.style.left = position + "%"; // Move the player horizontally
    }
});

// Function to shoot bullets
function shootBullet() {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    const rect = player.getBoundingClientRect();
    bullet.style.left = rect.left + rect.width / 2 - 3 + "px";
    bullet.style.top = rect.top + "px";
    gameArea.appendChild(bullet);

    const interval = setInterval(() => {
        bullet.style.top = bullet.offsetTop - bulletSpeed + "px";

        enemies.forEach((enemy, index) => {
            if (enemy && checkCollision(bullet, enemy)) {
                bullet.remove();
                clearInterval(interval);
                enemy.remove();
                enemies.splice(index, 1);
                coins++;
                coinCounter.textContent = `Coins: ${coins}`;
                spawnEnemy(); // Replace the destroyed enemy
            }
        });

        if (bullet.offsetTop < 0) {
            bullet.remove();
            clearInterval(interval);
        }
    }, 20);
}

// Spawning enemies
function spawnEnemy() {
    if (enemies.length < maxEnemies) {
        const enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.style.left = Math.random() * 90 + "%"; // Random position along the top
        enemy.style.top = "10px"; // Fixed vertical position
        gameArea.appendChild(enemy);
        enemies.push(enemy);

        moveEnemy(enemy); // Make the enemy move left and right
        shootEnemyBullet(enemy); // Enemies start shooting
    }
}

// Move enemies left and right
function moveEnemy(enemy) {
    let direction = Math.random() > 0.5 ? 1 : -1; // Randomize starting direction
    const interval = setInterval(() => {
        if (!gamePaused) {
            const enemyLeft = parseFloat(enemy.style.left);
            if (enemyLeft <= 0 || enemyLeft >= 90) direction *= -1; // Reverse direction if hitting boundaries
            enemy.style.left = enemyLeft + direction + "%";
        }

        if (!document.body.contains(enemy)) {
            clearInterval(interval); // Stop moving if the enemy is destroyed
        }
    }, 100);
}

// Enemy shooting logic
function shootEnemyBullet(enemy) {
    const shootingInterval = setInterval(() => {
        if (!gamePaused) {
            const bullet = document.createElement("div");
            bullet.classList.add("enemy-bullet");
            const rect = enemy.getBoundingClientRect();
            bullet.style.left = rect.left + rect.width / 2 - 3 + "px";
            bullet.style.top = rect.bottom + "px";
            gameArea.appendChild(bullet);

            const interval = setInterval(() => {
                bullet.style.top = bullet.offsetTop + 3 + "px";

                // Check collision with wall
                if (checkCollision(bullet, wall)) {
                    bullet.remove();
                    clearInterval(interval);
                    reduceWallHealth();
                }

                // Check collision with player
                if (checkCollision(bullet, player)) {
                    bullet.remove();
                    clearInterval(interval);
                    reducePlayerHealth();
                }

                if (bullet.offsetTop > window.innerHeight) {
                    bullet.remove();
                    clearInterval(interval);
                }
            }, 20);

            if (!document.body.contains(enemy)) {
                clearInterval(shootingInterval);
            }
        }
    }, 3000); // Enemies shoot every 3 seconds
}

// Reduce player health
function reducePlayerHealth() {
    health--;
    healthBar.textContent = `Health: ${health}`;
    if (health <= 0) {
        gameOver();
    }
}

// Reduce wall health
function reduceWallHealth() {
    wallHealth--;
    wallHealthBar.textContent = `Wall Health: ${wallHealth}`;
    if (wallHealth <= 0) {
        wall.style.display = "none";
        wallHealthBar.style.display = "none";
        alert("The wall has exploded!");
    }
}

// Game over logic
function gameOver() {
    alert("Game Over!");
    location.reload(); // Restart the game
}

// Collision detection
function checkCollision(obj1, obj2) {
    const rect1 = obj1.getBoundingClientRect();
    const rect2 = obj2.getBoundingClientRect();
    return (
        rect1.right > rect2.left &&
        rect1.left < rect2.right &&
        rect1.bottom > rect2.top &&
        rect1.top < rect2.bottom
    );
}

// Initial enemy spawn
setInterval(spawnEnemy, 2000); // Spawn enemies every 2 seconds



















