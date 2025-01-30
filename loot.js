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

let collectedLoot = [];

// Function to roll for loot after a battle
function generateLoot(enemyName) {
    let lootList = lootTables[enemyName] || [];
    let newLoot = [];
    
    lootList.forEach(loot => {
        if (Math.random() < loot.chance) {
            newLoot.push(loot.item);
        }
    });
    
    if (newLoot.length === 0) {
        newLoot.push("Nothing found...");
    }
    
    collectedLoot = [...collectedLoot, ...newLoot];
    updateLootUI();
}

// Update the loot UI
function updateLootUI() {
    let lootListElement = document.getElementById("loot-list");
    lootListElement.innerHTML = "";
    
    collectedLoot.forEach(item => {
        let listItem = document.createElement("li");
        listItem.textContent = item;
        lootListElement.appendChild(listItem);
    });
}

// Auto loot function
function autoLoot() {
    collectedLoot = [];
    generateLoot(document.getElementById("enemy-name").textContent.split("[")[0].trim());
}
