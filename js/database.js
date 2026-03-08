// database.js - Only for initial superadmin/admin credentials
const DB_NAME = "PayrollDB";
const DB_VERSION = 1;

// INITIAL CREDENTIALS ONLY - these are the only ones stored locally
const INITIAL_USERS = [
    { id: 1, username: "superadmin", password: "superadmin123", role: "superadmin", status: "Active" },
    { id: 2, username: "admin", password: "admin123", role: "admin", status: "Active" }
];

// Initialize database with only these two users
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains("users")) {
                const store = db.createObjectStore("users", { keyPath: "id" });
                store.createIndex("username", "username", { unique: true });
                
                // Add initial superadmin and admin only
                INITIAL_USERS.forEach(user => store.add(user));
            }
        };
    });
}

// Get user by username/password (only for initial login)
function validateUser(username, password) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["users"], "readonly");
            const store = transaction.objectStore("users");
            const index = store.index("username");
            const getRequest = index.get(username);

            getRequest.onsuccess = () => {
                const user = getRequest.result;
                if (user && user.password === password) {
                    resolve(user);
                } else {
                    resolve(null);
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

// Export only what's needed
window.Database = {
    initDB,
    validateUser
};
