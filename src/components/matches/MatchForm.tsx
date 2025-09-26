import React, { useState, useRef, useEffect } from 'react';
import { useMatchesStore } from '../../store/matches/matchesStore';
import { useSettingsStore } from '../../store/settings/settingsStore';
import { differenceInHours } from 'date-fns';
import { HeroIcon } from '../ui/HeroIcon';
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
  
  // Get favorite heroes from settings
  const favoriteHeroes = useSettingsStore(state => state.settings.favoriteHeroes);

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
  const [showMmrPresets, setShowMmrPresets] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const heroInputRef = useRef<HTMLInputElement>(null);
  
  const mmrPresets = [
    { value: 30, label: '+30' },
    { value: 25, label: '+25' },
    { value: 20, label: '+20' },
    { value: 0, label: '0' },
    { value: -20, label: '-20' },
    { value: -25, label: '-25' },
    { value: -30, label: '-30' }
  ];

  // Enhanced hero filtering with favorites priority
  useEffect(() => {
    if (showAllHeroes && hero.trim() === '') {
      // Show favorites first, then all other heroes
      const validFavorites = favoriteHeroes.filter(h => HEROES.includes(h as typeof HEROES[number])) as Array<typeof HEROES[number]>;
      const otherHeroes = HEROES.filter(h => !favoriteHeroes.includes(h));
      setFilteredHeroes([...validFavorites, ...otherHeroes]);
      return;
    }
    
    if (hero.trim() === '') {
      setFilteredHeroes([]);
      return;
    }
    
    // Filter heroes based on search, but prioritize favorites
    const searchTerm = hero.toLowerCase();
    const validFavorites = favoriteHeroes.filter(h => HEROES.includes(h as typeof HEROES[number])) as Array<typeof HEROES[number]>;
    const favoriteMatches = validFavorites.filter(h => 
      h.toLowerCase().includes(searchTerm)
    );
    const otherMatches = HEROES.filter(h => 
      h.toLowerCase().includes(searchTerm) && !favoriteHeroes.includes(h)
    );
    
    // Combine with favorites first, limit to 10 total
    const combined = [...favoriteMatches, ...otherMatches].slice(0, 10);
    setFilteredHeroes(combined);
  }, [hero, showAllHeroes, favoriteHeroes]);
  
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
      gameDifficulty: GAME_DIFFICULTIES[gameDifficulty as keyof typeof GAME_DIFFICULTIES],
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isInput = target instanceof HTMLInputElement;
      const isNumberInput = isInput && target.type === 'number';
      
      if (!target.closest('.mmr-presets') && !isNumberInput) {
        setShowMmrPresets(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
        {/* Hero with autocomplete and favorites */}
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
          
          {/* Enhanced hero suggestions with icons and favorites */}
          {showSuggestions && filteredHeroes.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-80 overflow-y-auto">
              {/* Show favorites section if we have any and no search term */}
              {favoriteHeroes.length > 0 && hero.trim() === '' && (
                <>
                  <div className="px-3 py-2 bg-gray-600 text-gray-300 text-xs font-medium border-b border-gray-500 flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    Favorite Heroes
                  </div>
                  {favoriteHeroes.map(heroName => (
                    <div
                      key={`fav-${heroName}`}
                      className="hero-suggestion px-3 py-2 hover:bg-gray-600 cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        handleHeroSelect(heroName);
                      }}
                    >
                      <HeroIcon heroName={heroName} size="md"/>
                      <span className="flex-1">{heroName}</span>
                      <span className="text-yellow-400">⭐</span>
                    </div>
                  ))}
                  {HEROES.filter(h => !favoriteHeroes.includes(h)).length > 0 && (
                    <div className="px-3 py-2 bg-gray-600 text-gray-300 text-xs font-medium border-b border-gray-500">
                      All Heroes
                    </div>
                  )}
                </>
              )}
              
              {/* Show filtered results with icons */}
              {filteredHeroes.map(heroName => {
                // Skip favorites in the main list if we're showing them separately
                if (hero.trim() === '' && favoriteHeroes.includes(heroName)) {
                  return null;
                }
                
                const isFavorite = favoriteHeroes.includes(heroName);
                
                return (
                  <div
                    key={heroName}
                    className="hero-suggestion px-3 py-2 hover:bg-gray-600 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      handleHeroSelect(heroName);
                    }}
                  >
                    <HeroIcon heroName={heroName} size="md" />
                    <span className="flex-1">{heroName}</span>
                    {isFavorite && <span className="text-yellow-400">⭐</span>}
                  </div>
                );
              })}
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
            <div className="relative">
              <input
                type="number"
                value={mmrChange}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : '';
                  handleMmrChangeUpdate(value);
                }}
                onFocus={() => setShowMmrPresets(true)}
                className={`w-full bg-gray-700 border ${errors.mmrChange ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
                placeholder="+30 or -30"
              />
              {showMmrPresets && (
                <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg overflow-hidden mmr-presets">
                  <div className="grid grid-cols-4">
                    {mmrPresets
                      .filter(preset => preset.value >= 0)
                      .map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => {
                            handleMmrChangeUpdate(preset.value);
                            setShowMmrPresets(false);
                          }}
                          className={`px-3 py-2 text-center hover:bg-gray-600 ${
                            preset.value > 0 
                              ? 'text-green-400' 
                              : 'text-gray-300'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                  </div>
                  <div className="grid grid-cols-4">
                    {mmrPresets
                      .filter(preset => preset.value < 0)
                      .map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => {
                            handleMmrChangeUpdate(preset.value);
                            setShowMmrPresets(false);
                          }}
                          className="px-3 py-2 text-center hover:bg-gray-600 text-red-400"
                        >
                          {preset.label}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
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