import React, { useEffect, useState } from 'react';
import Layout from './components/layout/Layout';
import MatchForm from './components/matches/MatchForm';
import MatchList from './components/matches/MatchList';
import WelcomeModal from './components/common/WelcomeModal';
import { useMatchesStore } from './store/matches/matchesStore';

function App() {
  const setCurrentMMR = useMatchesStore(state => state.setCurrentMMR);
  const currentMMR = useMatchesStore(state => state.currentMMR);
  const matches = useMatchesStore(state => state.matches);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showTips, setShowTips] = useState(true);
  
  // Show modal if MMR is not set
  useEffect(() => {
    if (currentMMR === 0 && matches.length === 0) {
      const hasVisited = localStorage.getItem('hasVisitedBefore');
      if (!hasVisited) {
        setShowWelcomeModal(true);
      }
    }
  }, [currentMMR, matches.length]);

  const handleSetInitialMMR = (mmr: number) => {
    setCurrentMMR(mmr);
    setShowWelcomeModal(false);
    localStorage.setItem('hasVisitedBefore', 'true');
  };

  return (
    <>
      {showWelcomeModal && (
        <WelcomeModal onSubmit={handleSetInitialMMR} />
      )}
      <Layout>
        {/* Tips banner for new users */}
        {showTips && matches.length === 0 && (
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
        )}
        
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
      </Layout>
    </>
  );
}

export default App;