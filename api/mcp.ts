export default function handler(req: any, res: any) {
  const mcpData = {
    protocol: "MCP",
    version: "1.0.0",
    name: "Void Hunter MCP Endpoint",
    status: "active",
    description: "Active MCP server for Void Hunter Orchestrator Agent",
    tools: [
      {
        name: "scan_void",
        description: "Scans the void dimension for anomalies.",
        inputSchema: {
          type: "object",
          properties: {
            targetDepth: { type: "number" }
          },
          required: ["targetDepth"]
        }
      },
      {
        name: "extract_essence",
        description: "Extracts volatile essence.",
        inputSchema: {
          type: "object",
          properties: {
            targetId: { type: "string" }
          },
          required: ["targetId"]
        }
      }
    ],
    prompts: [
      {
        name: "hunt_beast",
        description: "Request a hunting strategy."
      }
    ],
    resources: [
      {
        uri: "void://dimension/current",
        name: "Current Dimension Data",
        description: "Environmental data for the current void depth."
      }
    ],
    capabilities: ["void-exploration", "hunting-mechanics", "anomaly-detection"],
    timestamp: new Date().toISOString()
  };

  if (req.method === 'GET') {
    return res.status(200).json(mcpData);
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const action = body.action || body.command || body.method; // checking method for JSON-RPC 2.0
      
      let result: any = {};

      if (action === "tools/list") {
        return res.status(200).json({
          jsonrpc: "2.0",
          id: body.id || 1,
          result: { tools: mcpData.tools }
        });
      }

      if (action === "prompts/list") {
        return res.status(200).json({
          jsonrpc: "2.0",
          id: body.id || 1,
          result: { prompts: mcpData.prompts }
        });
      }

      switch (action) {
        case "status":
        case "ping":
          result = { status: "online", message: "Void radar active - Ready to hunt" };
          break;
        case "execute":
          result = { success: true, message: "Void hunting command executed" };
          break;
        case "get_info":
          result = { name: "Void Hunter Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
          break;
        default:
          result = { success: true, message: "Command received", data: body };
      }

      res.status(200).json({
        status: "success",
        agent: "Void Hunter Orchestrator",
        response: result,
        receivedAt: new Date().toISOString(),
        ...mcpData // Also return MCP config for plain REST parsers
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process MCP command"
      });
    }
  }
}
