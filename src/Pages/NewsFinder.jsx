import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';
import NewsFeedItem from '../Components/NewsFeedItem';
import { useSearchParams } from 'react-router-dom';

const NewsFinder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || "";

  const [topic, setTopic] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [articles, setArticles] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      setTopic(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");
    setArticles([]);
    setHasSearched(true);

    try {
      const saved = JSON.parse(localStorage.getItem('newscloud_search_history') || '[]');
      const normalizedSaved = saved.map(item => typeof item === 'string' ? { query: item, time: Date.now() } : item);
      
      const newHistory = [
        { query: searchQuery, time: Date.now() }, 
        ...normalizedSaved.filter(item => item.query !== searchQuery)
      ].slice(0, 8);
      
      localStorage.setItem('newscloud_search_history', JSON.stringify(newHistory));
      window.dispatchEvent(new Event('search_history_updated'));
    } catch {
      // ignore localstorage errors
    }

    const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;

    try {
      const res = await axios.get(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&pageSize=20&apiKey=${newsApiKey}`
      );
      
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch news. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setSearchParams({ q: topic });
  };

  const handlePlayAll = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAll) {
        window.speechSynthesis.cancel();
        setIsPlayingAll(false);
        setCurrentlyPlayingIndex(null);
      } else {
        window.speechSynthesis.cancel(); // Clear any existing speech
        setIsPlayingAll(true);
        
        // Prevent GC by storing utterances globally
        window.__speechUtterances = [];
        
        articles.forEach((article, index) => {
          const textToRead = `Article ${index + 1}: ${article.title}.`;
          const utterance = new SpeechSynthesisUtterance(textToRead);
          
          utterance.onstart = () => {
            setCurrentlyPlayingIndex(index);
          };
          
          if (index === articles.length - 1) {
            utterance.onend = () => {
              setIsPlayingAll(false);
              setCurrentlyPlayingIndex(null);
            };
            utterance.onerror = () => {
              setIsPlayingAll(false);
              setCurrentlyPlayingIndex(null);
            };
          }
          
          window.__speechUtterances.push(utterance);
          window.speechSynthesis.speak(utterance);
        });
      }
    } else {
      alert("Sorry, your browser doesn't support text to speech!");
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-900/30 p-6 animate-slide-up">
      <h2 className="text-4xl md:text-5xl font-black mb-2 text-gradient">News Finder</h2>
      <p className="text-gray-300 mb-6">
        Search for any topic and get a live feed of the latest news articles.
      </p>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <div className="absolute left-4 text-gray-400">
            <FiSearch size={20} />
          </div>
          <input
            type="text"
            className="w-full bg-gray-800/80 border border-blue-900/50 rounded-full py-4 pl-12 pr-32 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-lg"
            placeholder="e.g., Space Exploration, Apple Events..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="absolute right-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium px-6 py-2 rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
            disabled={loading || !topic.trim()}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-center max-w-2xl mx-auto">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-medium">Hunting down the latest news...</p>
        </div>
      )}

      {/* Results */}
      {!loading && hasSearched && (
        <div className="space-y-4">
          {articles.length === 0 ? (
            <div className="text-center p-8 bg-gray-800/30 border border-gray-700 rounded-2xl">
              <span className="text-4xl block mb-2">📭</span>
              <p className="text-gray-400 text-lg">No articles found for "{topic}". Try a different search term.</p>
            </div>
          ) : (
            <>
              {/* Header and Play All Button */}
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-blue-900/30">
                <h2 className="text-xl font-bold text-gray-200">Search Results</h2>
                <button 
                  onClick={handlePlayAll}
                  className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-full font-semibold shadow-md transition-all ${
                    isPlayingAll 
                      ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30" 
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30"
                  }`}
                >
                  <span className="text-lg">{isPlayingAll ? "⏹️" : "▶️"}</span>
                  {isPlayingAll ? "Stop Reading" : "Play All"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {articles.map((article, idx) => (
                  <NewsFeedItem key={idx} article={article} isActive={currentlyPlayingIndex === idx} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsFinder;
