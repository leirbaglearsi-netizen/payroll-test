// ===========================
// AUTH GUARD
// ===========================
if (localStorage.getItem("isLoggedIn") !== "true" && !window.location.href.includes("index.html")) {
  window.location.href = "index.html";
}

// ===========================
// PAGE NAVIGATION
// ===========================
function go(page) {
  window.location.href = page;
}

// ===========================
// LOGOUT
// ===========================
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// ===========================
// UTILITY FUNCTIONS
// ===========================
function formatCurrency(amount) {
  return '₱' + parseFloat(amount).toLocaleString();
}

function showAlert(message, type = 'info') {
  alert(message);
}

// Database initialization for all pages
window.addEventListener("DOMContentLoaded", async () => {
    try {
        // Wait for database to be ready
        await Database.initDB();
        console.log("Database initialized via navigation");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
});

// Clear all data (for testing)
function clearDatabase() {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
        Database.clearAllData();
    }
}

// Export for global use
window.clearDatabase = clearDatabase;
