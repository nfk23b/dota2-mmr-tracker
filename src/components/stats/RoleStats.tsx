import React from 'react';
import { Match } from '../../features/matches/types';
import { ROLE_LABELS } from '../../features/matches/constants';

interface RoleStatsProps {
  matches: Match[];
}

const RoleStats: React.FC<RoleStatsProps> = ({ matches }) => {
  if (matches.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
        <p className="text-gray-400">No matches available to display role statistics.</p>
      </div>
    );
  }

  const roleStats = Object.entries(ROLE_LABELS).map(([roleNum, label]) => {
    const role = Number(roleNum);
    const roleMatches = matches.filter(match => match.role === role);
    const wins = roleMatches.filter(match => match.result === 'win').length;
    const losses = roleMatches.filter(match => match.result === 'loss').length;
    const totalGames = roleMatches.length;
    const winrate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
    const totalMmr = roleMatches.reduce((sum, match) => sum + match.mmrChange, 0);
    const avgMmr = totalGames > 0 ? totalMmr / totalGames : 0;
    
    return {
      role: label,
      roleNumber: role,
      totalGames,
      wins,
      losses,
      winrate,
      totalMmr,
      avgMmr
    };
  }).filter(stat => stat.totalGames > 0);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-dota-red">Role Performance</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Best Role (Winrate)</h3>
          <div className="text-xl font-bold text-green-400">
            {roleStats.sort((a, b) => b.winrate - a.winrate)[0]?.role || 'None'}
          </div>
          <div className="text-sm text-gray-300">
            {roleStats.sort((a, b) => b.winrate - a.winrate)[0]?.winrate.toFixed(1)}% WR
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Best Role (MMR)</h3>
          <div className="text-xl font-bold text-blue-400">
            {roleStats.sort((a, b) => b.avgMmr - a.avgMmr)[0]?.role || 'None'}
          </div>
          <div className="text-sm text-gray-300">
            {roleStats.sort((a, b) => b.avgMmr - a.avgMmr)[0]?.avgMmr >= 0 ? '+' : ''}
            {roleStats.sort((a, b) => b.avgMmr - a.avgMmr)[0]?.avgMmr.toFixed(1)} avg
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Most Played</h3>
          <div className="text-xl font-bold text-purple-400">
            {roleStats.sort((a, b) => b.totalGames - a.totalGames)[0]?.role || 'None'}
          </div>
          <div className="text-sm text-gray-300">
            {roleStats.sort((a, b) => b.totalGames - a.totalGames)[0]?.totalGames} games
          </div>
        </div>
      </div>
      
      {/* Detailed Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Detailed Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-right py-3 px-4">Games</th>
                <th className="text-right py-3 px-4">Winrate</th>
                <th className="text-right py-3 px-4">Record</th>
                <th className="text-right py-3 px-4">Total MMR</th>
                <th className="text-right py-3 px-4">Avg MMR</th>
                <th className="text-right py-3 px-4">Performance</th>
              </tr>
            </thead>
            <tbody>
              {roleStats.sort((a, b) => a.roleNumber - b.roleNumber).map(stat => (
                <tr key={stat.role} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-4 font-medium">{stat.role}</td>
                  <td className="text-right py-3 px-4">{stat.totalGames}</td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium px-2 py-1 rounded ${
                      stat.winrate >= 60 ? 'bg-green-900 text-green-400' :
                      stat.winrate >= 50 ? 'bg-yellow-900 text-yellow-400' :
                      'bg-red-900 text-red-400'
                    }`}>
                      {stat.winrate % 1 === 0 ? stat.winrate.toFixed(0) : stat.winrate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-300">
                    <span className="text-green-400">{stat.wins}</span>-<span className="text-red-400">{stat.losses}</span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium ${stat.totalMmr > 0 ? 'text-green-400' : stat.totalMmr < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                      {stat.totalMmr > 0 ? '+' : ''}{stat.totalMmr}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium ${stat.avgMmr > 0 ? 'text-green-400' : stat.avgMmr < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                      {stat.avgMmr > 0 ? '+' : ''}
                      {stat.avgMmr % 1 === 0 ? stat.avgMmr.toFixed(0) : stat.avgMmr.toFixed(1)}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end">
                      <div className="w-16 bg-gray-600 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            stat.winrate >= 60 ? 'bg-green-400' :
                            stat.winrate >= 50 ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`}
                          style={{ width: `${Math.min(100, stat.winrate)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8">
                        {stat.winrate.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleStats;