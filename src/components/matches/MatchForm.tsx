import React, { useState, useRef, useEffect } from 'react';
import { useMatchesStore } from '../../store/matches/matchesStore';
import { differenceInHours } from 'date-fns';
import { 
  GAME_DIFFICULTIES, 
  GAME_DIFFICULTY_LABELS, 
  ROLES, 
  ROLE_LABELS, 
  MOODS, 
  GAME_RESULT, 
  GAME_RESULT_LABELS,
  HEROES 
} from '../../features/matches/constants';
import type { Mood } from '../../features/matches/types';

const MatchForm: React.FC = () => {
  const matches = useMatchesStore(state => state.matches);
  const addMatch = useMatchesStore(state => state.addMatch);

  const [gameDifficulty, setGameDifficulty] = useState('');
  const [showAllHeroes, setShowAllHeroes] = useState(false);
  const [hero, setHero] = useState('');
  const [filteredHeroes, setFilteredHeroes] = useState<Array<typeof HEROES[number]>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [role, setRole] = useState<number | ''>('');
  const [mmrChange, setMmrChange] = useState<number | ''>('');
  const [gameType, setGameType] = useState('');
  const [isTokenGame, setIsTokenGame] = useState(false);
  const [result, setResult] = useState('');
  const [moodStart, setMoodStart] = useState('');
  const [moodEnd, setMoodEnd] = useState('');
  const [comment, setComment] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const heroInputRef = useRef<HTMLInputElement>(null);
  
  // Filter heroes based on input
  useEffect(() => {
    if (showAllHeroes && hero.trim() === '') {
      setFilteredHeroes([...HEROES]);
      return;
    }
    
    if (hero.trim() === '') {
      setFilteredHeroes([]);
      return;
    }
    
    const filtered = HEROES.filter(h => 
      h.toLowerCase().includes(hero.toLowerCase())
    ).slice(0, 5); 
    
    setFilteredHeroes([...filtered]); 
  }, [hero, showAllHeroes]);
  
  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.hero-suggestion') && target !== heroInputRef.current) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Setting the mood
  useEffect(() => {
    if (matches.length > 0) {
      const sortedMatches = [...matches].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const lastMatch = sortedMatches[0];
      
      const hoursSinceLastMatch = differenceInHours(
        new Date(),
        new Date(lastMatch.date)
      );
      
      if (
        lastMatch && 
        !moodStart && 
        !hero && 
        !role && 
        mmrChange === '' &&
        hoursSinceLastMatch < 2
      ) {
        setMoodStart(lastMatch.moodEnd);
      }
    }
  }, [matches, moodStart, hero, role, mmrChange]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!hero.trim()) newErrors.hero = 'Hero is required';
    if (!role) newErrors.role = 'Role is required';
    if (mmrChange === '') newErrors.mmrChange = 'MMR change is required';
    if (!gameDifficulty) newErrors.gameDifficulty = 'Game difficulty is required';
    if (!result) newErrors.result = 'Result is required';
    if (!moodStart) newErrors.moodStart = 'Start mood is required';
    if (!moodEnd) newErrors.moodEnd = 'End mood is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const endMood = moodEnd;
    const currentTime = new Date();

    // Add match
    addMatch({
      hero,
      role: Number(role) as 1 | 2 | 3 | 4 | 5,
      mmrChange: Number(mmrChange),
      gameDifficulty: gameDifficulty as any,
      isTokenGame,
      result: result as 'win' | 'loss',
      moodStart: moodStart as Mood,
      moodEnd: moodEnd as Mood,
      comment: comment || undefined
    });

    // Reset form
    setHero('');
    setFilteredHeroes([]);
    setRole('');
    setMmrChange('');
    setGameType('');
    setIsTokenGame(false);
    setResult('');
    setMoodStart(endMood);
    setMoodEnd('');
    setComment('');
    setErrors({});

    sessionStorage.setItem('lastMatchAddedTime', currentTime.toISOString());
  };
  
  useEffect(() => {
    const lastAddedTimeStr = sessionStorage.getItem('lastMatchAddedTime');
    
    if (lastAddedTimeStr) {
      const lastAddedTime = new Date(lastAddedTimeStr);
      const hoursSinceLastAdded = differenceInHours(new Date(), lastAddedTime);
      
      if (hoursSinceLastAdded >= 2) {
        setMoodStart('');
      }
    }
  }, []);

  // Set result based on MMR change
  const handleMmrChangeUpdate = (value: number | '') => {
    setMmrChange(value);
    
    if (value !== '' && value !== 0) {
      setResult(value > 0 ? GAME_RESULT.WIN : GAME_RESULT.LOSS);
    }
  };

  const handleHeroSelect = (selectedHero: string) => {
    console.log("Hero selected:", selectedHero); 
    setHero(selectedHero);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-dota-red">Add New Match</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hero with autocomplete */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1 text-gray-300">Hero</label>
          <input
            ref={heroInputRef}
            type="text"
            value={hero}
            onChange={(e) => {
              setHero(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setShowSuggestions(true);
              setShowAllHeroes(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setShowAllHeroes(false);
              }, 200);
            }}
            className={`w-full bg-gray-700 border ${errors.hero ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
            placeholder="Enter hero name"
          />
          {errors.hero && <p className="text-red-500 text-xs mt-1">{errors.hero}</p>}
          
          {/* Hero suggestions */}
          {showSuggestions && filteredHeroes.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredHeroes.map(heroName => (
                <div
                  key={heroName}
                  className="hero-suggestion px-3 py-2 hover:bg-gray-600 cursor-pointer"
                  onClick={() => {
                    handleHeroSelect(heroName);
                  }}
                >
                  {heroName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Row - Role and MMR */}
        <div className="grid grid-cols-2 gap-4">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(Number(e.target.value) || '')}
              className={`w-full bg-gray-700 border ${errors.role ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
            >
              <option value="">Select role</option>
              {ROLES.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>

          {/* MMR Change */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">MMR Change</label>
            <input
              type="number"
              value={mmrChange}
              onChange={(e) => handleMmrChangeUpdate(e.target.value ? Number(e.target.value) : '')}
              className={`w-full bg-gray-700 border ${errors.mmrChange ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
              placeholder="+30 or -30"
            />
            {errors.mmrChange && <p className="text-red-500 text-xs mt-1">{errors.mmrChange}</p>}
          </div>
        </div>

        {/* Game Difficulty and Token Game */}
        <div className="grid grid-cols-2 gap-4">
          {/* Game Difficulty */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Game Difficulty</label>
            <select
              value={gameDifficulty}
              onChange={(e) => setGameDifficulty(e.target.value)}
              className={`w-full bg-gray-700 border ${errors.gameDifficulty ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
            >
              <option value="">Select difficulty</option>
              {Object.values(GAME_DIFFICULTIES).map(difficulty => (
                <option key={difficulty} value={difficulty}>{GAME_DIFFICULTY_LABELS[difficulty]}</option>
              ))}
            </select>
            {errors.gameDifficulty && <p className="text-red-500 text-xs mt-1">{errors.gameDifficulty}</p>}
          </div>

          {/* Token Game */}
          <div className="flex items-center h-full pt-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isTokenGame}
                onChange={(e) => setIsTokenGame(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-dota-red rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dota-red"></div>
              <span className="ms-3 text-sm font-medium text-gray-300">Token Game</span>
            </label>
          </div>
        </div>

        {/* Result */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Result</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value={GAME_RESULT.WIN}
                checked={result === GAME_RESULT.WIN}
                onChange={(e) => setResult(e.target.value)}
                className="form-radio text-green-500 h-5 w-5"
              />
              <span className="ml-2 text-gray-300">{GAME_RESULT_LABELS.win}</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value={GAME_RESULT.LOSS}
                checked={result === GAME_RESULT.LOSS}
                onChange={(e) => setResult(e.target.value)}
                className="form-radio text-red-500 h-5 w-5"
              />
              <span className="ml-2 text-gray-300">{GAME_RESULT_LABELS.loss}</span>
            </label>
          </div>
          {errors.result && <p className="text-red-500 text-xs mt-1">{errors.result}</p>}
        </div>

        {/* Mood Start and End */}
        <div className="grid grid-cols-2 gap-4">
          {/* Mood Start */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Mood (Start)</label>
            <select
              value={moodStart}
              onChange={(e) => setMoodStart(e.target.value)}
              className={`w-full bg-gray-700 border ${errors.moodStart ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
            >
              <option value="">Select mood</option>
              {Object.entries(MOODS).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {moodStart && (
              <div className="mt-1 flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: MOODS[moodStart as Mood]?.color }}
                ></div>
                <span className="text-xs">{MOODS[moodStart as Mood]?.label}</span>
              </div>
            )}
            {errors.moodStart && <p className="text-red-500 text-xs mt-1">{errors.moodStart}</p>}
          </div>

          {/* Mood End */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Mood (End)</label>
            <select
              value={moodEnd}
              onChange={(e) => setMoodEnd(e.target.value)}
              className={`w-full bg-gray-700 border ${errors.moodEnd ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
            >
              <option value="">Select mood</option>
              {Object.entries(MOODS).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {moodEnd && (
              <div className="mt-1 flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: MOODS[moodEnd as Mood]?.color }}
                ></div>
                <span className="text-xs">{MOODS[moodEnd as Mood]?.label}</span>
              </div>
            )}
            {errors.moodEnd && <p className="text-red-500 text-xs mt-1">{errors.moodEnd}</p>}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Comment (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red"
            rows={3}
            placeholder="Any comments about this match?"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-dota-red hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Add Match
        </button>
      </form>
    </div>
  );
};

export default MatchForm;