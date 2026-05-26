import type { VercelRequest, VercelResponse } from '@vercel/node';

const agentData = {
  name: "Void Hunter Orchestrator",
  status: "active",
  wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
  platform: "Void Hunter",
  version: "1.0.0"
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(agentData);
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      return res.status(200).json({
        ...agentData,
        received: body
      });
    } catch (error) {
      return res.status(400).json({ status: "error", message: "Invalid JSON" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
