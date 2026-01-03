// Equipment database with stat modifiers
const equipmentDatabase = {
    "Neural Uplink": { attackPower: 3, tooltip: "Boosts hacking efficiency by 3 attack power." },
    "Encrypted Armor": { defense: 5, tooltip: "Adds 5 defense against cyber attacks." },
    "Ghost Touch Gloves": { evasion: 0.05, tooltip: "Increases evasion by 5%." },
    "Stealth Leggings": { evasion: 0.07, tooltip: "Boosts evasion by 7%." },
    "Zero-Trace Boots": { evasion: 0.1, tooltip: "Enhances movement, increasing evasion by 10%." },
    "Firewall Disruptor": { attackPower: 5, tooltip: "Bypasses enemy defenses for 5 extra attack power." },
    "Signal Booster": { attackPower: 2, defense: 2, tooltip: "Increases both attack and defense slightly." }
};

const allowedSlots = new Set(gameState.getAllowedEquipSlots());

// Function to equip an item
function equipItem(slot, itemName) {
    if (!equipmentDatabase[itemName]) return;
    if (!allowedSlots.has(slot)) {
        alert("Invalid slot. Please choose a valid equipment slot.");
        return;
    }

    try {
        gameState.setEquipment(slot, itemName);
        updatePlayerStats();
        updateEquipmentUI();
    } catch (error) {
        console.error("Failed to equip item", error);
    }
}

// Function to calculate player stats based on equipped items
function updatePlayerStats() {
    const playerSnapshot = gameState.getPlayerSnapshot();
    let attackPower = playerSnapshot.baseStats.attackPower;
    let defense = playerSnapshot.baseStats.defense;
    let evasion = playerSnapshot.baseStats.evasion;

    const equipment = gameState.getEquipment();
    for (const slot in equipment) {
        const item = equipment[slot];
        if (item && equipmentDatabase[item]) {
            const itemStats = equipmentDatabase[item];
            attackPower += itemStats.attackPower || 0;
            defense += itemStats.defense || 0;
            evasion += itemStats.evasion || 0;
        }
    }

    gameState.setPlayerStats({ attackPower, defense, evasion });
}

// Function to update the UI for equipped items
function updateEquipmentUI() {
    const equipment = gameState.getEquipment();
    for (const slot in equipment) {
        const slotElement = document.getElementById(`equip-${slot}`);
        if (slotElement) {
            const itemName = equipment[slot] || "Empty Slot";
            slotElement.textContent = `${slot.charAt(0).toUpperCase() + slot.slice(1)}: ${itemName}`;
            slotElement.title = equipmentDatabase[itemName] ? equipmentDatabase[itemName].tooltip : "No item equipped.";
        }
    }
}

function showTooltip(slot) {
    const equipment = gameState.getEquipment();
    const item = equipment[slot];
    const tooltipText = item && equipmentDatabase[item] ? equipmentDatabase[item].tooltip : "No item equipped.";
    
    const tooltip = document.getElementById("tooltip");
    const slotElement = document.getElementById(`equip-${slot}`);
    if (!tooltip || !slotElement) return;

    const slotPosition = slotElement.getBoundingClientRect();
    tooltip.textContent = tooltipText;
    tooltip.style.left = `${slotPosition.left + slotPosition.width / 2 + window.scrollX}px`;
    tooltip.style.top = `${slotPosition.bottom + 8 + window.scrollY}px`;
    tooltip.style.display = "block";
}

function hideTooltip() {
    document.getElementById("tooltip").style.display = "none";
}

function displayInventory() {
    const inventoryContainer = document.getElementById("inventory-list");
    inventoryContainer.innerHTML = "";
    
    gameState.getInventory().forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.className = "inventory-item";
        itemElement.textContent = item;
        itemElement.onclick = () => selectItemToEquip(item);
        inventoryContainer.appendChild(itemElement);
    });
}

function selectItemToEquip(itemName) {
    const equipSlot = document.getElementById("slot-select")?.value;
    if (!equipSlot) {
        alert("Please choose a slot before equipping an item.");
        return;
    }

    if (allowedSlots.has(equipSlot)) {
        equipItem(equipSlot, itemName);
        displayInventory();
    } else {
        alert("Invalid slot. Please select a valid equipment slot from the dropdown.");
    }
}

displayInventory();

// Initialize UI on load
updateEquipmentUI();
updatePlayerStats();
