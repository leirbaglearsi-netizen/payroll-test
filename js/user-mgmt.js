// User Management Module
window.addEventListener("DOMContentLoaded", async () => {
    try {
        await Database.initDB();
        await Database.seedTestData();
        loadUsers();
    } catch (error) {
        console.error("Error initializing user management:", error);
    }
});

async function loadUsers() {
    try {
        const users = await Database.getAllUsers();

        const tbody = document.getElementById("userTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center; padding:20px;">
                        No users found.
                    </td>
                </tr>
            `;
            return;
        }

        users.forEach(user => {
            tbody.innerHTML += `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>${user.status}</td>
                    <td class="actions">
                        <button onclick="editUser(${user.id})">✏</button>
                        <button onclick="deleteUser(${user.id})">🗑</button>
                        <button onclick="viewUser(${user.id})">👁</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading users:", error);
    }
}

window.editUser = function(id) {
    window.location.href = "edit-user.html?id=" + id;
};

window.deleteUser = async function(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
        await Database.deleteUser(id);
        alert("User deleted successfully!");
        loadUsers();
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user");
    }
};

window.viewUser = function(id) {
    window.location.href = "view-user.html?id=" + id;
};

window.addUser = function() {
    window.location.href = "add-user.html";
};

