# Void Hunter

**A Dark Atmospheric Cyber-Gothic Roguelike on Base Mainnet**

![Void Hunter](https://voidhunter-tan.vercel.app/logo.png)

## Overview
**Void Hunter** is an immersive and high-performance Web3 survival experience. Navigate ever-changing dark dimensions, hunt dangerous Void Beasts, and gather powerful Void Essence to expand your arsenal. Every run tests your limits. Escapism meets strategy.

## Key Architecture & Features

### 1. The Game Engine
- **Mobile-First Twin-Stick Controls**: Engineered with responsive canvas rendering perfectly tuned to tactile devices and desktops alike.
- **Procedural Generation**: Adaptive spawns and progressing difficulty as you explore further down into the Void.
- **Resource Meta-Game**: Permanent strategic upgrades through in-game essence economics.

### 2. Base Mainnet & Web3 Integration
- **Zero-Friction Authentication**: Powered by Wagmi, Viem, and Base accounts integrations.
- **On-chain Run Preservation**: Engrave your legendary hunts natively into Base via `tx.data`. 
- **ERC-8021 Compatible**: Real-time verifiable transaction attribution embedding builder codes securely into the payload.

### 3. Trustless Agents (ERC-8004/MCP)
- Fully transparent and compliant agent integration via `agent-card.json`.
- **MCP Server Capabilities**: Pre-configured with tools, prompts, and resources including Void Scanning and Volatile Essence Extraction.
- Real-time synergy built for the next generation of generative mechanics.

## Platform Deployment
The platform is fully containerized and compatible with modern edge infrastructure (e.g., Vercel). The API layer naturally maps back to robust edge functions handling both the interface and Model Context Protocol (MCP) interactions automatically.

```bash
# Install Node Packages
npm install

# Build for Production Edge Environments
npm run build
```

*(No sensitive data or private keys are required directly in the repository. All on-chain functions rely heavily on SIWE execution limits.)*
