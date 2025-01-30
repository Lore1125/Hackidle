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
