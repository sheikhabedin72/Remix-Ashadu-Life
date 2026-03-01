import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database for Admin View
  const users = [
    { firstName: 'Jamal', lastName: 'Doe', email: 'jamal@example.com', role: 'servant', tier: 'ABID', isFrozen: false, lastActive: '2026-02-26 16:45', totalZikr: 1250 },
    { firstName: 'Sara', lastName: 'Ahmed', email: 'sara@example.com', role: 'admin', tier: 'MUHSIN', isFrozen: false, lastActive: '2026-02-26 17:05', totalZikr: 5400 },
    { firstName: 'Omar', lastName: 'Farooq', email: 'omar@example.com', role: 'servant', tier: 'ABID', isFrozen: true, lastActive: '2026-02-25 12:00', totalZikr: 300 },
    { firstName: 'Amina', lastName: 'Z.', email: 'amina@ashadu.com', role: 'developer', tier: 'MUHSIN', isFrozen: false, lastActive: '2026-02-26 17:10', totalZikr: 8900 },
  ];

  const systemLogs = [
    { id: '1', timestamp: new Date().toISOString(), type: 'INFO', message: 'Admin session initialized for amina@ashadu.com' },
    { id: '2', timestamp: new Date().toISOString(), type: 'SUCCESS', message: 'Global Zikr sync completed for 1,420 users' },
  ];

  // --- ADMIN API ROUTES ---

  // Get all users
  app.get("/api/admin/users", (req, res) => {
    res.json(users);
  });

  // Control user status (Freeze/Unfreeze)
  app.post("/api/admin/users/:email/status", (req, res) => {
    const { email } = req.params;
    const { isFrozen } = req.body;
    
    const user = users.find(u => u.email === email);
    if (user) {
      user.isFrozen = isFrozen;
      systemLogs.unshift({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'WARNING',
        message: `User ${email} status changed to ${isFrozen ? 'FROZEN' : 'ACTIVE'} by Admin.`
      });
      res.json({ success: true, user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Change user role
  app.post("/api/admin/users/:email/role", (req, res) => {
    const { email } = req.params;
    const { role } = req.body;
    
    const user = users.find(u => u.email === email);
    if (user) {
      user.role = role;
      systemLogs.unshift({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'INFO',
        message: `User ${email} role updated to ${role} by Admin.`
      });
      res.json({ success: true, user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Get system logs
  app.get("/api/admin/logs", (req, res) => {
    res.json(systemLogs);
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ASHADU SERVER: Running on http://localhost:${PORT}`);
  });
}

startServer();
