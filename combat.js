// combat.js - Modular Combat System for Hack Idle

// Player stats and equipment enemy stats
let player = {
    health: 80,
    maxHealth: 80,
    attackPower: 10,
    defense: 5,
    evasion: 0.05,
    equipment: {
        head: "Neural Uplink",
        chest: null,
        hands: null,
        legs: null,
        shoes: null,
        attachment1: null,
        attachment2: null
    },
    baseStats: {
        attackPower: 10,
        defense: 5,
        evasion: 0.05,
    }
};

// enemy stats
let enemies = {
    "Firewall Sentinel": { health: 100, attackPower: 8, defense: 3 },
    "Malware Beast": { health: 120, attackPower: 10, defense: 5 },
    "Rogue AI": { health: 150, attackPower: 12, defense: 7 },
};

let currentEnemy = enemies["Firewall Sentinel"];
let combatInterval;
let inCombat = false;

// Start combat function
function startCombat() {
    if (inCombat) return;
    inCombat = true;
    document.getElementById("enemy-name").textContent = `Currently Battling: ${getEnemyName()}`;
    combatInterval = setInterval(() => {
        if (!inCombat) return;
        if (player.health <= 0 || currentEnemy.health <= 0) {
            endCombat();
            return;
        }
        executeCombatTurn();
    }, 1000);
}

// Combat turn logic
function executeCombatTurn() {
    let playerDamage = calculateDamage(player.attackPower, currentEnemy.defense);
    let enemyDamage = calculateDamage(currentEnemy.attackPower, player.defense);
    
    // Apply evasion chance
    if (Math.random() < player.evasion) {
        enemyDamage = 0;
    }
    
    currentEnemy.health = Math.max(0, currentEnemy.health - playerDamage);
    player.health = Math.max(0, player.health - enemyDamage);
    
    updateUI();
}

// Damage calculation function
function calculateDamage(attack, defense) {
    return Math.max(1, attack - (defense * 0.5));
}

// Use exploit function (special attack)
function useExploit() {
    if (currentEnemy.health > 0) {
        let exploitDamage = Math.floor(Math.random() * 15) + 10;
        currentEnemy.health = Math.max(0, currentEnemy.health - exploitDamage);
        updateUI();
    }
}

// Retreat function
function retreat() {
    inCombat = false;
    clearInterval(combatInterval);
    combatInterval = null;
    resetCombat();
    updateUI();
}

// End combat function
function endCombat() {
    if (player.health <= 0) {
        alert("You were defeated!");
        retreat();
    } else {
        alert("Enemy defeated!");
        generateLoot(getEnemyName()); // Award loot on enemy defeat
        resetCombat();
        startCombat(); // Restart combat automatically
    }
}

// Reset combat
function resetCombat() {
    player.health = player.maxHealth;
    currentEnemy.health = enemies[getEnemyName()].health;
}

// Update UI elements
function updateUI() {
    document.getElementById("player-health").textContent = `${player.health}%`;
    document.getElementById("enemy-health").textContent = `${currentEnemy.health}%`;
    document.getElementById("player-health-bar").style.width = `${(player.health / player.maxHealth) * 100}%`;
    document.getElementById("enemy-health-bar").style.width = `${(currentEnemy.health / enemies[getEnemyName()].health) * 100}%`;
}

// Function to select an enemy from a region
function selectEnemy(region) {
    if (region === "East Square") {
        currentEnemy = enemies["Firewall Sentinel"];
    } else if (region === "Dark Alley") {
        currentEnemy = enemies["Malware Beast"];
    } else if (region === "Corporate HQ") {
        currentEnemy = enemies["Rogue AI"];
    }
    document.getElementById("region-name").textContent = region;
    resetCombat();
    updateUI();
} 

// Function to get the current enemy name
function getEnemyName() {
    return Object.keys(enemies).find(name => enemies[name] === currentEnemy);
}
