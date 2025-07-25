/* eslint-disable no-undef */
const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");

// ✅ Register middleware BEFORE starting server
app.use((req, res, next) => {
    console.log("📥 Request:", req.method, req.url);
    next();
});

// Start server
async function startServer() {
    try {
        console.log("🚀 server.js starting...");

        await MongoDB.connect(config.db.uri);

        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Cannot access the database", error);
        process.exit();
    }
}

startServer();
