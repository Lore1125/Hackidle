// loot.js - Handles loot generation and collection

// Define loot tables for each enemy
const lootTables = {
    "Firewall Sentinel": [
        { item: "Data Cache", chance: 1.0 },
        { item: "Firewall Bypass Key", chance: 0.3 },
        { item: "Encrypted Memory Chip", chance: 0.1 }
    ],
    "Malware Beast": [
        { item: "Corrupted Data Shard", chance: 0.5 },
        { item: "Trojan Injector", chance: 0.4 },
        { item: "Viral Code Packet", chance: 0.1 }
    ],
    "Rogue AI": [
        { item: "Quantum Processing Core", chance: 0.4 },
        { item: "AI Algorithm Script", chance: 0.4 },
        { item: "Black Market Exploit", chance: 0.2 }
    ]
};

// Function to roll for loot after a battle
function generateLoot(enemyName) {
    const lootList = lootTables[enemyName] || [];
    const newLoot = [];
    
    lootList.forEach(loot => {
        if (Math.random() < loot.chance) {
            newLoot.push(loot.item);
        }
    });
    
    if (newLoot.length === 0) {
        newLoot.push("Nothing found...");
    }
    
    gameState.addLoot(newLoot);
    updateLootUI();
}

// Update the loot UI
function updateLootUI() {
    const lootListElement = document.getElementById("loot-list");
    lootListElement.innerHTML = "";
    
    gameState.getLoot().forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        lootListElement.appendChild(listItem);
    });
}

// Auto loot function
function autoLoot() {
    gameState.setLoot([]);
    const enemyLabel = document.getElementById("enemy-name").textContent.split("[")[0].replace("Currently Battling:", "").trim();
    generateLoot(enemyLabel);
}
