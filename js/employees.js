window.addEventListener("DOMContentLoaded", async () => {
    try {
        await Database.initDB();
        await Database.seedTestData();
        loadEmployees();
    } catch (error) {
        console.error("Error initializing:", error);
    }

    // Filter button toggle
    const filterBtn = document.getElementById("filterBtn");
    const filterDropdown = document.getElementById("filterDropdown");

    if (filterBtn && filterDropdown) {
        filterBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            filterDropdown.style.display = 
                filterDropdown.style.display === "block" ? "none" : "block";
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!filterBtn.contains(e.target) && !filterDropdown.contains(e.target)) {
                filterDropdown.style.display = "none";
            }
        });
    }
});

function loadEmployees() {
    Database.getAllEmployees()
        .then(employees => {
            const tbody = document.getElementById("employeeBody");
            if (!tbody) return;
            
            tbody.innerHTML = "";

            if (employees.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align:center; padding:20px;">
                            No employees found. Click "Add Employee" to create one.
                        </td>
                    </tr>
                `;
                return;
            }

            employees.forEach(emp => {
                const row = `
                    <tr>
                        <td>#${emp.id}</td>
                        <td>${emp.full_name}</td>
                        <td>${emp.position}</td>
                        <td>${emp.employment_type}</td>
                        <td>₱${parseFloat(emp.base_salary).toLocaleString()}</td>
                        <td>${emp.status}</td>
                        <td class="actions">
                            <button onclick="editEmployee(${emp.id})">✏</button>
                            <button onclick="viewEmployee(${emp.id})">👁</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error("Error loading employees:", error);
        });
}

window.editEmployee = function(id) {
    window.location.href = "edit-employee.html?id=" + id;
};

window.viewEmployee = function(id) {
    window.location.href = "view-employee.html?id=" + id;
};

window.deleteEmployeeRecord = async function(id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
        await Database.deleteEmployee(id);
        alert("Employee deleted successfully!");
        loadEmployees();
    } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Error deleting employee");
    }
};

// Filter function
window.filterType = function(type) {
    Database.getAllEmployees()
        .then(employees => {
            const filtered = type === 'All' 
                ? employees 
                : employees.filter(emp => emp.employment_type === type);
            
            const tbody = document.getElementById("employeeBody");
            tbody.innerHTML = "";

            filtered.forEach(emp => {
                const row = `
                    <tr>
                        <td>#${emp.id}</td>
                        <td>${emp.full_name}</td>
                        <td>${emp.position}</td>
                        <td>${emp.employment_type}</td>
                        <td>₱${parseFloat(emp.base_salary).toLocaleString()}</td>
                        <td>${emp.status}</td>
                        <td class="actions">
                            <button onclick="editEmployee(${emp.id})">✏</button>
                            <button onclick="viewEmployee(${emp.id})">👁</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        });
};

