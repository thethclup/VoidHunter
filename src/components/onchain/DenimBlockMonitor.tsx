import { useState } from 'react';
import { useDenimBlock } from '../../hooks/useDenimBlock';
import { useSwitchChain, useChainId } from 'wagmi';
import { supportedChains } from '../../lib/onchain/chains';
import { Activity, CheckCircle2, ChevronDown, Layers, Radio, Sparkles, X, Zap } from 'lucide-react';

export function DenimBlockMonitor() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    blockNumber, 
    avgBlockTimeMs, 
    blocksPerSec, 
    chainName, 
    subSecondMs 
  } = useDenimBlock();
  
  const currentChainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const formattedBlock = blockNumber ? `#${blockNumber.toString()}` : 'Connecting...';

  return (
    <>
      {/* Top Navbar Quick Pill */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 hover:border-cyan-400/60 transition-all text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.15)]"
        title="Base Denim 200ms Native Blocks Engine"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>

        <span className="font-bold tracking-wider text-cyan-300 flex items-center gap-1 font-['Cinzel']">
          DENIM <span className="text-[10px] text-cyan-400/80 font-mono">200ms</span>
        </span>

        <span className="text-gray-400 text-[11px] hidden sm:inline">|</span>

        <span className="text-white font-medium text-[11px] hidden sm:inline font-mono">
          {formattedBlock}
        </span>

        <ChevronDown className="w-3.5 h-3.5 text-cyan-400/70 group-hover:text-cyan-300 transition-transform" />
      </button>

      {/* Denim Inspection Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl glass-panel p-6 rounded-2xl border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col gap-5 text-white">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black tracking-tight font-['Cinzel'] text-cyan-200">
                      BASE DENIM UPGRADE
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      200ms NATIVE BLOCKS
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Flashblocks deprecated • Canonical sub-second execution active
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Canonical Head
                </span>
                <span className="text-sm font-mono font-bold text-cyan-300 mt-1 truncate">
                  {formattedBlock}
                </span>
                <span className="text-[9px] text-gray-500 font-mono mt-0.5">
                  BaseTime: +{subSecondMs}ms
                </span>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" /> Cadence
                </span>
                <span className="text-sm font-mono font-bold text-emerald-300 mt-1">
                  ~{avgBlockTimeMs}ms
                </span>
                <span className="text-[9px] text-emerald-400/80 font-mono mt-0.5">
                  {blocksPerSec} blocks / sec
                </span>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-purple-400" /> State Engine
                </span>
                <span className="text-sm font-mono font-bold text-purple-300 mt-1 truncate">
                  Canonical Only
                </span>
                <span className="text-[9px] text-gray-400 font-mono mt-0.5">
                  Pending Tag: Zero
                </span>
              </div>
            </div>

            {/* Network Selector for Testing (Vibenet, Sepolia, Mainnet) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span className="font-bold uppercase tracking-wider text-[11px] text-cyan-300">
                  Select Network (Denim Environments)
                </span>
                <span className="text-[10px] text-gray-400">
                  Active: <strong className="text-white">{chainName}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {supportedChains.map((c) => {
                  const isActive = c.id === currentChainId;
                  const isVibenet = c.id === 84538453;
                  const isSepolia = c.id === 84532;
                  return (
                    <button
                      key={c.id}
                      onClick={() => switchChain({ chainId: c.id })}
                      disabled={isActive || isSwitching}
                      className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-white/5 border-white/10 hover:border-cyan-500/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">
                          {c.name.replace(' (200ms)', '')}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">
                        {isVibenet ? '200ms Devnet Testbed' : isSepolia ? 'Denim Live (Oct 21)' : 'Target Nov 2026'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Migration Verification Checklist */}
            <div className="glass-panel p-3.5 rounded-xl border border-white/10 text-xs space-y-2.5">
              <span className="font-bold uppercase tracking-wider text-[11px] text-gray-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Flashblocks to Denim 200ms Migration Checklist
              </span>
              
              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>eth_subscribe("newFlashblocks") ➔ eth_subscribe("newHeads")</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>eth_getBlockByNumber("pending") ➔ Canonical Latest Blocks</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>eth_getBalance / eth_call("pending") ➔ Latest Canonical State</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Receipt Confirmation Polling ➔ 200ms Native Cadence</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 glass-panel text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
