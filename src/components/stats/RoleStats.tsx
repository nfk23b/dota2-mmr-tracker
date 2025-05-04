import React from 'react';
import { Match } from '../../features/matches/types';
import { ROLE_LABELS } from '../../features/matches/constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  const chartData = roleStats.sort((a, b) => a.roleNumber - b.roleNumber);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-dota-red">Role Performance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">Winrate by Role</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="role" stroke="#999" />
                <YAxis stroke="#999" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                  formatter={(value: any) => {
                    const numValue = Number(value);
                    return [
                      `${numValue % 1 === 0 ? numValue.toFixed(0) : numValue.toFixed(1)}%`, 
                      'Winrate'
                    ];
                  }}
                />
                <Bar dataKey="winrate" name="Winrate" fill="#FF4B4B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">Average MMR Change by Role</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="role" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                  formatter={(value: any) => {
                    const numValue = Number(value);
                    return [
                      `${numValue % 1 === 0 ? numValue.toFixed(0) : numValue.toFixed(1)}`, 
                      'Avg MMR'
                    ];
                  }}
                />
                <Bar 
                  dataKey="avgMmr" 
                  name="Avg MMR" 
                  fill="#4CAF50" 
                  // @ts-ignore
                  cellConfig={{
                    fill: (props: any) => {
                      const { payload } = props;
                      return payload.avgMmr >= 0 ? '#4CAF50' : '#F44336';
                    }
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3">Role</th>
                <th className="text-right py-2 px-3">Games</th>
                <th className="text-right py-2 px-3">Winrate</th>
                <th className="text-right py-2 px-3">Record</th>
                <th className="text-right py-2 px-3">Total MMR</th>
                <th className="text-right py-2 px-3">Avg MMR</th>
              </tr>
            </thead>
            <tbody>
              {roleStats.sort((a, b) => a.roleNumber - b.roleNumber).map(stat => (
                <tr key={stat.role} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-2 px-3 font-medium">{stat.role}</td>
                  <td className="text-right py-2 px-3">{stat.totalGames}</td>
                  <td className="text-right py-2 px-3">
                    <span className={`font-medium ${stat.winrate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.winrate % 1 === 0 ? stat.winrate.toFixed(0) : stat.winrate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right py-2 px-3 text-gray-300">
                    {stat.wins}-{stat.losses}
                  </td>
                  <td className="text-right py-2 px-3">
                    <span className={stat.totalMmr > 0 ? 'text-green-400' : stat.totalMmr < 0 ? 'text-red-400' : 'text-gray-300'}>
                      {stat.totalMmr > 0 ? '+' : ''}{stat.totalMmr}
                    </span>
                  </td>
                  <td className="text-right py-2 px-3">
                    <span className={stat.avgMmr > 0 ? 'text-green-400' : stat.avgMmr < 0 ? 'text-red-400' : 'text-gray-300'}>
                      {stat.avgMmr > 0 ? '+' : ''}
                      {stat.avgMmr % 1 === 0 ? stat.avgMmr.toFixed(0) : stat.avgMmr.toFixed(1)}
                    </span>
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