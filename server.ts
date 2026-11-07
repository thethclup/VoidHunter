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
  
  const mcpData = {
    protocol: "MCP",
    version: "1.0.0",
    name: "Void Hunter MCP Endpoint",
    status: "active",
    description: "Active MCP server for Void Hunter Orchestrator Agent (Base Denim 200ms Ready)",
    network: {
      upgrade: "Denim",
      cadence: "200ms",
      mainnetStatus: "LIVE",
      mainnetActivatedAt: "2026-11-05T18:00:00Z",
      flashblocksMigrated: true,
      pendingTagDeprecated: true,
      supportedChains: [8453, 84532, 84538453]
    },
    tools: [
      { name: "scan_void", description: "Scans the void dimension for anomalies.", inputSchema: { type: "object", properties: { targetDepth: { type: "number" } }, required: ["targetDepth"] } },
      { name: "extract_essence", description: "Extracts volatile essence.", inputSchema: { type: "object", properties: { targetId: { type: "string" } }, required: ["targetId"] } },
      { name: "check_denim_migration", description: "Audits RPC integration for Base Denim compliance (verifies 200ms canonical blocks and zero pending tags).", inputSchema: { type: "object", properties: {} } }
    ],
    prompts: [ { name: "hunt_beast", description: "Request a hunting strategy." } ],
    resources: [ 
      { uri: "void://dimension/current", name: "Current Dimension Data", description: "Environmental data for the current void depth." },
      { uri: "base://upgrade/denim", name: "Denim 200ms Network Spec", description: "Canonical 200ms block production specification without Flashblocks." }
    ],
    capabilities: ["void-exploration", "hunting-mechanics", "anomaly-detection", "base-denim-200ms", "canonical-blocks-only"]
  };

  // 1. Agent Status API Endpoint
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Void Hunter Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Void Hunter",
      version: "1.0.0",
      upgrade: "Denim",
      cadence: "200ms",
      flashblocks: "deprecated",
      canonicalState: true
    });
  });

  // 2. MCP API Endpoint
  app.get("/api/mcp", (req, res) => {
    res.json({ ...mcpData, timestamp: new Date().toISOString() });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body || {};
      const action = body.action || body.command || body.method; // Check JSON-RPC 2.0 method
      let result: any = {};

      if (action === "tools/list") {
        return res.status(200).json({ jsonrpc: "2.0", id: body.id || 1, result: { tools: mcpData.tools } });
      }
      
      if (action === "prompts/list") {
        return res.status(200).json({ jsonrpc: "2.0", id: body.id || 1, result: { prompts: mcpData.prompts } });
      }

      switch (action) {
        case "status":
        case "ping":
          result = { status: "online", agent: "Void Hunter Orchestrator", message: "Void radar active - Ready to hunt" };
          break;
        case "execute":
          result = { success: true, action: body.command || body.params, executedAt: new Date().toISOString(), message: "Void hunting command executed" };
          break;
        case "get_info":
          result = { name: "Void Hunter Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
          break;
        default:
          result = { success: true, message: "Command received", data: req.body };
      }

      res.json({
        status: "success",
        agent: "Void Hunter Orchestrator",
        response: result,
        receivedAt: new Date().toISOString(),
        ...mcpData // Attach standard objects for generic REST parsers
      });
    } catch (error) {
      res.status(400).json({ status: "error", message: "Failed to process MCP command" });
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
