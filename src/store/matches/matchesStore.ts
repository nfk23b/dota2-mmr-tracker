import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Match } from '../../features/matches/types';
import { useSettingsStore } from '../settings/settingsStore';

interface MatchesState {
  matches: Match[];
  currentMMR: number;
  addMatch: (match: Omit<Match, 'id' | 'date'>) => void;
  removeMatch: (id: string) => void;
  updateMatch: (id: string, matchData: Partial<Omit<Match, 'id' | 'date'>>) => void;
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
        
        const newMMR = state.currentMMR + matchData.mmrChange;
        
        // Sync with settings store
        try {
          const updateMmr = useSettingsStore.getState().updateMmr;
          updateMmr(newMMR);
        } catch (error) {
          console.error('Error syncing with settings store:', error);
        }
        
        return {
          matches: [...state.matches, newMatch],
          currentMMR: newMMR,
        };
      }),
      
      removeMatch: (id) => set((state) => {
        const matchToRemove = state.matches.find(match => match.id === id);
        if (!matchToRemove) return state;
        
        const newMMR = state.currentMMR - matchToRemove.mmrChange;
        
        // Sync with settings store
        try {
          const updateMmr = useSettingsStore.getState().updateMmr;
          updateMmr(newMMR);
        } catch (error) {
          console.error('Error syncing with settings store:', error);
        }
        
        return {
          matches: state.matches.filter(match => match.id !== id),
          currentMMR: newMMR,
        };
      }),
      
      updateMatch: (id, matchData) => set((state) => {
        const matchIndex = state.matches.findIndex(match => match.id === id);
        if (matchIndex === -1) return state;
        
        const oldMatch = state.matches[matchIndex];
        const mmrDiff = matchData.mmrChange !== undefined
          ? matchData.mmrChange - oldMatch.mmrChange
          : 0;
        
        const updatedMatches = [...state.matches];
        updatedMatches[matchIndex] = {
          ...oldMatch,
          ...matchData
        };
        
        const newMMR = state.currentMMR + mmrDiff;
        
        // Sync with settings store when MMR changes
        if (mmrDiff !== 0) {
          try {
            const updateMmr = useSettingsStore.getState().updateMmr;
            updateMmr(newMMR);
          } catch (error) {
            console.error('Error syncing with settings store:', error);
          }
        }
        
        return {
          matches: updatedMatches,
          currentMMR: newMMR
        };
      }),
      
      setCurrentMMR: (mmr) => {
        // Sync with settings store
        try {
          const updateMmr = useSettingsStore.getState().updateMmr;
          updateMmr(mmr);
        } catch (error) {
          console.error('Error syncing with settings store:', error);
        }
        
        return set({ currentMMR: mmr });
      },
    }),
    {
      name: 'dota-mmr-storage',
    }
  )
);