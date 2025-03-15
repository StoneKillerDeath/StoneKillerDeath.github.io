// Select DOM elements
const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");
const wall = document.getElementById("wall");
const healthBar = document.getElementById("health-bar");
const wallHealthBar = document.getElementById("wall-health-bar");
const coinCounter = document.getElementById("coin-counter");
const upgradeMenu = document.getElementById("upgrade-menu");
const upgradeButton = document.getElementById("upgrade-button");
const closeUpgradeMenu = document.getElementById("close-upgrade-menu");
const restartButton = document.getElementById("restart-button");

// Game variables
let coins = 0;
let health = 10;
let wallHealth = 20;
let position = 50; // Player position in percentage
let playerSpeed = 0.5;
let bulletSpeed = 7;
const maxEnemies = 4;
const enemySpeed = 1; // Speed of enemy movement
const enemyBulletSpeed = 3;
let moveDirection = null;
let moveInterval = null;
let gamePaused = false;
let enemies = [];

// Display initial stats
healthBar.textContent = `Health: ${health}`;
wallHealthBar.textContent = `Wall Health: ${wallHealth}`;
coinCounter.textContent = `Coins: ${coins}`;

// Function to start player movement
function startMoving() {
    if (!moveInterval) {
        moveInterval = setInterval(() => {
            if (moveDirection === "left" && position > 0) {
                position -= playerSpeed;
            } else if (moveDirection === "right" && position < 100) {
                position += playerSpeed;
            }
            player.style.left = position + "%";
        }, 10);
    }
}

// Function to stop player movement
function stopMoving() {
    clearInterval(moveInterval);
    moveInterval = null;
    moveDirection = null;
}

// Movement controls
document.addEventListener("keydown", (event) => {
    if (!gamePaused) {
        if ((event.key === "ArrowLeft" || event.key === "a") && moveDirection !== "left") {
            moveDirection = "left";
            startMoving();
        } else if ((event.key === "ArrowRight" || event.key === "d") && moveDirection !== "right") {
            moveDirection = "right";
            startMoving();
        }
    }
});

document.addEventListener("keyup", () => stopMoving());

// Function to shoot bullets
document.addEventListener("mousedown", () => {
    if (!gamePaused) {
        const shootingInterval = setInterval(() => shootBullet(), 200); // Shoot every 200ms
        document.addEventListener("mouseup", () => clearInterval(shootingInterval), { once: true });
    }
});

function shootBullet() {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    const rect = player.getBoundingClientRect();
    bullet.style.left = rect.left + rect.width / 2 - 3 + "px";
    bullet.style.top = rect.top + "px";
    gameArea.appendChild(bullet);

    const interval = setInterval(() => {
        bullet.style.top = bullet.offsetTop - bulletSpeed + "px";

        // Check collision with enemies
        enemies.forEach((enemy, index) => {
            if (enemy && checkCollision(bullet, enemy)) {
                bullet.remove();
                clearInterval(interval);
                enemy.remove();
                enemies.splice(index, 1);
                coins++;
                coinCounter.textContent = `Coins: ${coins}`;
                spawnEnemy(); // Replace the enemy
            }
        });

        if (bullet.offsetTop < 0) {
            bullet.remove();
            clearInterval(interval);
        }
    }, 20);
}

// Spawn enemies at the top
function spawnEnemy() {
    if (enemies.length < maxEnemies) {
        const enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.style.left = Math.random() * 90 + "%"; // Random horizontal position
        enemy.style.top = "10px"; // Position at the top
        gameArea.appendChild(enemy);
        enemies.push(enemy);

        moveEnemy(enemy);
        shootEnemyBullet(enemy);
    }
}

// Move enemies left and right
function moveEnemy(enemy) {
    let direction = Math.random() > 0.5 ? 1 : -1; // Random initial direction
    const interval = setInterval(() => {
        if (!gamePaused) {
            const enemyLeft = parseFloat(enemy.style.left);
            if (enemyLeft <= 0 || enemyLeft >= 90) direction *= -1; // Reverse direction at edges
            enemy.style.left = enemyLeft + direction * enemySpeed + "%";
        }

        if (!document.body.contains(enemy)) {
            clearInterval(interval);
        }
    }, 100);
}

// Enemy shooting
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
                bullet.style.top = bullet.offsetTop + enemyBulletSpeed + "px";

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
    }, 3000); // Shoot every 3 seconds
}

// Reduce wall health
function reduceWallHealth() {
    wallHealth--;
    wallHealthBar.textContent = `Wall Health: ${wallHealth}`;
    if (wallHealth <= 0) {
        wall.style.display = "none"; // Hide the wall
        wallHealthBar.style.display = "none";
    }
}

// Reduce player health
function reducePlayerHealth() {
    health--;
    healthBar.textContent = `Health: ${health}`;
    if (health <= 0) {
        gameOver();
    }
}

// Game over logic
function gameOver() {
    gamePaused = true;
    document.getElementById("game-over-screen").style.display = "block";
}

