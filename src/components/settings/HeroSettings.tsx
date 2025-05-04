import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/settings/settingsStore';

// This would usually come from a more complete data file or API
// For now, we'll include a small sample of heroes
const SAMPLE_HEROES = [
  'Anti-Mage', 'Axe', 'Crystal Maiden', 'Drow Ranger', 'Earthshaker',
  'Invoker', 'Juggernaut', 'Lina', 'Lion', 'Mirana',
  'Pudge', 'Shadow Fiend', 'Sniper', 'Windranger', 'Zeus'
];

const HeroSettings: React.FC = () => {
  const favoriteHeroes = useSettingsStore(state => state.settings.favoriteHeroes);
  const addFavoriteHero = useSettingsStore(state => state.addFavoriteHero);
  const removeFavoriteHero = useSettingsStore(state => state.removeFavoriteHero);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [availableHeroes, setAvailableHeroes] = useState<string[]>(SAMPLE_HEROES);
  
  // Filter heroes based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setAvailableHeroes(SAMPLE_HEROES.filter(hero => !favoriteHeroes.includes(hero)));
    } else {
      const filtered = SAMPLE_HEROES.filter(
        hero =>
          hero.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !favoriteHeroes.includes(hero)
      );
      setAvailableHeroes(filtered);
    }
  }, [searchTerm, favoriteHeroes]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Add hero to favorites
  const handleAddFavorite = (hero: string) => {
    addFavoriteHero(hero);
  };
  
  // Remove hero from favorites
  const handleRemoveFavorite = (hero: string) => {
    removeFavoriteHero(hero);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Hero Settings</h2>
      
      {/* Favorite Heroes Section */}
      <div className="space-y-2">
        <h3 className="font-medium">Favorite Heroes</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select your favorite heroes to quickly access them when adding new matches
        </p>
        
        {/* Favorite Heroes List */}
        <div className="p-4 w-full p-2 border border-gray-700 rounded-md shadow-sm text-white bg-gray-800 dark:border-gray-600">
          {favoriteHeroes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              You haven't added any favorite heroes yet
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {favoriteHeroes.map((hero) => (
                <div
                  key={hero}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200"
                >
                  <span>{hero}</span>
                  <button
                    onClick={() => handleRemoveFavorite(hero)}
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Add Heroes Section */}
      <div className="space-y-2">
        <h3 className="font-medium">Add Heroes</h3>
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search heroes..."
            className="w-full p-2 pl-8 w-full p-2 border border-gray-700 rounded-md shadow-sm text-white bg-gray-800 dark:border-gray-600"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        {/* Available Heroes List */}
        <div className="p-4 w-full p-2 border border-gray-700 rounded-md shadow-sm text-white bg-gray-800 dark:border-gray-600 max-h-60 overflow-y-auto">
          {availableHeroes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm
                ? 'No heroes found matching your search'
                : 'All heroes have been added to favorites'}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableHeroes.map((hero) => (
                <div
                  key={hero}
                  className="flex items-center bg-gray-100 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200 dark:text-gray-700 dark:hover:bg-gray-200"
                  onClick={() => handleAddFavorite(hero)}
                >
                  <span>{hero}</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">+</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Info Box */}
      <div className="p-4 bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md">
        <p className="text-sm">
          <strong>Coming Soon:</strong> Full hero list with attributes, roles, 
          and the ability to track your most played heroes with performance statistics.
        </p>
      </div>
    </div>
  );
};

export default HeroSettings;