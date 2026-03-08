// login.js - Uses both local DB (for initial) and Firebase (for all users)

// Initialize Firebase (you'll need to add your config)
const firebaseConfig = {
    apiKey: "AIzaSyBOnaZ7LJL-5_DeK1NAN38IPEzgNqxRoIA",
    authDomain: "payroll-system-test-138a4.firebaseapp.com",
    projectId: "payroll-system-test-138a4"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// PASSWORD TOGGLE (your existing code)
const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");
if (togglePassword && passwordField) {
    togglePassword.addEventListener("click", () => {
        const type = passwordField.type === "password" ? "text" : "password";
        passwordField.type = type;
    });
}

// LOGIN FORM
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("Please enter username and password");
            return;
        }

        try {
            // First, try local database (for superadmin/admin)
            await Database.initDB();
            const localUser = await Database.validateUser(username, password);
            
            if (localUser) {
                // This is superadmin or admin from local DB
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("user", JSON.stringify({
                    username: localUser.username,
                    role: localUser.role,
                    id: localUser.id,
                    source: "local"
                }));

                // Redirect based on role
                if (localUser.role === 'superadmin') {
                    window.location.href = "dashboardSadmin.html";
                } else {
                    window.location.href = "dashboard.html";
                }
                return;
            }

            // If not found locally, try Firebase (for employees)
            try {
                // Sign in with Firebase
                const userCredential = await auth.signInWithEmailAndPassword(username, password);
                const firebaseUser = userCredential.user;
                
                // Get user role from Firestore
                const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
                const userData = userDoc.data();
                
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("user", JSON.stringify({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    role: userData?.role || 'employee',
                    source: "firebase"
                }));

                // Redirect employees to view-only dashboard
                window.location.href = "employee-dashboard.html";
                
            } catch (firebaseError) {
                alert("Invalid username or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        }
    });
}
