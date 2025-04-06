import React, { useState } from 'react';
import { useMatchesStore } from '../../store/matches/matchesStore';

const Header: React.FC = () => {
  const currentMMR = useMatchesStore(state => state.currentMMR);
  const setCurrentMMR = useMatchesStore(state => state.setCurrentMMR);
  const [isEditing, setIsEditing] = useState(false);
  const [mmrValue, setMmrValue] = useState(currentMMR.toString());
  
  const handleEditClick = () => {
    setMmrValue(currentMMR.toString());
    setIsEditing(true);
  };
  
  const handleSaveClick = () => {
    const newMMR = Number(mmrValue);
    if (!isNaN(newMMR)) {
      setCurrentMMR(newMMR);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveClick();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <header className="bg-gray-800 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center">
          <img 
            src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_horiz.png" 
            alt="Dota 2" 
            className="h-10 mr-2"
          />
          <h1 className="text-2xl font-bold text-dota-red tracking-tight">MMR Tracker</h1>
        </div>
        
        <div className="bg-gray-700 px-6 py-3 rounded-lg shadow-md border border-gray-600 mt-4 sm:mt-0">
          <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Current MMR</div>
          {isEditing ? (
            <div className="flex items-center mt-1 max-h-7">
              <input
                type="number"
                value={mmrValue}
                onChange={(e) => setMmrValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-gray-800 text-white text-xl font-bold w-24 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-dota-red max-h-7"
                autoFocus
              />
              <button 
                onClick={handleSaveClick}
                className="ml-2 bg-dota-red hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
              >
                Save
              </button>
            </div>
          ) : (
            <div 
              onClick={handleEditClick}
              className="font-bold text-2xl text-white cursor-pointer hover:text-dota-red transition-colors"
            >
              {currentMMR}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;