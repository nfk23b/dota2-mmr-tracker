import React, { useState } from 'react';
import { 
  GAME_DIFFICULTIES, 
  GAME_DIFFICULTY_LABELS, 
  ROLES, 
  ROLE_LABELS,
  HEROES
} from '../../features/matches/constants';

type SortOption = 'newest' | 'oldest' | 'mmr-high' | 'mmr-low';

interface MatchFiltersProps {
  heroes: string[];
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOption) => void;
  currentSort: SortOption;
}

export interface FilterOptions {
  hero: string | null;
  role: number | null;
  gameDifficulty: string | null;
  result: string | null;
  tokenOnly: boolean;
}

const MatchFilters: React.FC<MatchFiltersProps> = ({ 
  heroes, 
  onFilterChange, 
  onSortChange,
  currentSort
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    hero: null,
    role: null,
    gameDifficulty: null,
    result: null,
    tokenOnly: false
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      hero: null,
      role: null,
      gameDifficulty: null,
      result: null,
      tokenOnly: false
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-dota-red">Filter & Sort</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-gray-400 hover:text-white"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Hero Filter */}
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-400">Hero</label>
          <select
            value={filters.hero || ''}
            onChange={(e) => handleFilterChange('hero', e.target.value || null)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm text-white"
          >
            <option value="">All Heroes</option>
            {heroes.map(hero => (
              <option key={hero} value={hero}>{hero}</option>
            ))}
          </select>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-400">Role</label>
          <select
            value={filters.role || ''}
            onChange={(e) => handleFilterChange('role', e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm text-white"
          >
            <option value="">All Roles</option>
            {ROLES.map(role => (
              <option key={role} value={role}>{ROLE_LABELS[role]}</option>
            ))}
          </select>
        </div>

        {/* Game Difficulty Filter */}
        <div>
        <label className="block text-xs font-medium mb-1 text-gray-400">Game Difficulty</label>
        <select
            value={filters.gameDifficulty || ''}
            onChange={(e) => handleFilterChange('gameDifficulty', e.target.value || null)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm text-white"
        >
            <option value="">All Difficulties</option>
            {Object.entries(GAME_DIFFICULTY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
            ))}
        </select>
        </div>

        {/* Result Filter */}
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-400">Result</label>
          <select
            value={filters.result || ''}
            onChange={(e) => handleFilterChange('result', e.target.value || null)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm text-white"
          >
            <option value="">All Results</option>
            <option value="win">Wins</option>
            <option value="loss">Losses</option>
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-400">Sort By</label>
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mmr-high">Highest MMR Change</option>
            <option value="mmr-low">Lowest MMR Change</option>
          </select>
        </div>
      </div>

      {/* Token Games Filter */}
      <div className="mt-3">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.tokenOnly}
            onChange={(e) => handleFilterChange('tokenOnly', e.target.checked)}
            className="sr-only peer"
          />
          <div className="relative w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-dota-red rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-dota-red"></div>
          <span className="ms-3 text-sm font-medium text-gray-300">Token Games Only</span>
        </label>
      </div>
    </div>
  );
};

export default MatchFilters;