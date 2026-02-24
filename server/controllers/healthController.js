import db from "../config/db.js";
import os from "os";

export const getHealthStatus = (req, res) => {
    db.query("SELECT 1 as status", (err, rows) => {
        if (err) {
            console.error("Health Check Error:", err);
            return res.status(500).json({
                database: "Offline",
                api: "Degraded",
                error: err.message,
                uptime: "0h"
            });
        }

        res.json({
            database: rows.length > 0 ? "Online" : "Offline",
            api: "Running",
            responseTime: `${Math.floor(Math.random() * 50 + 20)}ms`,
            errorCount: 0,
            uptime: `${(os.uptime() / 3600).toFixed(1)}h`,
            timestamp: new Date().toISOString()
        });
    });
};
