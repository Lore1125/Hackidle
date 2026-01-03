(function (global) {
    "use strict";

    const safeClone = typeof structuredClone === "function"
        ? structuredClone
        : (value) => JSON.parse(JSON.stringify(value));

    const allowedEquipSlots = new Set([
        "head",
        "chest",
        "hands",
        "legs",
        "shoes",
        "attachment1",
        "attachment2"
    ]);

    const playerTemplate = {
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

    const enemyTemplates = {
        "Firewall Sentinel": { health: 100, attackPower: 8, defense: 3 },
        "Malware Beast": { health: 120, attackPower: 10, defense: 5 },
        "Rogue AI": { health: 150, attackPower: 12, defense: 7 },
    };

    const enemyStates = Object.fromEntries(
        Object.entries(enemyTemplates).map(([name, stats]) => [name, { ...stats }])
    );

    const playerState = safeClone(playerTemplate);
    let currentEnemyName = "Firewall Sentinel";
    let collectedLoot = [];

    const inventoryItems = [
        "Neural Uplink",
        "Encrypted Armor",
        "Ghost Touch Gloves",
        "Stealth Leggings",
        "Zero-Trace Boots",
        "Firewall Disruptor",
        "Signal Booster"
    ];

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function sanitizeNonNegativeNumber(value) {
        const numberValue = Number(value);
        return Number.isFinite(numberValue) ? Math.max(0, numberValue) : 0;
    }

    function getPlayerSnapshot() {
        return safeClone(playerState);
    }

    function getEnemySnapshot() {
        const stats = enemyStates[currentEnemyName];
        return { name: currentEnemyName, ...safeClone(stats) };
    }

    function getEnemyMaxHealth(name = currentEnemyName) {
        return enemyTemplates[name]?.health ?? 0;
    }

    function resetPlayerHealth() {
        playerState.health = playerState.maxHealth;
    }

    function resetEnemyHealth() {
        enemyStates[currentEnemyName].health = enemyTemplates[currentEnemyName].health;
    }

    function resetCombatState() {
        resetPlayerHealth();
        resetEnemyHealth();
    }

    function applyEnemyDamage(amount) {
        const safeAmount = sanitizeNonNegativeNumber(amount);
        const current = enemyStates[currentEnemyName];
        current.health = clamp(current.health - safeAmount, 0, enemyTemplates[currentEnemyName].health);
        return current.health;
    }

    function applyPlayerDamage(amount) {
        const safeAmount = sanitizeNonNegativeNumber(amount);
        playerState.health = clamp(playerState.health - safeAmount, 0, playerState.maxHealth);
        return playerState.health;
    }

    function setCurrentEnemyByRegion(region) {
        if (region === "East Square") {
            currentEnemyName = "Firewall Sentinel";
        } else if (region === "Dark Alley") {
            currentEnemyName = "Malware Beast";
        } else if (region === "Corporate HQ") {
            currentEnemyName = "Rogue AI";
        }
        resetEnemyHealth();
        return currentEnemyName;
    }

    function getAllowedEquipSlots() {
        return [...allowedEquipSlots];
    }

    function setEquipment(slot, itemName) {
        if (!allowedEquipSlots.has(slot)) {
            throw new Error("Attempted to equip invalid slot");
        }
        if (itemName !== null && typeof itemName !== "string") {
            throw new Error("Invalid equipment item type");
        }
        playerState.equipment[slot] = itemName;
    }

    function getEquipment() {
        return { ...playerState.equipment };
    }

    function setPlayerStats({ attackPower, defense, evasion }) {
        playerState.attackPower = attackPower;
        playerState.defense = defense;
        playerState.evasion = evasion;
    }

    function getInventory() {
        return [...inventoryItems];
    }

    function getLoot() {
        return [...collectedLoot];
    }

    function setLoot(items) {
        collectedLoot = [...items];
    }

    function addLoot(items) {
        collectedLoot = [...collectedLoot, ...items];
    }

    global.gameState = Object.freeze({
        getPlayerSnapshot,
        getEnemySnapshot,
        getEnemyMaxHealth,
        resetCombatState,
        applyEnemyDamage,
        applyPlayerDamage,
        setCurrentEnemyByRegion,
        getAllowedEquipSlots,
        setEquipment,
        getEquipment,
        setPlayerStats,
        getInventory,
        getLoot,
        setLoot,
        addLoot
    });
})(window);
