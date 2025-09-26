import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MatchForm from './components/matches/MatchForm';
import MatchList from './components/matches/MatchList';
import WelcomeModal from './components/common/WelcomeModal';
import { useMatchesStore } from './store/matches/matchesStore';
import { useSettingsStore } from './store/settings/settingsStore';
import MmrChart from './components/charts/MmrChart';
import HeroStats from './components/stats/HeroStats';
import RoleStats from './components/stats/RoleStats';
import MoodStats from './components/stats/MoodStats';
import Settings from './components/settings/Settings';
import { initializeSettings } from './utils/settingsInit';

// Tip Banner component that checks current location
const TipBanner: React.FC = () => {
  const location = useLocation();
  const matches = useMatchesStore(state => state.matches);
  const [showTips, setShowTips] = useState(true);
  
  // Only show tips on the home page
  if (location.pathname !== '/' || !showTips || matches.length > 0) {
    return null;
  }
  
  return (
    <div className="bg-gray-700 rounded-lg p-4 mb-8 relative">
      <button
        onClick={() => setShowTips(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <h3 className="text-lg font-bold text-dota-red mb-2">Getting Started</h3>
      <ul className="list-disc list-inside text-sm space-y-1 text-gray-300">
        <li>Add your matches using the form on the left</li>
        <li>Your current MMR will automatically update</li>
        <li>You can edit your MMR anytime by clicking on it in the header</li>
        <li>Track your progress over time with detailed stats</li>
      </ul>
    </div>
  );
};

// Main HomePage component
const HomePage: React.FC = () => {
  return (
    <>
      <TipBanner />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="lg:sticky lg:top-4">
            <MatchForm />
          </div>
        </div>
        <div className="lg:col-span-2 order-1 lg:order-2">
          <MatchList />
        </div>
      </div>
    </>
  );
};

// Main App container
function App() {
  const setCurrentMMR = useMatchesStore(state => state.setCurrentMMR);
  const currentMMR = useMatchesStore(state => state.currentMMR);
  const matches = useMatchesStore(state => state.matches);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [mmrManuallySet, setMmrManuallySet] = useState(false);
  
  // Get update functions from settings store
  const updateMmr = useSettingsStore(state => state.updateMmr);
  const updateInitialMmr = useSettingsStore(state => state.updateInitialMmr);
  
  // Initialize settings and sync data between stores
  useEffect(() => {
    initializeSettings();
    
    // Check if MMR was manually set before
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (hasVisited === 'true') {
      setMmrManuallySet(true);
    }
  }, []);
  
  // Setup event listeners to detect user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
    };
    
    // These events indicate user interaction
    const events = ['click', 'keydown', 'mousemove', 'scroll'];
    
    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true });
    });
    
    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, []);
  
  // Show modal after user interaction if MMR was not manually set
  useEffect(() => {
    if (userInteracted && !mmrManuallySet && matches.length === 0) {
      // Only check hasVisited if we're not sure if MMR was manually set
      const hasVisited = localStorage.getItem('hasVisitedBefore');
      if (hasVisited !== 'true') {
        setShowWelcomeModal(true);
      }
    }
  }, [userInteracted, mmrManuallySet, matches.length]);
  
  const handleSetInitialMMR = (mmr: number) => {
    // Update MMR in both stores
    setCurrentMMR(mmr);
    updateMmr(mmr);
    updateInitialMmr(mmr);
    
    setShowWelcomeModal(false);
    setMmrManuallySet(true);
    localStorage.setItem('hasVisitedBefore', 'true');
  };
  
  return (
    <Router>
      {showWelcomeModal && (
        <WelcomeModal onSubmit={handleSetInitialMMR} />
      )}
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<Navigate to="/" replace />} />
          <Route path="/charts" element={<MmrChart matches={matches} />} />
          <Route path="/hero-stats" element={<HeroStats matches={matches} />} />
          <Route path="/role-stats" element={<RoleStats matches={matches} />} />
          <Route path="/mood-stats" element={<MoodStats matches={matches} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;