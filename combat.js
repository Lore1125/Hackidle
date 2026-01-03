// combat.js - Modular Combat System for Hack Idle

let combatInterval;
let inCombat = false;

// Start combat function
function startCombat() {
    if (inCombat) return;
    inCombat = true;
    document.getElementById("enemy-name").textContent = `Currently Battling: ${getEnemyName()}`;
    combatInterval = setInterval(() => {
        if (!inCombat) return;
        const playerState = gameState.getPlayerSnapshot();
        const enemyState = gameState.getEnemySnapshot();
        if (playerState.health <= 0 || enemyState.health <= 0) {
            endCombat();
            return;
        }
        executeCombatTurn(playerState, enemyState);
    }, 1000);
}

// Combat turn logic
function executeCombatTurn(playerState, enemyState) {
    const playerDamage = calculateDamage(playerState.attackPower, enemyState.defense);
    const enemyDamage = calculateDamage(enemyState.attackPower, playerState.defense);
    
    // Apply evasion chance
    if (Math.random() < playerState.evasion) {
        gameState.applyPlayerDamage(0);
    } else {
        gameState.applyPlayerDamage(enemyDamage);
    }
    
    gameState.applyEnemyDamage(playerDamage);
    updateUI();
}

// Damage calculation function
function calculateDamage(attack, defense) {
    return Math.max(1, attack - (defense * 0.5));
}

// Use exploit function (special attack)
function useExploit() {
    const enemy = gameState.getEnemySnapshot();
    if (enemy.health > 0) {
        const exploitDamage = Math.floor(Math.random() * 15) + 10;
        gameState.applyEnemyDamage(exploitDamage);
        updateUI();
    }
}

// Retreat function
function retreat() {
    inCombat = false;
    clearInterval(combatInterval);
    combatInterval = null;
    gameState.resetCombatState();
    updateUI();
}

// End combat function
function endCombat() {
    const playerState = gameState.getPlayerSnapshot();
    const enemyState = gameState.getEnemySnapshot();
    if (playerState.health <= 0) {
        alert("You were defeated!");
        retreat();
    } else if (enemyState.health <= 0) {
        alert("Enemy defeated!");
        generateLoot(enemyState.name); // Award loot on enemy defeat
        gameState.resetCombatState();
        startCombat(); // Restart combat automatically
    }
}

// Update UI elements
function updateUI() {
    const playerState = gameState.getPlayerSnapshot();
    const enemyState = gameState.getEnemySnapshot();
    const maxEnemyHealth = Math.max(gameState.getEnemyMaxHealth(enemyState.name), 1);

    document.getElementById("player-health").textContent = `${playerState.health}%`;
    document.getElementById("enemy-health").textContent = `${enemyState.health}%`;
    document.getElementById("player-health-bar").style.width = `${(playerState.health / playerState.maxHealth) * 100}%`;
    document.getElementById("enemy-health-bar").style.width = `${(enemyState.health / maxEnemyHealth) * 100}%`;
}

// Function to select an enemy from a region
function selectEnemy(region) {
    const enemyName = gameState.setCurrentEnemyByRegion(region);
    document.getElementById("region-name").textContent = region;
    document.getElementById("enemy-name").textContent = `Currently Battling: ${enemyName}`;
    gameState.resetCombatState();
    updateUI();
} 

// Function to get the current enemy name
function getEnemyName() {
    return gameState.getEnemySnapshot().name;
}
