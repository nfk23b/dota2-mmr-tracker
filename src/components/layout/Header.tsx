import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettingsStore } from '../../store/settings/settingsStore';
import { useMatchesStore } from '../../store/matches/matchesStore';

const Header: React.FC = () => {
  const location = useLocation();
  // Get MMR from settings store
  const currentMmr = useSettingsStore(state => state.settings.currentMmr);
  const updateMmr = useSettingsStore(state => state.updateMmr);
  
  // Get MMR from matches store for synchronization
  const matchesCurrentMMR = useMatchesStore(state => state.currentMMR);
  const setMatchesCurrentMMR = useMatchesStore(state => state.setCurrentMMR);
  const matches = useMatchesStore(state => state.matches);
  
  const [isEditingMmr, setIsEditingMmr] = useState(false);
  const [tempMmr, setTempMmr] = useState(matchesCurrentMMR.toString());
  // Track if MMR was manually set
  const [mmrManuallySet, setMmrManuallySet] = useState(false);
  
  // Check if MMR was manually set by continuously monitoring
  useEffect(() => {
    // Function to check MMR status
    const checkMmrStatus = () => {
      const hasVisited = localStorage.getItem('hasVisitedBefore');
      
      // Consider MMR set if localStorage flag exists, matches exist, or MMR has been changed from default
      if (hasVisited === 'true' || 
          matches.length > 0 || 
          (matchesCurrentMMR !== 0 && matchesCurrentMMR !== 1500) ||
          (currentMmr !== 3000 && currentMmr !== 1500)) {
        setMmrManuallySet(true);
      }
    };
    
    // Check immediately
    checkMmrStatus();
    
    // Also set up an interval to check periodically
    // This ensures we catch changes from the welcome modal
    const intervalId = setInterval(checkMmrStatus, 500);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [matches.length, matchesCurrentMMR, currentMmr]);
  
  // Synchronize MMR values and update local state
  useEffect(() => {
    if (matchesCurrentMMR !== 0) {
      // If matchesStore has value, use it as source of truth
      if (currentMmr !== matchesCurrentMMR) {
        updateMmr(matchesCurrentMMR);
      }
      if (!isEditingMmr) {
        setTempMmr(matchesCurrentMMR.toString());
      }
    } else if (currentMmr !== 3000) {
      // If settings has non-default value but matches store is empty
      setMatchesCurrentMMR(currentMmr);
      if (!isEditingMmr) {
        setTempMmr(currentMmr.toString());
      }
    }
  }, [matchesCurrentMMR, currentMmr, isEditingMmr, updateMmr, setMatchesCurrentMMR]);
  
  // Handle MMR input change
  const handleMmrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempMmr(e.target.value);
  };
  
  // Save MMR on enter or blur
  const saveMmr = () => {
    const mmrValue = parseInt(tempMmr);
    if (!isNaN(mmrValue)) {
      // Update MMR in both stores
      setMatchesCurrentMMR(mmrValue);
      updateMmr(mmrValue);
      setMmrManuallySet(true);
      
      // Save that MMR was manually set
      localStorage.setItem('hasVisitedBefore', 'true');
    } else {
      // If value is invalid, revert to current MMR
      setTempMmr(matchesCurrentMMR !== 0 ? matchesCurrentMMR.toString() : currentMmr.toString());
    }
    setIsEditingMmr(false);
  };
  
  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveMmr();
    } else if (e.key === 'Escape') {
      setTempMmr(matchesCurrentMMR !== 0 ? matchesCurrentMMR.toString() : currentMmr.toString());
      setIsEditingMmr(false);
    }
  };
  
  // Navigation items
  const navItems = [
    { path: '/', label: 'Matches' },
    { path: '/charts', label: 'Charts' },
    { path: '/hero-stats', label: 'Hero Stats' },
    { path: '/role-stats', label: 'Role Stats' },
    { path: '/settings', label: 'Settings' },
  ];
  
  // The displayed MMR value (prioritize matches store)
  const displayMmr = matchesCurrentMMR !== 0 ? matchesCurrentMMR : currentMmr;
  
  return (
    <header className="bg-gray-900 py-4 px-6 border-b border-gray-800">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Title with MMR */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white mr-2">
              <div className="flex items-center">
                <img 
                  src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_horiz.png" 
                  alt="Dota 2" 
                  className="h-10 mr-2"
                />
                <h1 className="text-2xl font-bold text-dota-red tracking-tight">MMR Tracker</h1>
              </div>
            </Link>
            <div className="ml-4 flex items-center bg-gray-800 rounded-md px-3 py-1">
              {isEditingMmr ? (
                <input
                  type="text"
                  className="w-16 bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-center"
                  value={tempMmr}
                  onChange={handleMmrChange}
                  onBlur={saveMmr}
                  onKeyDown={handleKeyPress}
                  autoFocus
                />
              ) : (
                <div
                  className="cursor-pointer flex items-center"
                  onClick={() => setIsEditingMmr(true)}
                >
                  {mmrManuallySet && (
                    <>
                      <span className="text-sm text-gray-400 mr-1">MMR:</span>
                      <span className={`font-bold text-lg text-green-400`}>
                        {displayMmr}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;