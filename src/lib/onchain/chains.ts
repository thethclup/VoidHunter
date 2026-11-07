import { defineChain } from 'viem';
import { base as viemBase, baseSepolia as viemBaseSepolia } from 'viem/chains';

/**
 * Base Mainnet with Denim 200ms Native Blocks
 * Activated: November 5, 2026 at 18:00 UTC
 * Chain ID: 8453
 */
export const base = {
  ...viemBase,
  name: 'Base Mainnet',
};

/**
 * Base Sepolia Testnet with Denim 200ms Native Blocks
 * Activated: October 21, 2026 at 18:00 UTC
 * Chain ID: 84532
 */
export const baseSepolia = {
  ...viemBaseSepolia,
  name: 'Base Sepolia',
};

/**
 * Base Vibenet: The experimental developer testbed for Base Denim 200ms Native Blocks.
 * Chain ID: 84538453
 * RPC: https://rpc.vibes.base.org
 */
export const baseVibenet = defineChain({
  id: 84538453,
  name: 'Base Vibenet (200ms)',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.vibes.base.org'],
      webSocket: ['wss://rpc.vibes.base.org/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Base Vibenet Hub', url: 'https://chain.base.org/vibenet' },
  },
  testnet: true,
});

export const supportedChains = [base, baseSepolia, baseVibenet] as const;

export { viemBase, viemBaseSepolia };
