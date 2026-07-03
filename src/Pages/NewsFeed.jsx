import React, { useEffect, useState } from "react";
import NewsFeedItem from "../Components/NewsFeedItem";

const NewsFeed = ({ category = 'general', pageSize = 20, showSummarizer = false, country = 'us', language = 'en', fromDate = '' }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const apikey = import.meta.env.VITE_NEWS_API_KEY;
        const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&pageSize=${pageSize}&apiKey=${apikey}`;
        const res = await fetch(url);
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, pageSize, country, language]);

  if (loading) return <div className="p-6 card card-modern text-center">Loading...</div>;

  // If the summarizer is requested, show only the summarizer (nothing below its "Powered by" footer)
  if (showSummarizer) {
    return null;
  }

  if (!articles || articles.length === 0) return (
    <div className="p-6 card card-modern no-glow">No articles found.</div>
  );

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
          // Read only heading as requested
          const textToRead = `Article ${index + 1}: ${article.title}.`;
          const utterance = new SpeechSynthesisUtterance(textToRead);
          
          utterance.onstart = () => {
            setCurrentlyPlayingIndex(index);
          };
          
          // When the very last article finishes, reset the button state
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
    <div className="space-y-4">
      {/* Header and Play All Button */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-900/30">
        <h2 className="text-xl font-bold text-gray-200">Top Stories</h2>
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

      {[...articles]
        .filter(article => {
          if (!fromDate) return true;
          const articleDate = new Date(article.publishedAt).toISOString().split('T')[0];
          return articleDate >= fromDate;
        })
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .map((article, idx) => (
          <NewsFeedItem key={idx} article={article} category={category} isActive={currentlyPlayingIndex === idx} />
      ))}
    </div>
  );
};

export default NewsFeed;
