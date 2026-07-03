import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FiSearch } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';

const CompareNews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || "";

  const [topic, setTopic] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comparisonResult, setComparisonResult] = useState("");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (initialQuery) {
      setTopic(initialQuery);
      performCompare(initialQuery);
    }
  }, [initialQuery]);

  const performCompare = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");
    setComparisonResult("");
    setArticles([]);

    const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
    const aiApiKey = import.meta.env.VITE_SMRY_KEY;

    try {
      const saved = JSON.parse(localStorage.getItem('newscloud_compare_history') || '[]');
      const normalizedSaved = saved.map(item => typeof item === 'string' ? { query: item, time: Date.now() } : item);
      
      const newHistory = [
        { query: searchQuery, time: Date.now() }, 
        ...normalizedSaved.filter(item => item.query !== searchQuery)
      ].slice(0, 8);
      
      localStorage.setItem('newscloud_compare_history', JSON.stringify(newHistory));
      window.dispatchEvent(new Event('compare_history_updated'));
    } catch {
      // ignore localstorage errors
    }

    try {
      // 1. Fetch articles from NewsAPI
      const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
      const res = await axios.get(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&pageSize=5&apiKey=${newsApiKey}`
      );
      
      const fetchedArticles = res.data.articles || [];
      setArticles(fetchedArticles);

      if (fetchedArticles.length < 2) {
        setError("Not enough articles found on this topic to perform a comparison.");
        setLoading(false);
        return;
      }

      // 2. Format articles for AI prompt
      const articlesContext = fetchedArticles.map((a, i) => `Source ${i+1}: ${a.source?.name || "Unknown"}
Title: ${a.title}
Description: ${a.description}
`).join("\\n\\n");

      const prompt = `You are an expert media analyst. Analyze the following news articles covering the topic: "${searchQuery}".
Compare how different publishers are covering this topic. 
Please highlight differing perspectives, political biases, and what specific facts each source emphasizes or omits.
Format your response in Markdown. Use a comparison table if possible, followed by a bulleted summary.

News Articles:
${articlesContext}`;

      // 3. Send to Gemini
      const aiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${aiApiKey}`,
        { contents: [{ role: "user", parts: [{ text: prompt }] }] },
        { headers: { "Content-Type": "application/json" } }
      );

      const aiText = aiRes.data.candidates?.[0]?.content?.parts?.[0]?.text;
      setComparisonResult(aiText);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch news or generate comparison. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setSearchParams({ q: topic });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-900/30 p-6 animate-slide-up">
      <h2 className="text-4xl md:text-5xl font-black mb-2 text-gradient">News Comparison</h2>
      <p className="text-gray-300 mb-6">
        Search for a topic and our AI will analyze how different news outlets are covering the story, highlighting varying perspectives and biases.
      </p>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <form onSubmit={handleCompare} className="relative flex items-center">
          <div className="absolute left-4 text-gray-400">
            <FiSearch size={20} />
          </div>
          <input
            type="text"
            className="w-full bg-gray-800/80 border border-blue-900/50 rounded-full py-4 pl-12 pr-32 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-lg"
            placeholder="e.g., Global Warming, Elections, Tech Regulation..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="absolute right-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium px-6 py-2 rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
            disabled={loading || !topic.trim()}
          >
            {loading ? "Analyzing..." : "Compare"}
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
          <p className="text-cyan-400 font-medium">Fetching articles and analyzing perspectives...</p>
        </div>
      )}

      {/* Results */}
      {!loading && comparisonResult && (
        <div className="space-y-10">
          {/* AI Comparison Report */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-900/50 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
              <span className="text-3xl">🤖</span>
              <h2 className="text-2xl font-bold text-white">AI Perspective Analysis</h2>
            </div>
            <div className="prose prose-invert prose-blue max-w-none prose-table:w-full prose-th:bg-gray-800 prose-td:border-gray-700">
              <ReactMarkdown>{comparisonResult}</ReactMarkdown>
            </div>
          </div>

          {/* Source Articles Grid */}
          <div>
            <h3 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
              <span className="text-cyan-400">📰</span> Sources Analyzed
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, idx) => (
                <a
                  key={idx}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20 transition-all group flex flex-col h-full"
                >
                  <div className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wide">
                    {article.source?.name || "Unknown Source"}
                  </div>
                  <h4 className="text-gray-100 font-semibold mb-3 group-hover:text-blue-400 transition-colors line-clamp-3">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-3 mt-auto">
                    {article.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareNews;
