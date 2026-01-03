(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const regionSelect = document.getElementById("region-select");
        if (regionSelect) {
            regionSelect.value = "East Square";
        }
        const regionName = document.getElementById("region-name");
        if (regionName) {
            regionName.textContent = "East Square";
        }
        const enemyName = document.getElementById("enemy-name");
        if (enemyName) {
            enemyName.textContent = `Currently Battling: ${getEnemyName()}`;
        }
        updateUI();
        displayInventory();
        updateLootUI();
    });
})();
