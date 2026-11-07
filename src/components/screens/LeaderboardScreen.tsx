import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export function LeaderboardScreen() {
  const { setScreen } = useGameStore();

  const mockLeaders = [
    { rank: 1, address: '0x1234...5678', depth: 450, essence: 12000 },
    { rank: 2, address: '0x8765...4321', depth: 320, essence: 8500 },
    { rank: 3, address: 'bc_6...gmv5', depth: 290, essence: 7100 }, // Builder code mock
    { rank: 4, address: '0xabcd...efgh', depth: 150, essence: 3200 },
    { rank: 5, address: '0xfedc...ba98', depth: 110, essence: 2100 },
  ];

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
              <h1 className="text-xl font-bold tracking-tighter glow-text">LEGENDARY HUNTERS</h1>
              <p className="text-[10px] uppercase tracking-widest text-cyan-400">Base Mainnet Denim // 200ms Canonical Global Rank</p>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto mb-6 pr-2">
          <div className="space-y-4">
            <div className="grid grid-cols-4 px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/10">
              <div>Rank</div>
              <div className="col-span-2">Hunter Identity</div>
              <div className="text-right">Max Depth</div>
            </div>
            
            {mockLeaders.map((leader, i) => (
               <div 
                 key={i}
                 className={`grid grid-cols-4 px-4 py-4 rounded-xl items-center text-sm
                   ${i === 0 ? 'bg-purple-900/40 border border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 
                     i === 1 ? 'glass-panel' :
                     i === 2 ? 'glass-panel opacity-90' :
                     'bg-white/5 border border-white/5 text-white/70'}`}
               >
                 <div className="font-mono text-xs font-bold text-gray-400">0{leader.rank}</div>
                 <div className="col-span-2 font-medium">{leader.address}</div>
                 <div className="text-right stat-value text-cyan-400">{leader.depth}m</div>
               </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setScreen('SANCTUM')}
          className="w-full flex-shrink-0 py-4 glass-panel text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors"
        >
          Return to Sanctum
        </button>
      </div>
    </motion.div>
  );
}
