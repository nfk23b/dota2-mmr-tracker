import React from 'react';
import { useMatchesStore } from '../store/matches/matchesStore';
import MmrChart from '../components/charts/MmrChart';
import HeroStats from '../components/stats/HeroStats';
import RoleStats from '../components/stats/RoleStats';
import MoodStats from '../components/stats/MoodStats';

const Statistics: React.FC = () => {
  const matches = useMatchesStore(state => state.matches);

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
    <div className="space-y-8">
      <MmrChart matches={matches} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HeroStats matches={matches} />
        <RoleStats matches={matches} />
      </div>
      
      <MoodStats matches={matches} />
    </div>
  );
};

export default Statistics;