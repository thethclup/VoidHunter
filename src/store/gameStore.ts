import { create } from 'zustand';

export type ScreenState = 'TITLE' | 'SANCTUM' | 'GAME' | 'GAME_OVER' | 'LEADERBOARD';

interface GameState {
  screen: ScreenState;
  essence: number;
  maxDepth: number;
  currentDepth: number;
  weaponLevel: number;
  
  setScreen: (screen: ScreenState) => void;
  addEssence: (amount: number) => void;
  updateDepth: (depth: number) => void;
  upgradeWeapon: () => void;
  resetRun: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: 'TITLE',
  essence: 0,
  maxDepth: 0,
  currentDepth: 0,
  weaponLevel: 1,
  
  setScreen: (screen) => set({ screen }),
  addEssence: (amount) => set((state) => ({ essence: state.essence + amount })),
  updateDepth: (depth) => set((state) => ({ 
    currentDepth: depth,
    maxDepth: Math.max(state.maxDepth, depth)
  })),
  upgradeWeapon: () => set((state) => ({ 
    weaponLevel: state.weaponLevel + 1,
    essence: Math.max(0, state.essence - state.weaponLevel * 100)
  })),
  resetRun: () => set({ currentDepth: 0 })
}));
