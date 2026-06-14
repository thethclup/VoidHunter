# Void Hunter

**A Dark Atmospheric Cyber-Gothic Roguelike on Base Mainnet**

## Overview
**Void Hunter Orchestrator** is an intense, high-performance onchain AI Agent platform. Navigating ever-changing dark dimensions, the Orchestrator hunts dangerous Void Beasts and gathers powerful Void Essence to expand its arsenal. Equipped with sophisticated void exploration, hunting mechanics, and real-time anomaly detection, this platform fuses competitive mechanics, real-time automation, and ecosystem coordination on Base.

## Key Capabilities & Features

### 1. Advanced Onchain Integration
- **Base Mainnet Operations**: Powered by the Base network infrastructure.
- **Onchain Run Preservation**: Engrave legendary operations natively.
- **ERC-8021 Compatible**: Real-time verifiable transaction attribution embedding builder codes seamlessly into payloads.

### 2. Trustless Agents (ERC-8004/MCP)
- **Base MCP Connection**: Allows AI agents handling the workspace (e.g. Cursor, Claude Code) to natively operate using Base Account wallets via `.cursor/mcp.json` (`https://mcp.base.org`).
- **Model Context Protocol (MCP)**: Our active server handles high-throughput commands with standard API routing.
- Real-time synergy built for Next Generation Multi-Track management and ecosystem coordination.

### 3. Agent Skills & Capabilities
- **Void Exploration**: Real-time navigation and procedural anomaly detection.
- **Hunting Mechanics**: Real-time combat optimization and beast tracking.
- **Ecosystem Coordination**: Cross-agent synergy and multi-run orchestration.

## Integration & MCP Connection Guide

### Connecting via Model Context Protocol
The Agent supports external interfacing via the standard MCP API.
- **Protocol**: MCP (ver 1.0.0)
- **Agent Endpoint**: `[APP_URL]/api/mcp`
- **Identity Card**: `[APP_URL]/.well-known/agent-card.json`

To interact with the agent natively, submit POST requests compliant with the `tools/call` and `prompts/list` standard formats:

```bash
# Example Request to MCP
curl -X POST https://[YOUR_DOMAIN]/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"action": "tools/list"}'
```

Available Core Tools:
- `get_race_status`
- `start_race`
- `get_leaderboard`
- `optimize_speed`
- `get_track_info`

## Local Development

The project is built on modern React, Node.js and Next.js 14 App Router API methodologies.

```bash
# Install Node Packages
npm install

# Start Local Environment
npm run dev

# Build for Production Edge Environments
npm run build
```

---
*Built for the Base Ecosystem.*
