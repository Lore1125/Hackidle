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

// Function to equip an item
function equipItem(slot, itemName) {
    if (equipmentDatabase[itemName]) {
        player.equipment[slot] = itemName;
        updatePlayerStats();
        updateEquipmentUI();
    }
}

// Function to calculate player stats based on equipped items
function updatePlayerStats() {
    player.attackPower = player.baseStats.attackPower;
    player.defense = player.baseStats.defense;
    player.evasion = player.baseStats.evasion;

    for (let slot in player.equipment) {
        let item = player.equipment[slot];
        if (item && equipmentDatabase[item]) {
            let itemStats = equipmentDatabase[item];
            player.attackPower += itemStats.attackPower || 0;
            player.defense += itemStats.defense || 0;
            player.evasion += itemStats.evasion || 0;
        }
    }
}

// Function to update the UI for equipped items
function updateEquipmentUI() {
    for (let slot in player.equipment) {
        let slotElement = document.getElementById(`equip-${slot}`);
        if (slotElement) {
            let itemName = player.equipment[slot] || "Empty Slot";
            slotElement.textContent = itemName;
            slotElement.title = equipmentDatabase[itemName] ? equipmentDatabase[itemName].tooltip : "No item equipped.";
        }
    }
}

let inventory = ["Neural Uplink", "Encrypted Armor", "Ghost Touch Gloves", "Stealth Leggings", "Zero-Trace Boots", "Firewall Disruptor", "Signal Booster"];

function showTooltip(slot) {
    let item = player.equipment[slot];
    let tooltipText = item && equipmentDatabase[item] ? equipmentDatabase[item].tooltip : "No item equipped.";
    
    let tooltip = document.getElementById("tooltip");
    tooltip.textContent = tooltipText;
    tooltip.style.display = "block";
}

function hideTooltip() {
    document.getElementById("tooltip").style.display = "none";
}

function displayInventory() {
    let inventoryContainer = document.getElementById("inventory-list");
    inventoryContainer.innerHTML = "";
    
    inventory.forEach(item => {
        let itemElement = document.createElement("div");
        itemElement.className = "inventory-item";
        itemElement.textContent = item;
        itemElement.onclick = () => selectItemToEquip(item);
        inventoryContainer.appendChild(itemElement);
    });
}

function selectItemToEquip(itemName) {
    let equipSlot = prompt("Which slot would you like to equip this to? (head, chest, hands, legs, shoes, attachment1, attachment2)");
    if (player.equipment[equipSlot] !== undefined) {
        equipItem(equipSlot, itemName);
        displayInventory();
    } else {
        alert("Invalid slot. Please enter a valid equipment slot.");
    }
}

displayInventory();

// Initialize UI on load
updateEquipmentUI();