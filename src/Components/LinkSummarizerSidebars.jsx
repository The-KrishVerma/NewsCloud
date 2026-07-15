import React, { useState, useEffect } from 'react';
import { FiLink, FiZap, FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const LinkSummarizerLeftSidebar = () => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-900/30 animate-fade-in shadow-lg sticky top-24">
    <h3 className="font-bold text-lg mb-3 text-cyan-400 flex items-center gap-2">
      <FiZap /> Quick Tips
    </h3>
    <ul className="space-y-3 text-sm text-gray-300">
      <li className="flex gap-2">
        <span className="text-blue-400 mt-0.5">•</span>
        <span>Works perfectly with most major news publishers and technical blogs.</span>
      </li>
      <li className="flex gap-2">
        <span className="text-blue-400 mt-0.5">•</span>
        <span>Automatically bypasses ad banners and menus to extract pure article text.</span>
      </li>
      <li className="flex gap-2">
        <span className="text-blue-400 mt-0.5">•</span>
        <span>Powered by Gemini AI for highly accurate, lightning-fast summaries.</span>
      </li>
    </ul>
  </div>
);

export const LinkSummarizerRightSidebar = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('newscloud_summarizer_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore localstorage errors
    }
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('summarizer_history_updated', loadHistory);
    return () => window.removeEventListener('summarizer_history_updated', loadHistory);
  }, []);

  const handleRemove = (e, urlToRemove) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove this URL from your history?`)) {
      const newHistory = history.filter(item => item.url !== urlToRemove);
      localStorage.setItem('newscloud_summarizer_history', JSON.stringify(newHistory));
      setHistory(newHistory);
    }
  };

  return (
    <div className="space-y-1.5 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-900/30 h-fit sticky top-24 shadow-lg animate-fade-in">
      <h3 className="font-bold text-base mb-4 text-cyan-400 flex items-center gap-2">
        <span>🕒</span> Recent Summaries
      </h3>
      {history.length > 0 ? (
        <div className="space-y-2">
          {history.map((item, idx) => {
            const timeStr = !item.time ? '' : new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Format URL to be more readable
            let displayUrl = item.url;
            try {
              const urlObj = new URL(item.url);
              displayUrl = urlObj.hostname.replace('www.', '') + '...';
            } catch (e) {
              // ignore
            }

            return (
              <div key={idx} className="w-full flex items-center bg-gray-700/30 hover:bg-gray-700/80 border border-gray-600/30 hover:border-cyan-500/50 rounded-lg transition-all group">
                <button
                  onClick={() => navigate(`/link-summarizer?url=${encodeURIComponent(item.url)}`)}
                  className="flex-1 flex flex-col items-start justify-center text-left px-3 py-2 text-sm text-gray-300 group-hover:text-cyan-300 truncate"
                  title={item.url}
                >
                  <span className="truncate w-full font-medium">{displayUrl}</span>
                  {timeStr && <span className="text-[10px] text-gray-500">{timeStr}</span>}
                </button>
                <button
                  onClick={(e) => handleRemove(e, item.url)}
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
        <p className="text-sm text-gray-500 italic text-center py-4">No recent summaries.</p>
      )}
    </div>
  );
};