// Upgrade menu logic
upgradeButton.addEventListener("click", () => {
    gamePaused = true;
    upgradeMenu.style.display = "flex";
});

closeUpgradeMenu.addEventListener("click", () => {
    upgradeMenu.style.display = "none";
    gamePaused = false;
});

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

// Restart Button Functionality
restartButton.addEventListener("click", () => {
    // Reload the page to restart the game
    location.reload();
});

let bulletSpeedLevel = 0;
let playerSpeedLevel = 0;
let playerHealthLevel = 0;
let wallHealthLevel = 0;

// Bullet Speed Upgrade
bulletSpeedUpgrade.addEventListener("click", () => {
    if (coins >= 50) {
        coins = 0; // Reset coins to 0 after purchase
        bulletSpeed += 0.2; // Increase bullet speed
        bulletSpeedLevel++; // Increment level
        coinCounter.textContent = `Coins: ${coins}`;
        bulletSpeedUpgrade.textContent = `+0.2 Bullet Speed (Level ${bulletSpeedLevel})`; // Update button text
        alert("Bullet speed increased!");
    } else {
        alert("Not enough coins!");
    }
});

// Player Speed Upgrade
playerSpeedUpgrade.addEventListener("click", () => {
    if (coins >= 80) {
        coins = 0;
        playerSpeed += 0.2;
        playerSpeedLevel++;
        coinCounter.textContent = `Coins: ${coins}`;
        playerSpeedUpgrade.textContent = `+0.2 Player Speed (Level ${playerSpeedLevel})`;
        alert("Player speed increased!");
    } else {
        alert("Not enough coins!");
    }
});

// Player Health Upgrade
playerHealthUpgrade.addEventListener("click", () => {
    if (coins >= 100) {
        coins = 0;
        health = 15; // Set player health to 15
        playerHealthLevel++;
        healthBar.textContent = `Health: ${health}`; // Update health bar
        coinCounter.textContent = `Coins: ${coins}`;
        playerHealthUpgrade.textContent = `Set Health to 15 (Level ${playerHealthLevel})`;
        alert("Player health restored to 15!");
    } else {
        alert("Not enough coins!");
    }
});

// Wall Health Upgrade
wallHealthUpgrade.addEventListener("click", () => {
    if (coins >= 100) {
        coins = 0;
        wallHealth = 30; // Set wall health to 30
        wallHealthLevel++;
        wallHealthBar.textContent = `Wall Health: ${wallHealth}`; // Update wall health bar
        coinCounter.textContent = `Coins: ${coins}`;
        wallHealthUpgrade.textContent = `Set Wall Health to 30 (Level ${wallHealthLevel})`;
        alert("Wall health increased to 30!");
    } else {
        alert("Not enough coins!");
    }
});

coinCounter.textContent = `Coins: ${coins}`;

// Bullet Speed Upgrade
bulletSpeedUpgrade.addEventListener("click", () => {
    if (coins >= 50) {
        coins = 0; // Reset coins to 0 after purchase
        bulletSpeed += 0.2; // Increase bullet speed
        bulletSpeedLevel++; // Increment level
        coinCounter.textContent = `Coins: ${coins}`;
        bulletSpeedUpgrade.textContent = `+0.2 Bullet Speed (Level ${bulletSpeedLevel})`; // Update button text
        alert("Bullet speed increased!");
    } else {
        alert("Not enough coins!");
    }
});

// Player Speed Upgrade
playerSpeedUpgrade.addEventListener("click", () => {
    if (coins >= 80) {
        coins = 0;
        playerSpeed += 0.2;
        playerSpeedLevel++;
        coinCounter.textContent = `Coins: ${coins}`;
        playerSpeedUpgrade.textContent = `+0.2 Player Speed (Level ${playerSpeedLevel})`;
        alert("Player speed increased!");
    } else {
        alert("Not enough coins!");
    }
});

// Player Health Upgrade
playerHealthUpgrade.addEventListener("click", () => {
    if (coins >= 100) {
        coins = 0;
        health = 15; // Set player health to 15
        playerHealthLevel++;
        healthBar.textContent = `Health: ${health}`; // Update health bar
        coinCounter.textContent = `Coins: ${coins}`;
        playerHealthUpgrade.textContent = `Set Health to 15 (Level ${playerHealthLevel})`;
        alert("Player health restored to 15!");
    } else {
        alert("Not enough coins!");
    }
});

// Wall Health Upgrade
wallHealthUpgrade.addEventListener("click", () => {
    if (coins >= 100) {
        coins = 0;
        wallHealth = 30; // Set wall health to 30
        wallHealthLevel++;
        wallHealthBar.textContent = `Wall Health: ${wallHealth}`; // Update wall health bar
        coinCounter.textContent = `Coins: ${coins}`;
        wallHealthUpgrade.textContent = `Set Wall Health to 30 (Level ${wallHealthLevel})`;
        alert("Wall health increased to 30!");
    } else {
        alert("Not enough coins!");
    }
});














       



       




























