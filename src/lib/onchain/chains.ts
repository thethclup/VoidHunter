import { defineChain } from 'viem';
import { base, baseSepolia } from 'viem/chains';

/**
 * Base Vibenet: The official experimental developer testbed for Base Denim 200ms Native Blocks.
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

export { base, baseSepolia };
