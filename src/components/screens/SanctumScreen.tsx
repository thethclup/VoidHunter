import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Shield, Droplet, Play, Trophy } from 'lucide-react';

export function SanctumScreen() {
  const { setScreen, essence, weaponLevel, upgradeWeapon, maxDepth } = useGameStore();

  const upgradeCost = weaponLevel * 100;
  const canUpgrade = essence >= upgradeCost;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center p-6 h-full"
    >
      <div className="w-full max-w-4xl h-full flex flex-col glass-panel p-6 rounded-2xl relative shadow-[0_0_50px_rgba(88,28,135,0.3)]">
        <header className="flex justify-between items-center glass-panel p-4 rounded-xl mb-6 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-900 rounded-lg flex items-center justify-center border border-purple-400">
              <span className="text-2xl font-black italic">V</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter glow-text">SANCTUM</h1>
              <p className="text-[10px] uppercase tracking-widest text-purple-400">Safe Zone // [bc_6qw3gmv5]</p>
            </div>
          </div>
          <div className="flex space-x-6">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase">Void Essence</p>
              <p className="stat-value text-cyan-400 text-lg flex items-center gap-1 justify-end">
                {essence}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Stats Card */}
          <div className="col-span-12 md:col-span-5 glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Hunter Stats</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="uppercase text-gray-400">Max Depth</span>
                    <span className="stat-value text-purple-400">{maxDepth}m</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full">
                    <div className="h-full bg-purple-500 max-w-full" style={{width: `${Math.min(100, maxDepth)}%`}}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="uppercase text-gray-400">Weapon Power</span>
                    <span className="stat-value text-purple-400">LVL {weaponLevel}</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full">
                    <div className="h-full bg-purple-500 max-w-full" style={{width: `${Math.min(100, weaponLevel * 10)}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setScreen('LEADERBOARD')}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Trophy className="w-4 h-4" /> Legendary Hunters
            </button>
          </div>

          {/* Upgrade Card */}
          <div className="col-span-12 md:col-span-7 glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                <Shield className="w-64 h-64 blur-sm" />
             </div>
             
             <div className="relative z-10">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Arsenal Upgrade</h3>
                <h2 className="text-3xl font-black italic tracking-tighter glow-text mb-4">Void Blade</h2>
                <div className="mt-auto p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Infused with dark matter. Increases base slash damage. Higher tier weapons are required to survive deeper void dimensions.
                  </p>
                </div>
             </div>
             
             <button
               onClick={upgradeWeapon}
               disabled={!canUpgrade}
               className={`w-full py-4 mt-6 rounded-lg font-bold text-sm uppercase tracking-[0.2em] transition-all relative z-10
                 ${canUpgrade 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]' 
                    : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'}`}
             >
               {canUpgrade ? `Upgrade (-${upgradeCost} ESS)` : `Need ${upgradeCost} ESS`}
             </button>
          </div>
        </div>

        <button
          onClick={() => {
            useGameStore.getState().resetRun();
            setScreen('GAME');
          }}
          className="w-full mt-6 py-4 bg-white text-black text-lg font-black uppercase tracking-[0.2em] rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 flex-shrink-0"
        >
          <Play className="w-5 h-5 fill-black" />
          Initiate Hunt
        </button>
      </div>
    </motion.div>
  );
}
