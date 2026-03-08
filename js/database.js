/**
 * Payroll System - Local Database (IndexedDB)
 * Provides a unified interface for all data operations with test data
 */

const DB_NAME = "PayrollDB";
const DB_VERSION = 1;

// Database initialization
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error("Database open error:", request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            console.log("Database opened successfully");
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create employees store
            if (!db.objectStoreNames.contains("employees")) {
                const employeeStore = db.createObjectStore("employees", { keyPath: "id" });
                employeeStore.createIndex("full_name", "full_name", { unique: false });
                employeeStore.createIndex("email", "email", { unique: false });
            }

            // Create attendance store
            if (!db.objectStoreNames.contains("attendance")) {
                const attendanceStore = db.createObjectStore("attendance", { keyPath: "id" });
                attendanceStore.createIndex("employee_id", "employee_id", { unique: false });
                attendanceStore.createIndex("payroll_period", "payroll_period", { unique: false });
            }

            // Create payroll store
            if (!db.objectStoreNames.contains("payroll")) {
                const payrollStore = db.createObjectStore("payroll", { keyPath: "id" });
                payrollStore.createIndex("employee_id", "employee_id", { unique: false });
                payrollStore.createIndex("period", "period", { unique: false });
            }

            // Create users store
            if (!db.objectStoreNames.contains("users")) {
                const usersStore = db.createObjectStore("users", { keyPath: "id" });
                usersStore.createIndex("username", "username", { unique: true });
            }

            // Create settings store
            if (!db.objectStoreNames.contains("settings")) {
                db.createObjectStore("settings", { keyPath: "key" });
            }

            console.log("Database schema created");
        };
    });
}

// ===========================
// EMPLOYEES CRUD OPERATIONS
// ===========================

