// js/login.js
// Initialize Firebase with config from window.ENV
firebase.initializeApp({
  apiKey: window.ENV.FIREBASE_API_KEY,
  authDomain: window.ENV.FIREBASE_AUTH_DOMAIN,
  projectId: window.ENV.FIREBASE_PROJECT_ID,
  storageBucket: window.ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window.ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: window.ENV.FIREBASE_APP_ID
});

const auth = firebase.auth();

// PASSWORD TOGGLE
const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");

if (togglePassword && passwordField) {
    togglePassword.addEventListener("click", () => {
        const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
        passwordField.setAttribute("type", type);
    });
}

// LOGIN FORM
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            // Use Firebase Authentication
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Get ID token to check custom claims (for roles)
            const idTokenResult = await user.getIdTokenResult();
            const role = idTokenResult.claims.role || 'employee';
            
            // Store user info
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify({ 
                email: user.email,
                role: role,
                uid: user.uid
            }));

            // Redirect based on role
            if (role === 'superadmin') {
                window.location.href = "dashboardSadmin.html";
            } else if (role === 'admin') {
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "employee-dashboard.html"; // You'll need to create this
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Invalid email or password");
        }
    });
}
