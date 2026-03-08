// Payroll Module
window.addEventListener("DOMContentLoaded", async () => {
    try {
        await Database.initDB();
        await Database.seedTestData();
        loadPayrollData();
    } catch (error) {
        console.error("Error initializing payroll:", error);
    }
});

async function loadPayrollData() {
    try {
        const payroll = await Database.getAllPayroll();
        const employees = await Database.getAllEmployees();

        const tbody = document.querySelector(".pay-table tbody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (payroll.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center; padding:20px;">
                        No payroll records yet.
                    </td>
                </tr>
            `;
            return;
        }

        payroll.forEach(row => {
            // Find employee name
            const employee = employees.find(emp => emp.id == row.employee_id);
            const full_name = employee ? employee.full_name : "Unknown";

            tbody.innerHTML += `
                <tr>
                    <td>${full_name}</td>
                    <td class="period">${row.period} <span>📅</span></td>
                    <td>₱${parseFloat(row.gross_salary).toLocaleString()}</td>
                    <td>₱${parseFloat(row.total_deduction).toLocaleString()}</td>
                    <td>₱${parseFloat(row.net_salary).toLocaleString()}</td>
                    <td>${row.status}</td>
                    <td class="actions">
                        <button onclick="editPayroll(${row.id})">✏</button>
                        <button onclick="deletePayroll(${row.id})">🗑</button>
                        <button onclick="printPayroll(${row.id})">🖨️</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading payroll:", error);
    }
}

function editPayroll(id) {
    window.location.href = "edit-payrollSadmin.html?id=" + id;
}

function deletePayroll(id) {
    if (!confirm("Are you sure you want to delete this payroll record?")) return;
    alert("Delete payroll functionality - ID: " + id);
}

// Generate Payroll
window.generatePayroll = function() {
    alert("Generate Payroll - This will calculate payroll for all employees based on their attendance.");
};

// Generate Payslip
window.generatePayslip = function() {
    window.location.href = "payslipSadmin.html";
};

// Export
window.exportPayroll = function() {
    alert("Export functionality - Export payroll data to Excel/PDF");
};

// Print Payroll
window.printPayroll = function(id) {
    window.location.href = "payslipSadmin.html?id=" + id;
};