function getAllEmployees() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["employees"], "readonly");
            const store = transaction.objectStore("employees");
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = () => reject(getAllRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function getEmployeeById(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["employees"], "readonly");
            const store = transaction.objectStore("employees");
            const getRequest = store.get(id);

            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function addEmployee(employee) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["employees"], "readwrite");
            const store = transaction.objectStore("employees");
            const addRequest = store.add(employee);

            addRequest.onsuccess = () => resolve(addRequest.result);
            addRequest.onerror = () => reject(addRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function updateEmployee(employee) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["employees"], "readwrite");
            const store = transaction.objectStore("employees");
            const updateRequest = store.put(employee);

            updateRequest.onsuccess = () => resolve(updateRequest.result);
            updateRequest.onerror = () => reject(updateRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function deleteEmployeeRecord(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["employees"], "readwrite");
            const store = transaction.objectStore("employees");
            const deleteRequest = store.delete(id);

            deleteRequest.onsuccess = () => resolve(true);
            deleteRequest.onerror = () => reject(deleteRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

// ===========================
// ATTENDANCE CRUD OPERATIONS
// ===========================

function getAllAttendance() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["attendance"], "readonly");
            const store = transaction.objectStore("attendance");
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = () => reject(getAllRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function getAttendanceByEmployee(employeeId) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["attendance"], "readonly");
            const store = transaction.objectStore("attendance");
            const index = store.index("employee_id");
            const getAllRequest = index.getAll(employeeId);

            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = () => reject(getAllRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function addAttendance(attendanceRecord) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["attendance"], "readwrite");
            const store = transaction.objectStore("attendance");
            const addRequest = store.add(attendanceRecord);

            addRequest.onsuccess = () => resolve(addRequest.result);
            addRequest.onerror = () => reject(addRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function deleteAttendance(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["attendance"], "readwrite");
            const store = transaction.objectStore("attendance");
            const deleteRequest = store.delete(id);

            deleteRequest.onsuccess = () => resolve(true);
            deleteRequest.onerror = () => reject(deleteRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function getAttendanceById(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["attendance"], "readonly");
            const store = transaction.objectStore("attendance");
            const getRequest = store.get(id);

            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function updateAttendance(attendanceRecord) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["attendance"], "readwrite");
            const store = transaction.objectStore("attendance");
            const updateRequest = store.put(attendanceRecord);

            updateRequest.onsuccess = () => resolve(updateRequest.result);
            updateRequest.onerror = () => reject(updateRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

// ===========================
// PAYROLL CRUD OPERATIONS
// ===========================

function getAllPayroll() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["payroll"], "readonly");
            const store = transaction.objectStore("payroll");
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = () => reject(getAllRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function addPayroll(payrollRecord) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["payroll"], "readwrite");
            const store = transaction.objectStore("payroll");
            const addRequest = store.add(payrollRecord);

            addRequest.onsuccess = () => resolve(addRequest.result);
            addRequest.onerror = () => reject(addRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function getPayrollById(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["payroll"], "readonly");
            const store = transaction.objectStore("payroll");
            const getRequest = store.get(id);

            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function updatePayroll(payrollRecord) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["payroll"], "readwrite");
            const store = transaction.objectStore("payroll");
            const updateRequest = store.put(payrollRecord);

            updateRequest.onsuccess = () => resolve(updateRequest.result);
            updateRequest.onerror = () => reject(updateRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function deletePayroll(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["payroll"], "readwrite");
            const store = transaction.objectStore("payroll");
            const deleteRequest = store.delete(id);

            deleteRequest.onsuccess = () => resolve(true);
            deleteRequest.onerror = () => reject(deleteRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

// ===========================
// USERS CRUD OPERATIONS
// ===========================

function getAllUsers() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["users"], "readonly");
            const store = transaction.objectStore("users");
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = () => reject(getAllRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function addUser(user) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["users"], "readwrite");
            const store = transaction.objectStore("users");
            const addRequest = store.add(user);

            addRequest.onsuccess = () => resolve(addRequest.result);
            addRequest.onerror = () => reject(addRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function getUserById(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["users"], "readonly");
            const store = transaction.objectStore("users");
            const getRequest = store.get(id);

            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function updateUser(user) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["users"], "readwrite");
            const store = transaction.objectStore("users");
            const updateRequest = store.put(user);

            updateRequest.onsuccess = () => resolve(updateRequest.result);
            updateRequest.onerror = () => reject(updateRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

function deleteUser(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["users"], "readwrite");
            const store = transaction.objectStore("users");
            const deleteRequest = store.delete(id);

            deleteRequest.onsuccess = () => resolve(true);
            deleteRequest.onerror = () => reject(deleteRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

// ===========================
// TEST DATA - SEED DATABASE
// ===========================

const TEST_EMPLOYEES = [
    { id: 1001, full_name: "Ayesha Nicole M. Santos", position: "Senior Teacher", employment_type: "Regular", base_salary: 25000, email: "ayesha.santos@philtech.edu", status: "Active" },
    { id: 1002, full_name: "Juan Miguel C. Dela Cruz", position: "Mathematics Teacher", employment_type: "Regular", base_salary: 22000, email: "juan.cruz@philtech.edu", status: "Active" },
    { id: 1003, full_name: "Maria Clara R. Reyes", position: "Science Teacher", employment_type: "Regular", base_salary: 23000, email: "maria.reyes@philtech.edu", status: "Active" },
    { id: 1004, full_name: "Pedro M. Garcia", position: "English Teacher", employment_type: "Contractual", base_salary: 18000, email: "pedro.garcia@philtech.edu", status: "Active" },
    { id: 1005, full_name: "Ana Lisa B. Mendoza", position: "History Teacher", employment_type: "Regular", base_salary: 21500, email: "ana.mendoza@philtech.edu", status: "Active" },
    { id: 1006, full_name: "Carlos James T. Fernandez", position: "PE Teacher", employment_type: "Contractual", base_salary: 15000, email: "carlos.fernandez@philtech.edu", status: "Active" },
    { id: 1007, full_name: "Sofia Marie A. Lopez", position: "Art Teacher", employment_type: "Contractual", base_salary: 16000, email: "sofia.lopez@philtech.edu", status: "Active" },
    { id: 1008, full_name: "Daniel R. Villena", position: "Payroll Staff", employment_type: "Regular", base_salary: 20000, email: "daniel.villena@philtech.edu", status: "Active" }
];

const TEST_ATTENDANCE = [
    { 
        id: 1, 
        employee_id: 1001, 
        payroll_period: "June 2025", 
        hours_attended: 176, 
        ot_hours: 4,
        daily_attendance: [
            { date: "2025-06-01", time_in: "08:00", time_out: "17:00" },
            { date: "2025-06-02", time_in: "08:00", time_out: "17:00" },
            { date: "2025-06-03", time_in: "08:00", time_out: "17:00" },
            { date: "2025-06-04", time_in: "08:00", time_out: "17:00" },
            { date: "2025-06-05", time_in: "08:00", time_out: "17:00" }
        ]
    },
    { 
        id: 2, 
        employee_id: 1002, 
        payroll_period: "June 2025", 
        hours_attended: 168, 
        ot_hours: 2,
        daily_attendance: [
            { date: "2025-06-01", time_in: "08:30", time_out: "17:30" },
            { date: "2025-06-02", time_in: "08:30", time_out: "17:30" },
            { date: "2025-06-03", time_in: "08:30", time_out: "17:30" }
        ]
    },
    { 
        id: 3, 
        employee_id: 1003, 
        payroll_period: "June 2025", 
        hours_attended: 176, 
        ot_hours: 6,
        daily_attendance: []
    },
    { 
        id: 4, 
        employee_id: 1004, 
        payroll_period: "June 2025", 
        hours_attended: 160, 
        ot_hours: 0,
        daily_attendance: []
    },
    { 
        id: 5, 
        employee_id: 1005, 
        payroll_period: "June 2025", 
        hours_attended: 168, 
        ot_hours: 3,
        daily_attendance: []
    },
    { 
        id: 6, 
        employee_id: 1006, 
        payroll_period: "June 2025", 
        hours_attended: 144, 
        ot_hours: 2,
        daily_attendance: []
    },
    { 
        id: 7, 
        employee_id: 1007, 
        payroll_period: "June 2025", 
        hours_attended: 152, 
        ot_hours: 1,
        daily_attendance: []
    },
    { 
        id: 8, 
        employee_id: 1008, 
        payroll_period: "June 2025", 
        hours_attended: 176, 
        ot_hours: 4,
        daily_attendance: []
    },
    { 
        id: 9, 
        employee_id: 1001, 
        payroll_period: "May 2025", 
        hours_attended: 176, 
        ot_hours: 5,
        daily_attendance: []
    },
    { 
        id: 10, 
        employee_id: 1002, 
        payroll_period: "May 2025", 
        hours_attended: 168, 
        ot_hours: 1,
        daily_attendance: []
    }
];

const TEST_PAYROLL = [
    { id: 1, employee_id: 1001, period: "June 2025", gross_salary: 26200, total_deduction: 5240, net_salary: 20960, status: "Paid" },
    { id: 2, employee_id: 1002, period: "June 2025", gross_salary: 22400, total_deduction: 4480, net_salary: 17920, status: "Paid" },
    { id: 3, employee_id: 1003, period: "June 2025", gross_salary: 24200, total_deduction: 4840, net_salary: 19360, status: "Paid" },
    { id: 4, employee_id: 1004, period: "June 2025", gross_salary: 18000, total_deduction: 3600, net_salary: 14400, status: "Pending" },
    { id: 5, employee_id: 1005, period: "June 2025", gross_salary: 22650, total_deduction: 4530, net_salary: 18120, status: "Paid" },
    { id: 6, employee_id: 1006, period: "June 2025", gross_salary: 15000, total_deduction: 3000, net_salary: 12000, status: "Pending" },
    { id: 7, employee_id: 1007, period: "June 2025", gross_salary: 16000, total_deduction: 3200, net_salary: 12800, status: "Pending" },
    { id: 8, employee_id: 1008, period: "June 2025", gross_salary: 21000, total_deduction: 4200, net_salary: 16800, status: "Paid" }
];

const TEST_USERS = [
    { id: 1, username: "admin", password: "admin", role: "Administrator", status: "Active" },
    { id: 2, username: "payroll_staff", password: "payroll123", role: "Payroll Staff", status: "Active" },
    { id: 3, username: "teacher1", password: "teacher123", role: "Teacher", status: "Active" },
    { id: 4, username: "viewer", password: "viewer123", role: "Viewer", status: "Active" },
    { id: 5, username: "superadmin", password: "superadmin123", role: "Superadmin", status: "Active" }
];

// Function to seed test data into the database
async function seedTestData() {
    try {
        const db = await initDB();

        // Check if data already exists
        const existingEmployees = await getAllEmployees();
        if (existingEmployees.length > 0) {
            console.log("Test data already exists, skipping seed...");
            // Still ensure superadmin user exists
            await ensureSuperadminUser();
            return false;
        }

        // Seed employees
        for (const emp of TEST_EMPLOYEES) {
            await addEmployee(emp);
        }
        console.log("Employees seeded");

        // Seed attendance
        for (const att of TEST_ATTENDANCE) {
            await addAttendance(att);
        }
        console.log("Attendance seeded");

        // Seed payroll
        for (const pay of TEST_PAYROLL) {
            await addPayroll(pay);
        }
        console.log("Payroll seeded");

        // Seed users
        for (const user of TEST_USERS) {
            await addUser(user);
        }
        console.log("Users seeded");

        console.log("All test data seeded successfully!");
        return true;
    } catch (error) {
        console.error("Error seeding test data:", error);
        return false;
    }
}

// Ensure superadmin user exists in the database
async function ensureSuperadminUser() {
    try {
        const users = await getAllUsers();
        const superadminExists = users.some(u => u.username === "superadmin");
        
        if (!superadminExists) {
            await addUser({ 
                id: 5, 
                username: "superadmin", 
                password: "superadmin123", 
                role: "Superadmin", 
                status: "Active" 
            });
            console.log("Superadmin user added successfully!");
        } else {
            console.log("Superadmin user already exists");
        }
    } catch (error) {
        console.error("Error ensuring superadmin user:", error);
    }
}

// Function to clear all data (for testing)
async function clearAllData() {
    try {
        const request = indexedDB.deleteDatabase(DB_NAME);
        request.onsuccess = () => {
            console.log("Database deleted successfully");
            location.reload();
        };
        request.onerror = () => {
            console.error("Error deleting database");
        };
    } catch (error) {
        console.error("Error clearing data:", error);
    }
}

// Function to get database statistics
async function getDatabaseStats() {
    try {
        const employees = await getAllEmployees();
        const attendance = await getAllAttendance();
        const payroll = await getAllPayroll();
        const users = await getAllUsers();

        return {
            employees: employees.length,
            attendance: attendance.length,
            payroll: payroll.length,
            users: users.length
        };
    } catch (error) {
        console.error("Error getting stats:", error);
        return null;
    }
}

// Export functions for use in other modules
window.Database = {
    initDB,
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee: deleteEmployeeRecord,
    getAllAttendance,
    getAttendanceByEmployee,
    getAttendanceById,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    getAllPayroll,
    addPayroll,
    getPayrollById,
    updatePayroll,
    deletePayroll,
    getAllUsers,
    addUser,
    getUserById,
    updateUser,
    deleteUser,
    seedTestData,
    clearAllData,
    getDatabaseStats,
    ensureSuperadminUser
};

console.log("Database module loaded");

