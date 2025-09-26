import React from 'react';
import { HEROES } from '../../features/matches/constants';

interface HeroIconProps {
  heroName: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}


// Create mapping based on hero position in alphabetical list
// Using exact 32px width for each icon without gaps
const HERO_ICON_DATA: Record<string, { x: number; index: number }> = {};
HEROES.forEach((hero, index) => {
  // Each icon is exactly 32px wide, positioned sequentially
  HERO_ICON_DATA[hero] = {
    x: index * 32, // Exact 32px spacing
    index: index
  };
});

const ICON_SIZES = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64
};

export const HeroIcon: React.FC<HeroIconProps> = ({ 
  heroName, 
  size = 'md', 
  className = '' 
}) => {
  const iconData = HERO_ICON_DATA[heroName];
  const iconSize = ICON_SIZES[size];
  
  // If hero not found in mapping, show fallback
  if (!iconData) {
    return (
      <div 
        className={`inline-flex items-center justify-center bg-gray-700 text-gray-400 rounded ${className}`}
        style={{ width: iconSize, height: iconSize, fontSize: iconSize * 0.4 }}
        title={heroName}
      >
        ?
      </div>
    );
  }

  // Calculate the background position more precisely
  // Total sprite width: 126 heroes * 32px = 4032px
  const totalSpriteWidth = 4032;
  const iconSourceSize = 32; // Each icon in sprite is 32px
  
  // For pixel-perfect positioning at different scales
  const scale = iconSize / iconSourceSize;
  
  // Use exact pixel positioning to prevent drift
  const backgroundPositionX = -(iconData.index * iconSourceSize * scale);
  
  return (
    <div 
      className={`inline-block rounded overflow-hidden ${className}`}
      style={{
        width: iconSize,
        height: iconSize,
        backgroundImage: 'url(/hero-icons-sprite.png)',
        backgroundPosition: `${backgroundPositionX}px 0`,
        backgroundSize: `${totalSpriteWidth * scale}px ${iconSourceSize * scale}px`,
        imageRendering: iconSize <= 32 ? 'pixelated' : 'auto',
        // Ensure no sub-pixel rendering issues
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
      title={heroName}
      aria-label={heroName}
    />
  );
};

// Helper component for hero selection with icon
export const HeroOption: React.FC<{ 
  heroName: string; 
  isFavorite?: boolean;
  isRecent?: boolean;
  winRate?: number;
  matchCount?: number;
  onClick?: () => void;
  className?: string;
}> = ({ 
  heroName, 
  isFavorite, 
  isRecent, 
  winRate, 
  matchCount,
  onClick, 
  className = '' 
}) => {
  return (
    <div 
      className={`flex items-center space-x-2 cursor-pointer hover:bg-gray-700 px-3 py-2 rounded transition-colors ${className}`}
      onClick={onClick}
    >
      <HeroIcon heroName={heroName} size="sm" />
      <span className="flex-1 text-gray-100">{heroName}</span>
      <div className="flex items-center gap-2 text-xs">
        {matchCount !== undefined && matchCount > 0 && (
          <span className="text-gray-400">{matchCount}</span>
        )}
        {winRate !== undefined && matchCount && matchCount > 0 && (
          <span className={`${winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
            {winRate.toFixed(0)}%
          </span>
        )}
        {isRecent && <span className="text-blue-400" title="Recently played">●</span>}
        {isFavorite && <span className="text-yellow-400" title="Favorite">⭐</span>}
      </div>
    </div>
  );
};

// Group heroes by attribute for better organization
export const HERO_ATTRIBUTES = {
  strength: [
    'Abaddon', 'Alchemist', 'Axe', 'Beastmaster', 'Brewmaster', 'Bristleback',
    'Centaur Warrunner', 'Chaos Knight', 'Clockwerk', 'Dawnbreaker', 'Doom',
    'Dragon Knight', 'Earth Spirit', 'Earthshaker', 'Elder Titan', 'Huskar',
    'Io', 'Kunkka', 'Legion Commander', 'Lifestealer', 'Lycan', 'Magnus',
    'Marci', 'Mars', 'Night Stalker', 'Ogre Magi', 'Omniknight', 'Primal Beast',
    'Pudge', 'Sand King', 'Slardar', 'Snapfire', 'Spirit Breaker', 'Sven',
    'Tidehunter', 'Timbersaw', 'Tiny', 'Treant Protector', 'Troll Warlord',
    'Tusk', 'Underlord', 'Undying', 'Wraith King'
  ],
  agility: [
    'Anti-Mage', 'Arc Warden', 'Bloodseeker', 'Bounty Hunter', 'Broodmother',
    'Clinkz', 'Drow Ranger', 'Ember Spirit', 'Faceless Void', 'Gyrocopter',
    'Hoodwink', 'Juggernaut', 'Kez', 'Luna', 'Medusa', 'Meepo', 'Mirana',
    'Monkey King', 'Morphling', 'Naga Siren', 'Nyx Assassin', 'Pangolier',
    'Phantom Assassin', 'Phantom Lancer', 'Razor', 'Riki', 'Shadow Fiend',
    'Slark', 'Sniper', 'Spectre', 'Templar Assassin', 'Terrorblade', 'Troll Warlord',
    'Ursa', 'Vengeful Spirit', 'Venomancer', 'Viper', 'Weaver'
  ],
  intelligence: [
    'Ancient Apparition', 'Bane', 'Batrider', 'Chen', 'Crystal Maiden',
    'Dark Seer', 'Dark Willow', 'Dazzle', 'Death Prophet', 'Disruptor',
    'Enchantress', 'Enigma', 'Grimstroke', 'Invoker', 'Jakiro',
    'Keeper of the Light', 'Leshrac', 'Lich', 'Lina', 'Lion', 'Lone Druid',
    'Muerta', "Nature's Prophet", 'Necrophos', 'Oracle', 'Outworld Destroyer',
    'Phoenix', 'Puck', 'Pugna', 'Queen of Pain', 'Ringmaster', 'Rubick',
    'Shadow Demon', 'Shadow Shaman', 'Silencer', 'Skywrath Mage', 'Storm Spirit',
    'Techies', 'Tinker', 'Visage', 'Void Spirit', 'Warlock', 'Windranger',
    'Winter Wyvern', 'Witch Doctor', 'Zeus'
  ],
  universal: [
    'Abaddon', 'Bane', 'Batrider', 'Beastmaster', 'Brewmaster', 'Broodmother',
    'Chen', 'Clockwerk', 'Dark Seer', 'Dark Willow', 'Dazzle', 'Enigma',
    'Io', 'Lone Druid', 'Lycan', 'Marci', 'Mirana', 'Nyx Assassin',
    'Pangolier', 'Phoenix', 'Sand King', 'Snapfire', 'Techies', 'Timbersaw',
    'Vengeful Spirit', 'Venomancer', 'Visage', 'Void Spirit', 'Windranger',
    'Winter Wyvern'
  ]
};

// Export list of all heroes for autocomplete/selection
export const ALL_HEROES = HEROES;

// Helper function to get hero icon position for external use
export const getHeroIconPosition = (heroName: string) => {
  return HERO_ICON_DATA[heroName] || null;
};

// Helper function to filter heroes by search query
export const filterHeroes = (query: string, heroes: string[] = ALL_HEROES): string[] => {
  const lowerQuery = query.toLowerCase();
  return heroes.filter(hero => 
    hero.toLowerCase().includes(lowerQuery) ||
    hero.toLowerCase().replace(/[^a-z]/g, '').includes(lowerQuery.replace(/[^a-z]/g, ''))
  );
};

// Helper hook for managing favorite heroes (can be integrated with store later)
export const useFavoriteHeroes = () => {
  const [favorites, setFavorites] = React.useState<Set<string>>(() => {
    const stored = localStorage.getItem('favoriteHeroes');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const toggleFavorite = (heroName: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(heroName)) {
        newFavorites.delete(heroName);
      } else {
        newFavorites.add(heroName);
      }
      localStorage.setItem('favoriteHeroes', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  return { favorites, toggleFavorite };
};