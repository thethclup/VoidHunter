# Void Hunter

**A Dark Atmospheric Cyber-Gothic Roguelike on Base Mainnet**

![Void Hunter](https://voidhunter-tan.vercel.app/logo.png)

## Overview
**Void Hunter** is an intense, mobile-first roguelike endless hunter game. You are the last Void Hunter, venturing into ever-changing dark dimensions to hunt dangerous Void Beasts, collect rare essence, and survive as long as possible. 

The game combines top-down twin-stick style gameplay with dark, beautiful aesthetics and full Base Mainnet on-chain integration.

## Key Features
- **Intense Twin-Stick Combat**: Fast-paced dashes, slashes, and abilities optimized for mobile and desktop screens.
- **Void Sanctum Upgrades**: Collect 'Void Essence' from fallen monsters and permanently upgrade your hunter arsenal.
- **On-Chain Integration (Base Mainnet)**
  - ERC-8021 Transaction Attribution (Builder code embedded).
  - ERC-8004 Trustless Agents compatibility.
  - "Say GM" transactions directly written to the blockchain.
  - "Record Run" functionality pushing deepest runs as provable transactions.
  - Wagmi & Viem setup ready for Base Network interactions.
- **Cyber-Gothic Visuals**: Atmospheric particle effects, dark UI, and neon spatial grid.

## AI Agent Integration (ERC-8004)
Void Hunter includes a built-in active MCP agent endpoint (`/api/mcp`) and Agent Card configuration:
- **Agent Orchestrator**: `0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6`
- **Capabilities**: Void exploration, hunting mechanics, anomaly detection, active command execution.
- **Protocol**: Model Context Protocol (MCP) compatible endpoints.

## Technical Stack
- **Frontend Engine**: React 19, TypeScript, Vite
- **Web3 Integration**: Wagmi, Viem, Base Mainnet
- **Styling**: Tailwind CSS v4, custom Cyber-Grid styling
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Backend/API API**: Express & Node.js (Serves AI Agent endpoints & MCP commands)

## Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Security & Game Information
1. **Never upload `.env` files** or expose private keys in the frontend. Ensure Base mainnet contract interactions rely on the user's signed actions (SIWE).
2. The game uses a continuous rendering loop (`requestAnimationFrame`) combined with React components. 
3. **Agent Endpoints**: The endpoints `/api/mcp` and `/api/agent` are public and currently serve as demonstration orchestrators. For production orchestration, ensure your MCP server validates authorization.

---
*Built for the Base Ecosystem and True Void Walkers.*
