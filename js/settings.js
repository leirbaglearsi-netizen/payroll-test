// Settings Module
let selectedSetting = null;

window.addEventListener("DOMContentLoaded", async () => {
    try {
        await Database.initDB();
        await Database.seedTestData();
    } catch (error) {
        console.error("Error initializing settings:", error);
    }
    
    setupSettings();
});

function setupSettings() {
    const saveBtn = document.getElementById("saveBtn");
    if (saveBtn) {
        saveBtn.addEventListener("click", saveSettings);
    }
}

// Simple selection demo (no design change)
window.selectSetting = function(key) {
    selectedSetting = key;
    // You can later open specific settings pages/modals.
    alert("Selected: " + key.toUpperCase() + "\n\nSettings configuration for " + key + " will be available in the next update.");
};

window.saveSettings = function() {
    if (!selectedSetting) {
        alert("Please select a setting category first.");
        return;
    }
    alert(selectedSetting.toUpperCase() + " settings saved successfully!");
};

