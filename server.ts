import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON body parser for POST requests (needed for MCP)
  app.use(express.json());

  // ==========================================
  // ERC-8004 AI Agent API Endpoints
  // ==========================================
  
  // 1. Agent Status API Endpoint
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Void Hunter Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Void Hunter",
      version: "1.0.0"
    });
  });

  // 2. MCP API Endpoint
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Void Hunter MCP Endpoint",
      status: "active",
      description: "Active MCP server for Void Hunter Orchestrator Agent",
      capabilities: ["void-exploration", "hunting-mechanics", "anomaly-detection"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const { action, command, params } = req.body;
      let result: any = {};

      switch (action || command) {
        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Void Hunter Orchestrator",
            message: "Void radar active - Ready to hunt" 
          };
          break;

        case "execute":
          result = {
            success: true,
            action: command || params,
            executedAt: new Date().toISOString(),
            message: "Void hunting command executed"
          };
          break;

        case "get_info":
          result = {
            name: "Void Hunter Orchestrator",
            wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            platform: "Base",
            version: "1.0.0"
          };
          break;

        default:
          result = {
            success: true,
            message: "Command received",
            data: req.body
          };
      }

      res.json({
        status: "success",
        agent: "Void Hunter Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process MCP command"
      });
    }
  });

  // ==========================================
  // Vite integration and catch-all
  // ==========================================

  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
