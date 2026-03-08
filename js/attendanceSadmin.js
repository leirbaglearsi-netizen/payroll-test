console.log("ATTENDANCE JS LOADED");

window.addEventListener("DOMContentLoaded", async () => {
    try {
        await Database.initDB();
        await Database.seedTestData();
        loadAttendance();
    } catch (error) {
        console.error("Error initializing:", error);
    }
});

async function loadAttendance() {
    try {
        const attendance = await Database.getAllAttendance();
        const employees = await Database.getAllEmployees();

        const tbody = document.getElementById("attTbody");
        if (!tbody) return;
        
        tbody.innerHTML = "";

        // Get all employees
        const allEmployees = employees;

        if (allEmployees.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; padding:20px;">
                        No employees found.
                    </td>
                </tr>
            `;
            return;
        }

        // Show all employees in the table
        allEmployees.forEach(employee => {
            // Find attendance record for this employee (using strict equality)
            const empAttendance = attendance.find(a => Number(a.employee_id) === Number(employee.id));
            
            const hoursAttended = empAttendance ? (empAttendance.hours_attended || 0) : 0;
            const otHours = empAttendance ? (empAttendance.ot_hours || 0) : 0;
            const payrollPeriod = empAttendance ? empAttendance.payroll_period : "-";
            const attendanceId = empAttendance ? empAttendance.id : 0;

            tbody.innerHTML += `
                <tr>
                    <td class="name">${employee.full_name}</td>
                    <td>${hoursAttended}</td>
                    <td>${otHours}</td>
                    <td class="period">
                        <span>${payrollPeriod}</span>
                        ${empAttendance ? `<span class="cal" onclick="viewAttendance(${attendanceId})" style="cursor:pointer;">📅</span>` : ''}
                    </td>
                    <td>
                        <div class="action-icons">
                            <button class="icon-btn add-row-btn" onclick="addAttendanceForEmployee(${employee.id})" title="Add Attendance">➕</button>
                            ${empAttendance ? `
                            <button class="icon-btn" onclick="deleteAttendanceRecord(${attendanceId})">🗑</button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Attendance load error:", err);
    }
}

window.editAttendance = function(id) {
    window.location.href = `edit-attendanceSadmin.html?id=${id}`;
};

window.viewAttendance = function(id) {
    window.location.href = `view-attendanceSadmin.html?id=${id}`;
};

window.deleteAttendanceRecord = async function(id) {
    if (!confirm("Are you sure you want to delete this attendance record?")) return;

    try {
        await Database.deleteAttendance(id);
        alert("Attendance record deleted successfully!");
        loadAttendance();
    } catch (error) {
        console.error("Error deleting attendance:", error);
        alert("Error deleting attendance record");
    }
};

// Search function - searches through all employees
window.searchAttendance = function(query) {
    query = query.toLowerCase();
    Database.getAllEmployees()
        .then(employees => {
            Database.getAllAttendance()
                .then(attendance => {
                    const filtered = employees.filter(emp => {
                        const name = emp.full_name.toLowerCase();
                        return name.includes(query);
                    });
                    
                    const tbody = document.getElementById("attTbody");
                    tbody.innerHTML = "";
                    
                    filtered.forEach(employee => {
                        const empAttendance = attendance.find(a => Number(a.employee_id) === Number(employee.id));
                        
                        const hoursAttended = empAttendance ? (empAttendance.hours_attended || 0) : 0;
                        const otHours = empAttendance ? (empAttendance.ot_hours || 0) : 0;
                        const payrollPeriod = empAttendance ? empAttendance.payroll_period : "-";
                        const attendanceId = empAttendance ? empAttendance.id : 0;
                        
                        tbody.innerHTML += `
                            <tr>
                                <td class="name">${employee.full_name}</td>
                                <td>${hoursAttended}</td>
                                <td>${otHours}</td>
                                <td class="period">
                                    <span>${payrollPeriod}</span>
                                    ${empAttendance ? `<span class="cal" onclick="viewAttendance(${attendanceId})" style="cursor:pointer;">📅</span>` : ''}
                                </td>
                                <td>
                                    <div class="action-icons">
                                        <button class="icon-btn add-row-btn" onclick="addAttendanceForEmployee(${employee.id})" title="Add Attendance">➕</button>
                                        ${empAttendance ? `
                                        <button class="icon-btn" onclick="deleteAttendanceRecord(${attendanceId})">🗑</button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `;
                    });
                });
        });
};

// Setup search input event listener
window.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchAttendance(e.target.value);
        });
    }
});

// Add attendance for a specific employee
window.addAttendanceForEmployee = function(employeeId) {
    window.location.href = `add-attendanceSadmin.html?employee_id=${employeeId}`;
};

