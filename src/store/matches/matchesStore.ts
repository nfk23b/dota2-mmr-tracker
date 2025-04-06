import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Match } from '../../features/matches/types';

interface MatchesState {
  matches: Match[];
  currentMMR: number;
  addMatch: (match: Omit<Match, 'id' | 'date'>) => void;
  removeMatch: (id: string) => void;
  setCurrentMMR: (mmr: number) => void;
}

export const useMatchesStore = create<MatchesState>()(
  persist(
    (set) => ({
      matches: [],
      currentMMR: 0,
      addMatch: (matchData) => set((state) => {
        const newMatch: Match = {
          ...matchData,
          id: crypto.randomUUID(),
          date: new Date(),
        };
        return {
          matches: [...state.matches, newMatch],
          currentMMR: state.currentMMR + matchData.mmrChange,
        };
      }),
      removeMatch: (id) => set((state) => {
        const matchToRemove = state.matches.find(match => match.id === id);
        if (!matchToRemove) return state;
        
        return {
          matches: state.matches.filter(match => match.id !== id),
          currentMMR: state.currentMMR - matchToRemove.mmrChange,
        };
      }),
      setCurrentMMR: (mmr) => set({ currentMMR: mmr }),
    }),
    {
      name: 'dota-mmr-storage',
    }
  )
);