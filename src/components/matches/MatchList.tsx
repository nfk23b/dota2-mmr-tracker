import React, { useState, useMemo } from 'react';
import { useMatchesStore } from '../../store/matches/matchesStore';
import MatchCard from './MatchCard';
import MatchFilters, { FilterOptions } from './MatchFilters';
import MmrChart from '../charts/MmrChart';
import HeroStats from '../stats/HeroStats';

type SortOption = 'newest' | 'oldest' | 'mmr-high' | 'mmr-low';

const MatchList: React.FC = () => {
  const matches = useMatchesStore(state => state.matches);
  const removeMatch = useMatchesStore(state => state.removeMatch);
  
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<FilterOptions>({
    hero: null,
    role: null,
    gameDifficulty: null,
    result: null,
    tokenOnly: false
  });

  // Get unique heroes from matches
  const uniqueHeroes = useMemo(() => {
    const heroSet = new Set(matches.map(match => match.hero));
    return Array.from(heroSet).sort();
  }, [matches]);

  // Apply filters and sorting
  const filteredAndSortedMatches = useMemo(() => {
    // First apply filters
    let result = [...matches];
    
    if (filters.hero) {
      result = result.filter(match => match.hero === filters.hero);
    }
    
    if (filters.role) {
      result = result.filter(match => match.role === filters.role);
    }
    
    if (filters.gameDifficulty) {
      result = result.filter(match => match.gameDifficulty === filters.gameDifficulty);
    }
    
    if (filters.result) {
      result = result.filter(match => match.result === filters.result);
    }
    
    if (filters.tokenOnly) {
      result = result.filter(match => match.isTokenGame);
    }
    
    // Then apply sorting
    return result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'mmr-high':
          return b.mmrChange - a.mmrChange;
        case 'mmr-low':
          return a.mmrChange - b.mmrChange;
        default:
          return 0;
      }
    });
  }, [matches, filters, sortOption]);

  // Calculate stats for filtered matches
  const stats = useMemo(() => {
    const totalGames = filteredAndSortedMatches.length;
    const wins = filteredAndSortedMatches.filter(match => match.result === 'win').length;
    const winrate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
    const totalMmrChange = filteredAndSortedMatches.reduce((sum, match) => sum + match.mmrChange, 0);
    
    return { totalGames, wins, winrate, totalMmrChange };
  }, [filteredAndSortedMatches]);

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
        <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <p className="mt-4 text-gray-400 text-lg">No matches recorded yet</p>
        <p className="mt-2 text-gray-500">Start tracking your progress by adding your first match!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MatchFilters 
        heroes={uniqueHeroes}
        onFilterChange={setFilters}
        onSortChange={setSortOption}
        currentSort={sortOption}
      />
      <HeroStats matches={matches} />
      
      {matches?.length > 1 && <MmrChart matches={matches} />}

      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-dota-red">Match Stats</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Total Games</div>
            <div className="text-2xl font-bold mt-1">{stats.totalGames}</div>
            {filters.hero || filters.role || filters.gameDifficulty || filters.result || filters.tokenOnly ? (
              <div className="text-xs text-gray-400 mt-1">(Filtered)</div>
            ) : null}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Win Rate</div>
            <div className="text-2xl font-bold mt-1">{stats.winrate}%</div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Total MMR</div>
            <div className={`text-2xl font-bold mt-1 ${stats.totalMmrChange > 0 ? 'text-green-400' : stats.totalMmrChange < 0 ? 'text-red-400' : ''}`}>
              {stats.totalMmrChange > 0 ? `+${stats.totalMmrChange}` : stats.totalMmrChange}
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Last 5 Games</div>
            <div className="flex justify-center space-x-1 mt-2">
              {filteredAndSortedMatches.slice(0, 5).map(match => (
                <div 
                  key={match.id} 
                  className={`w-2 h-6 rounded-sm ${match.result === 'win' ? 'bg-green-500' : 'bg-red-500'}`}
                  title={`${match.hero}: ${match.result === 'win' ? 'Win' : 'Loss'} (${match.mmrChange > 0 ? '+' : ''}${match.mmrChange})`}
                ></div>
              ))}
              {Array(Math.max(0, 5 - filteredAndSortedMatches.length)).fill(0).map((_, i) => (
                <div key={i} className="w-2 h-6 rounded-sm bg-gray-600"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-dota-red">Match History</h2>
        <div className="text-sm text-gray-400">
          {filteredAndSortedMatches.length} {filteredAndSortedMatches.length === 1 ? 'match' : 'matches'} found
        </div>
      </div>
      
      {filteredAndSortedMatches.length === 0 ? (
        <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400">No matches found with the current filters.</p>
          <button 
            onClick={() => setFilters({
              hero: null,
              role: null,
              gameDifficulty: null,
              result: null,
              tokenOnly: false
            })}
            className="mt-2 text-dota-red hover:text-red-400"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedMatches.map(match => (
            <MatchCard key={match.id} match={match} onDelete={removeMatch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchList;