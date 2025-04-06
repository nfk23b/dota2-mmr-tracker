import { create } from 'zustand';
import { Match } from '../../features/matches/types';

interface MatchesState {
    matches: Match[];
    currentMMR: number;
    addMatch: (match: Omit<Match, 'id' | 'date'>) => void;
    removeMatch: (id: string) => void;
    setCurrentMMR: (mmr: number) => void;
}

export const useMatchesStore = create<MatchesState>((set) => ({
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
    removeMatch: (id) => set((state) => ({
        matches: state.matches.filter(match => match.id !== id)
    })),
    setCurrentMMR: (mmr) => set({ currentMMR: mmr }),
}));