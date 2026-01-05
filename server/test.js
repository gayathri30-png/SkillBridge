// test.js - Minimal Express Test
import express from "express";
const app = express();
const PORT = 6001; // Using a DIFFERENT port to avoid any conflicts

app.get("/", (req, res) => {
  res.send("CANARY TEST SUCCESS");
});

app.listen(PORT, "0.0.0.0", () => {
  // Explicitly bind to all interfaces
  console.log(`🟢 CANARY SERVER LISTENING on http://localhost:${PORT}`);
});
