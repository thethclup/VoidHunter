import type { VercelRequest, VercelResponse } from '@vercel/node';

const mcpData = {
  protocol: "MCP",
  version: "1.0.0",
  name: "Void Hunter Orchestrator",
  status: "active",
  description: "Active MCP server for Void Hunter Orchestrator Agent",
  tools: [
    {
      name: "get_race_status",
      description: "Gets the current status of the warp race.",
      inputSchema: { type: "object", properties: { raceId: { type: "string" } }, required: ["raceId"] }
    },
    {
      name: "start_race",
      description: "Starts a new warp race session.",
      inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
    },
    {
      name: "get_leaderboard",
      description: "Retrieves the leaderboard for the current race or season.",
      inputSchema: { type: "object", properties: { limit: { type: "number" } }, required: ["limit"] }
    },
    {
      name: "optimize_speed",
      description: "Applies real-time speed optimization to the current engine output.",
      inputSchema: { type: "object", properties: { intensity: { type: "number" } }, required: ["intensity"] }
    },
    {
      name: "get_track_info",
      description: "Retrieves metadata and hazards for a given track.",
      inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
    }
  ],
  prompts: [
    { name: "hunt_beast", description: "Request a hunting strategy." }
  ],
  resources: [
    { uri: "void://dimension/current", name: "Current Dimension Data", description: "Environmental data for the current void depth." }
  ],
  capabilities: ["void-exploration", "hunting-mechanics", "anomaly-detection", "mcp-command-execution"]
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ...mcpData, timestamp: new Date().toISOString() });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const action = body.action || body.command || body.method;

      let result: any = {};

      if (action === "tools/list") {
        return res.status(200).json({ jsonrpc: "2.0", id: body.id || 1, result: { tools: mcpData.tools } });
      }
      if (action === "tools/call") {
        return res.status(200).json({ jsonrpc: "2.0", id: body.id || 1, result: { content: [{ type: "text", text: `Tool ${body.params?.name} executed successfully.` }] } });
      }
      if (action === "prompts/list") {
        return res.status(200).json({ jsonrpc: "2.0", id: body.id || 1, result: { prompts: mcpData.prompts } });
      }
      if (action === "resources/list") {
        return res.status(200).json({ jsonrpc: "2.0", id: body.id || 1, result: { resources: mcpData.resources } });
      }

      switch (action) {
        case "status":
        case "ping":
          result = { status: "online", agent: mcpData.name, message: "Void radar active - Ready to hunt" };
          break;
        case "execute":
          result = { success: true, action: body.command || body.params, executedAt: new Date().toISOString(), message: "Void hunting command executed" };
          break;
        case "get_info":
          result = { name: mcpData.name, platform: "Base", version: mcpData.version };
          break;
        default:
          result = { success: true, message: "Command received", data: body };
      }

      return res.status(200).json({
        status: "success",
        agent: mcpData.name,
        response: result,
        receivedAt: new Date().toISOString(),
        ...mcpData
      });

    } catch (error) {
      return res.status(400).json({ status: "error", message: "Failed to process MCP command" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
