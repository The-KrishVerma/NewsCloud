import React, { useEffect, useState } from "react";
import Summarize from "./Summarize";

const NewsFeed = ({ category = 'general', pageSize = 20, showSummarizer = false, country = 'us', language = 'en' }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const apikey = import.meta.env.VITE_NEWS_API_KEY;
    const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${language}&country=${country}&max=${pageSize}&apikey=${apikey}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      });
  }, [category, pageSize, country, language]);

  if (loading) return <div className="p-6 card card-modern">Loading...</div>;

  // If the summarizer is requested, show only the summarizer (nothing below its "Powered by" footer)
  if (showSummarizer) {
    return (
      <div className="mb-4">
        <Summarize />
      </div>
    );
  }

  if (!articles || articles.length === 0) return (
    <div className="p-6 card card-modern no-glow">No articles found.</div>
  );

  return (
    <div className="space-y-4">
      {articles.map((article, idx) => (
        <article key={idx} className="card-modern p-4 border border-blue-900/20 hover:blue-glow transition">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gradient text-lg font-bold hover:underline"
          >
            {article.title}
          </a>
          {article.source?.name && (
            <div className="text-xs text-gray-400 mt-2">{article.source.name}</div>
          )}
          {article.description && (
            <p className="text-gray-300 mt-2">{article.description}</p>
          )}
        </article>
      ))}
    </div>
  );
};

export default NewsFeed;
