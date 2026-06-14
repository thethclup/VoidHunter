import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { cn } from '../../lib/utils';
import { LogOut, Wallet } from 'lucide-react';

export function ConnectWallet({ className }: { className?: string }) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 glass-panel text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors",
          className
        )}
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="stat-value">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
        <LogOut className="w-3 h-3 ml-2 opacity-50" />
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all",
        className
      )}
    >
      <Wallet className="w-3 h-3" />
      Connect Base
    </button>
  );
}
