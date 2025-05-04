import React, { useMemo, useState } from 'react';
import { Match } from '../../features/matches/types';

interface HeroStatsProps {
  matches: Match[];
}

type SortKey = 'games' | 'winrate' | 'mmr';

const HeroStats: React.FC<HeroStatsProps> = ({ matches }) => {
  const [sortBy, setSortBy] = useState<SortKey>('games');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const heroStats = useMemo(() => {
    const stats: Record<string, { 
      games: number, 
      wins: number, 
      losses: number, 
      mmrChange: number,
      roleDistribution: Record<number, number> 
    }> = {};

    matches.forEach(match => {
      if (!stats[match.hero]) {
        stats[match.hero] = {
          games: 0,
          wins: 0,
          losses: 0,
          mmrChange: 0,
          roleDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        };
      }

      stats[match.hero].games += 1;
      stats[match.hero].mmrChange += match.mmrChange;
      
      if (match.result === 'win') {
        stats[match.hero].wins += 1;
      } else {
        stats[match.hero].losses += 1;
      }
      
      stats[match.hero].roleDistribution[match.role] += 1;
    });

    return Object.entries(stats).map(([hero, data]) => ({
      hero,
      games: data.games,
      wins: data.wins,
      losses: data.losses,
      mmrChange: data.mmrChange,
      winrate: data.games > 0 ? (data.wins / data.games) * 100 : 0,
      avgMmrChange: data.games > 0 ? data.mmrChange / data.games : 0,
      roleDistribution: data.roleDistribution,
      favoriteRole: Object.entries(data.roleDistribution)
        .sort((a, b) => b[1] - a[1])[0][0]
    }));
  }, [matches]);

  const sortedHeroStats = useMemo(() => {
    return [...heroStats].sort((a, b) => {
      let compareValue: number;
      
      switch (sortBy) {
        case 'games':
          compareValue = a.games - b.games;
          break;
        case 'winrate':
          compareValue = a.winrate - b.winrate;
          break;
        case 'mmr':
          compareValue = a.avgMmrChange - b.avgMmrChange;
          break;
        default:
          compareValue = 0;
      }
      
      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
  }, [heroStats, sortBy, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('desc');
    }
  };

  if (matches.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
        <p className="text-gray-400">No matches available to display hero statistics.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-dota-red">Hero Statistics</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2 px-3">Hero</th>
              <th 
                className={`text-right py-2 px-3 cursor-pointer ${sortBy === 'games' ? 'text-dota-red' : ''}`}
                onClick={() => handleSort('games')}
              >
                Games {sortBy === 'games' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={`text-right py-2 px-3 cursor-pointer ${sortBy === 'winrate' ? 'text-dota-red' : ''}`}
                onClick={() => handleSort('winrate')}
              >
                Winrate {sortBy === 'winrate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={`text-right py-2 px-3 cursor-pointer ${sortBy === 'mmr' ? 'text-dota-red' : ''}`}
                onClick={() => handleSort('mmr')}
              >
                Avg. MMR {sortBy === 'mmr' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-right py-2 px-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {sortedHeroStats.map(stat => (
              <tr key={stat.hero} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="py-2 px-3 font-medium">{stat.hero}</td>
                <td className="text-right py-2 px-3">{stat.games}</td>
                <td className="text-right py-2 px-3">
                  <span className={`font-medium ${stat.winrate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.winrate % 1 === 0 ? stat.winrate.toFixed(0) : stat.winrate.toFixed(1)}%
                  </span>
                  <span className="text-gray-400 text-xs ml-1">({stat.wins}-{stat.losses})</span>
                </td>
                <td className="text-right py-2 px-3">
                  <span className={stat.avgMmrChange > 0 ? 'text-green-400' : stat.avgMmrChange < 0 ? 'text-red-400' : 'text-gray-400'}>
                    {stat.avgMmrChange % 1 === 0 
                      ? (stat.avgMmrChange > 0 ? '+' : '') + stat.avgMmrChange.toFixed(0)
                      : (stat.avgMmrChange > 0 ? '+' : '') + stat.avgMmrChange.toFixed(1)
                    }
                  </span>
                </td>
                <td className="text-right py-2 px-3">
                  <span className="bg-gray-600 text-xs px-2 py-1 rounded">
                    {stat.favoriteRole}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeroStats;