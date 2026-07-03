import React, { useEffect, useState } from "react";
import { getAnalyticsData } from "../utils/analytics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from "recharts";

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(getAnalyticsData());
  }, []);

  if (!data) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-900/30 p-6 animate-slide-up text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-gradient text-left">Reading Insights</h2>
        <div className="py-12 flex flex-col items-center">
          <span className="text-6xl mb-4">📊</span>
          <p className="text-gray-400 text-lg">No reading data found yet.</p>
          <p className="text-gray-500 text-sm mt-2">Start reading some articles to build your reading profile!</p>
        </div>
      </div>
    );
  }

  // Format data for Recharts
  const allCategories = ['general', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];
  const categoryData = allCategories.map(cat => ({
    name: cat,
    value: data.categories[cat] || 0
  })).sort((a, b) => b.value - a.value);
  
  const historyData = data.history.slice(-7); // last 7 days
  
  // Colors for Bar chart
  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308'];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-900/30 p-6 animate-slide-up">
      <h2 className="text-4xl md:text-5xl font-black mb-6 text-gradient">Reading Insights</h2>
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-900/20 border border-blue-800/40 p-4 rounded-xl text-center">
          <h3 className="text-blue-400 text-sm font-semibold mb-1 uppercase tracking-wider">Total Articles Read</h3>
          <p className="text-4xl font-bold text-gray-100">{data.totalReads}</p>
        </div>
        <div className="bg-cyan-900/20 border border-cyan-800/40 p-4 rounded-xl text-center">
          <h3 className="text-cyan-400 text-sm font-semibold mb-1 uppercase tracking-wider">Top Category</h3>
          <p className="text-2xl font-bold text-gray-100 mt-2 capitalize">{categoryData[0]?.name || 'N/A'}</p>
        </div>
        <div className="bg-purple-900/20 border border-purple-800/40 p-4 rounded-xl text-center">
          <h3 className="text-purple-400 text-sm font-semibold mb-1 uppercase tracking-wider">Active Days</h3>
          <p className="text-4xl font-bold text-gray-100">{data.history.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* History Chart */}
        <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
            <span>📈</span> Reading Activity (Last 7 Days)
          </h3>
          <div className="h-64 w-full">
            {historyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                  <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem' }} 
                    itemStyle={{ color: '#67e8f9' }} 
                  />
                  <Line type="monotone" dataKey="count" name="Articles Read" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No activity yet</div>
            )}
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
            <span>📚</span> Reads by Category
          </h3>
          <div className="h-64 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} className="capitalize" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#67e8f9', textTransform: 'capitalize' }}
                    cursor={{fill: '#374151', opacity: 0.4}}
                  />
                  <Bar dataKey="value" name="Reads" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No category data yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
