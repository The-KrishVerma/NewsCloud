import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const CompareLeftSidebar = () => {
  const navigate = useNavigate();
  const comparisons = [
    { label: '🏛️ US Elections', query: 'US Elections' },
    { label: '🚗 EVs vs Gas Cars', query: 'Electric Vehicles' },
    { label: '📱 Apple vs Android', query: 'Smartphones' },
    { label: '🤖 AI Regulation', query: 'AI Regulation' },
  ];

  return (
    <div className="space-y-4 sticky top-20">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-900/30">
        <h3 className="font-bold text-base mb-4 text-blue-400 flex items-center gap-2">
          <span>⚖️</span> Trending Topics
        </h3>
        <div className="space-y-2">
          {comparisons.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/compare?q=${encodeURIComponent(item.query)}`)}
              className="w-full text-left px-3 py-2 bg-gray-700/30 hover:bg-gray-700/80 border border-gray-600/30 hover:border-blue-500/50 rounded-lg text-sm text-gray-300 hover:text-blue-300 transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CompareRightSidebar = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('newscloud_compare_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore localstorage errors
    }
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('compare_history_updated', loadHistory);
    return () => window.removeEventListener('compare_history_updated', loadHistory);
  }, []);

  const handleRemove = (e, queryToRemove) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove "${queryToRemove}" from your recent comparisons?`)) {
      const newHistory = history.filter(item => {
        const q = typeof item === 'string' ? item : item.query;
        return q !== queryToRemove;
      });
      localStorage.setItem('newscloud_compare_history', JSON.stringify(newHistory));
      setHistory(newHistory);
    }
  };

  return (
    <div className="space-y-1.5 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-900/30 h-fit sticky top-20">
      <h3 className="font-bold text-base mb-4 text-purple-400 flex items-center gap-2">
        <span>🕒</span> Recent Comparisons
      </h3>
      {history.length > 0 ? (
        <div className="space-y-2">
          {history.map((item, idx) => {
            const isString = typeof item === 'string';
            const query = isString ? item : item.query;
            const timeStr = isString || !item.time ? '' : new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={idx} className="w-full flex items-center bg-gray-700/30 hover:bg-gray-700/80 border border-gray-600/30 hover:border-purple-500/50 rounded-lg transition-all group">
                <button
                  onClick={() => navigate(`/compare?q=${encodeURIComponent(query)}`)}
                  className="flex-1 flex items-center justify-between text-left px-3 py-2 text-sm text-gray-300 group-hover:text-purple-300 truncate"
                >
                  <span className="truncate mr-2">{query}</span>
                  {timeStr && <span className="text-[10px] text-gray-500 whitespace-nowrap">{timeStr}</span>}
                </button>
                <button
                  onClick={(e) => handleRemove(e, query)}
                  className="px-3 py-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  title="Remove from history"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic text-center py-4">No recent comparisons.</p>
      )}
    </div>
  );
};
