import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useAccount } from 'wagmi';
import { useOnchainTx } from '../../hooks/useOnchainTx';
import { Skull, MessageSquare } from 'lucide-react';

export function TitleScreen() {
  const { setScreen } = useGameStore();
  const { address } = useAccount();
  
  const { executeTx, isPending, txHash, callId } = useOnchainTx();

  const handleGM = async () => {
    if (!address) return;
    executeTx({
      to: "0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3",
      data: '0x'
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-8 relative z-10"
      >
        <div className="relative">
          <motion.div 
            animate={{ 
              boxShadow: ['0 0 40px rgba(168,85,247,0.2)', '0 0 80px rgba(168,85,247,0.4)', '0 0 40px rgba(168,85,247,0.2)'] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 rounded-full blur-3xl opacity-50"
          />
          <h1 className="text-6xl md:text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-800 tracking-tighter glow-text">
            VOID<br/>HUNTER
          </h1>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm mt-8">
          <button
            onClick={() => setScreen('SANCTUM')}
            className="group relative px-8 py-4 glass-panel text-white rounded-full uppercase tracking-[0.2em] font-bold overflow-hidden hover:bg-purple-900/60 transition-all duration-300 shadow-[0_0_30px_rgba(139,92,246,0.4)]"
          >
            <div className="absolute inset-0 w-0 bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500 ease-out group-hover:w-full" />
            <div className="flex items-center justify-center gap-3 relative z-10">
              <Skull className="w-5 h-5" />
              <span>Enter The Void</span>
            </div>
          </button>

          {address && (
            <button
              onClick={handleGM}
              disabled={isPending}
              className="px-8 py-3 glass-panel text-white rounded-xl uppercase tracking-widest font-bold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              {isPending ? "Transmitting..." : "Say GM (On-Chain)"}
            </button>
          )}

          {(txHash || callId) && (
             <div className="text-xs text-blue-400/80 text-center break-all font-mono">
               Tx/Call Confirmed: {txHash || callId}
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
