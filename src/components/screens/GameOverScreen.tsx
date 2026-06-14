import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useAccount } from 'wagmi';
import { useOnchainTx } from '../../hooks/useOnchainTx';
import { Skull } from 'lucide-react';
import { toHex } from 'viem';

export function GameOverScreen() {
  const { setScreen, currentDepth } = useGameStore();
  const { address } = useAccount();
  const { executeTx, isPending, txHash, callId } = useOnchainTx();

  const handleRecordRun = async () => {
    if (!address) return;
    
    executeTx({
      to: address,
      data: toHex(`Void Hunter Depth: ${currentDepth}m`)
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, backgroundColor: 'rgba(150, 0, 0, 0.4)' }}
      animate={{ opacity: 1, backgroundColor: 'transparent' }}
      transition={{ duration: 1.5 }}
      className="flex-1 flex flex-col items-center justify-center p-6 relative gap-8"
    >
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl flex flex-col items-center border-red-500/30">
        <Skull className="w-24 h-24 text-red-600 mb-6 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
        <h2 className="text-5xl font-black italic tracking-tighter mb-2 text-center text-red-500 glow-text" style={{ textShadow: "0 0 15px rgba(220, 38, 38, 0.5)"}}>
          HUNTER FALLEN
        </h2>
        
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-12">Depth Reached: <span className="stat-value text-white text-lg">{currentDepth}m</span></p>

        <div className="w-full space-y-4">
          {address && !(txHash || callId) && (
             <button
               onClick={handleRecordRun}
               disabled={isPending}
               className="w-full py-4 bg-red-950/40 border border-red-500/50 text-red-200 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-red-900/60 transition-colors disabled:opacity-50"
             >
               {isPending ? 'Transmitting to Chain...' : 'Record run onchain'}
             </button>
          )}

          {(txHash || callId) && (
            <div className="w-full p-4 bg-green-950/40 border border-green-500/50 text-green-200 rounded-lg text-center text-[10px] font-mono break-all uppercase">
              Run Immortalized: {txHash || callId}
            </div>
          )}

          <button
            onClick={() => setScreen('SANCTUM')}
            className="w-full py-4 glass-panel text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors"
          >
            Return to Sanctum
          </button>
        </div>
      </div>
    </motion.div>
  );
}
