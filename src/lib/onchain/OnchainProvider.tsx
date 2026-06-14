import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Attribution } from 'ox/erc8021';

export const DATA_SUFFIX = Attribution.toDataSuffix({ codes: ["bc_6qw3gmv5"] });

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  // @ts-ignore - Injecting globally as requested
  dataSuffix: DATA_SUFFIX,
});

const queryClient = new QueryClient();

export function OnchainProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
