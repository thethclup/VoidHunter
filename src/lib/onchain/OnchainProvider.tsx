import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Attribution } from 'ox/erc8021';
import { base, baseSepolia, baseVibenet, supportedChains } from './chains';

export const DATA_SUFFIX = Attribution.toDataSuffix({ codes: ["bc_6qw3gmv5"] });

/**
 * Wagmi Configuration optimized for Base Denim 200ms Native Blocks
 * No Flashblocks subscriptions, no pending tags - purely canonical 200ms heads.
 */
export const config = createConfig({
  chains: [base, baseSepolia, baseVibenet],
  transports: {
    [base.id]: http(undefined, { batch: true }),
    [baseSepolia.id]: http(undefined, { batch: true }),
    [baseVibenet.id]: http('https://rpc.vibes.base.org', { batch: true }),
  },
  // 200ms block intervals under Denim upgrade
  pollingInterval: 200,
  // @ts-ignore - Injecting globally as requested
  dataSuffix: DATA_SUFFIX,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 200ms block cadence: fast stale time to reflect canonical 200ms blocks without redundant cache staleness
      staleTime: 200,
      refetchInterval: false,
    },
  },
});

export function OnchainProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export { supportedChains };
