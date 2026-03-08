// js/add-user.js

// Check if user is superadmin
window.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'superadmin') {
        alert('Access denied. Superadmin only.');
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Initialize dropdowns
    setupDropdowns();
});

function setupDropdowns() {
    // Role dropdown
    const roleInput = document.getElementById("role");
    const roleMenu = document.getElementById("roleDropdownMenu");

    if (roleInput && roleMenu) {
        roleInput.addEventListener("click", () => {
            roleMenu.style.display = roleMenu.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", (e) => {
            if (!roleInput.contains(e.target) && !roleMenu.contains(e.target)) {
                roleMenu.style.display = "none";
            }
        });
    }

    // Status dropdown
    const statusInput = document.getElementById("status");
    const statusMenu = document.getElementById("statusDropdownMenu");

    if (statusInput && statusMenu) {
        statusInput.addEventListener("click", () => {
            statusMenu.style.display = statusMenu.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", (e) => {
            if (!statusInput.contains(e.target) && !statusMenu.contains(e.target)) {
                statusMenu.style.display = "none";
            }
        });
    }
}

// Select role function
window.selectRole = function(role) {
    document.getElementById("role").value = role;
    document.getElementById("roleDropdownMenu").style.display = "none";
    
    // Show/hide employee fields based on role
    const employeeFields = document.getElementById("employeeFields");
    if (role === 'employee') {
        employeeFields.style.display = 'block';
    } else {
        employeeFields.style.display = 'none';
    }
};

// Select status function
window.selectStatus = function(status) {
    document.getElementById("status").value = status;
    document.getElementById("statusDropdownMenu").style.display = "none";
};

// Handle form submission
document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim() || email;
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;
    const status = document.getElementById("status").value;

    // Validation
    if (!email || !password || !role || !status) {
        alert("Please fill in all required fields");
        return;
    }

    try {
        // STEP 5: Create user in Firebase
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        // Store user data in Firestore
        await db.collection('users').doc(uid).set({
            uid: uid,
            email: email,
            username: username,
            role: role,
            status: status,
            createdBy: JSON.parse(localStorage.getItem('user')).username,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // If role is employee, also create employee record
        if (role === 'employee') {
            const fullName = document.getElementById("fullName").value;
            const position = document.getElementById("position").value;
            const salary = document.getElementById("salary").value;
            const employmentType = document.getElementById("employmentType").value;

            if (!fullName || !position || !salary || !employmentType) {
                alert("Please fill in all employee details");
                return;
            }

            await db.collection('employees').add({
                firebaseUid: uid,
                full_name: fullName,
                position: position,
                base_salary: parseFloat(salary),
                employment_type: employmentType,
                email: email,
                status: 'Active',
                createdBy: JSON.parse(localStorage.getItem('user')).username,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        alert("User created successfully in Firebase!");
        window.location.href = "user-mgmt.html";

    } catch (error) {
        console.error("Error creating user:", error);
        alert("Error: " + error.message);
    }
});

// Go back function
window.goBack = function() {
    window.location.href = "user-mgmt.html";
};
