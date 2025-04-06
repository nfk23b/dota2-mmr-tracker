import React, { useState } from 'react';
import { useMatchesStore } from '../../store/matches/matchesStore';
import MatchCard from './MatchCard';

const MatchList: React.FC = () => {
  const matches = useMatchesStore(state => state.matches);
  const removeMatch = useMatchesStore(state => state.removeMatch);
  
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Sort matches by date
  const sortedMatches = [...matches].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Calculate stats
  const totalGames = matches.length;
  const wins = matches.filter(match => match.result === 'win').length;
  const winrate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const totalMmrChange = matches.reduce((sum, match) => sum + match.mmrChange, 0);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

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
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-dota-red">Match Stats</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Total Games</div>
            <div className="text-2xl font-bold mt-1">{totalGames}</div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Win Rate</div>
            <div className="text-2xl font-bold mt-1">{winrate}%</div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Total MMR</div>
            <div className={`text-2xl font-bold mt-1 ${totalMmrChange > 0 ? 'text-green-400' : totalMmrChange < 0 ? 'text-red-400' : ''}`}>
              {totalMmrChange > 0 ? `+${totalMmrChange}` : totalMmrChange}
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Last 5 Games</div>
            <div className="flex justify-center space-x-1 mt-2">
              {sortedMatches.slice(0, 5).map(match => (
                <div 
                  key={match.id} 
                  className={`w-2 h-6 rounded-sm ${match.result === 'win' ? 'bg-green-500' : 'bg-red-500'}`}
                  title={`${match.hero}: ${match.result === 'win' ? 'Win' : 'Loss'} (${match.mmrChange > 0 ? '+' : ''}${match.mmrChange})`}
                ></div>
              ))}
              {Array(Math.max(0, 5 - sortedMatches.length)).fill(0).map((_, i) => (
                <div key={i} className="w-2 h-6 rounded-sm bg-gray-600"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-dota-red">Match History</h2>
        <button 
          onClick={toggleSortOrder}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm flex items-center"
        >
          <span>Sort: {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}</span>
          <svg 
            className="w-4 h-4 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
          </svg>
        </button>
      </div>
      
      <div className="space-y-4">
        {sortedMatches.map(match => (
          <MatchCard key={match.id} match={match} onDelete={removeMatch} />
        ))}
      </div>
    </div>
  );
};

export default MatchList;