import { Web3Provider } from './lib/web3/Web3Provider';
import { ConnectWallet } from './components/web3/ConnectWallet';
import { useGameStore } from './store/gameStore';
import { TitleScreen } from './components/screens/TitleScreen';
import { SanctumScreen } from './components/screens/SanctumScreen';
import { GameScreen } from './components/screens/GameScreen';
import { GameOverScreen } from './components/screens/GameOverScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { Sun } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useOnchainTx } from './hooks/useOnchainTx';

function GameCoordinator() {
  const { screen } = useGameStore();
  const { address, isConnected } = useAccount();
  const { executeTx, isPending } = useOnchainTx();

  const handleSayGM = async () => {
    if (!address) return;
    executeTx({
      to: "0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3",
      data: '0x'
    });
  };

  return (
    <div className="relative w-full h-screen cyber-grid overflow-hidden font-sans text-white selection:bg-purple-500/30">
      {/* Global Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Global UI */}
      <div className="absolute top-4 right-4 z-50 flex flex-nowrap items-center gap-3">
        {isConnected && (
            <button
              onClick={handleSayGM}
              disabled={isPending}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold whitespace-nowrap"
            >
              <Sun className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
              {isPending ? 'Sending...' : 'Say GM'}
            </button>
        )}
        <ConnectWallet />
      </div>

      {/* Screen Router */}
      <div className="relative w-full h-full z-10 flex flex-col">
        {screen === 'TITLE' && <TitleScreen />}
        {screen === 'SANCTUM' && <SanctumScreen />}
        {screen === 'GAME' && <GameScreen />}
        {screen === 'GAME_OVER' && <GameOverScreen />}
        {screen === 'LEADERBOARD' && <LeaderboardScreen />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <GameCoordinator />
    </Web3Provider>
  );
}

