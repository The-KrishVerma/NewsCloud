import React, { useState } from "react";
import axios from "axios";
import { logArticleRead } from "../utils/analytics";

const NewsFeedItem = ({ article, category = "general", isActive = false }) => {
  const [biasData, setBiasData] = useState(null);
  const [loadingBias, setLoadingBias] = useState(false);
  
  const [fakeNewsData, setFakeNewsData] = useState(null);
  const [loadingFakeNews, setLoadingFakeNews] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [error, setError] = useState("");

  const handleListen = () => {
    logArticleRead(category);
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        const textToRead = `${article.title}. ${article.description || ""}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        // Optional: improve voice if needed, but default is usually fine
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    } else {
      alert("Sorry, your browser doesn't support text to speech!");
    }
  };

  const handleAnalyzeBias = async () => {
    setLoadingBias(true);
    setError("");
    const apiUrl = import.meta.env.VITE_SMRY_KEY;
    
    const prompt = `Analyze the political bias and sensationalism of the following news article. 
Title: ${article.title}
Description: ${article.description || "N/A"}
Source: ${article.source?.name || "N/A"}

Please respond in JSON format with exactly two fields:
{
  "classification": "One of: Left-Leaning, Center-Left, Neutral, Center-Right, Right-Leaning, or Sensationalist",
  "explanation": "A short 1-2 sentence explanation of why you gave this bias classification."
}`;

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiUrl}`,
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        },
        { headers: { "Content-Type": "application/json" } }
      );
      
      const responseText = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsedData = JSON.parse(responseText);
      setBiasData(parsedData);
    } catch (err) {
      console.error("Failed to analyze bias", err);
      if (err.response && err.response.status === 429) {
        setError("Rate limit exceeded. Please wait a minute before analyzing another article.");
      } else {
        setError("Failed to analyze bias. Please try again.");
      }
    } finally {
      setLoadingBias(false);
    }
  };

  const handleVerifyFakeNews = async () => {
    setLoadingFakeNews(true);
    setError("");
    const apiUrl = import.meta.env.VITE_SMRY_KEY;
    
    const prompt = `Analyze the fake news probability of the following news article. 
Title: ${article.title}
Description: ${article.description || "N/A"}
Source: ${article.source?.name || "N/A"}

Please respond in JSON format with exactly two fields:
{
  "fake_news_probability": "An integer between 0 and 100 representing the estimated percentage probability that this is fake/misleading news.",
  "fake_news_explanation": "A short 1-2 sentence explanation of why you assigned this probability."
}`;

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiUrl}`,
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        },
        { headers: { "Content-Type": "application/json" } }
      );
      
      const responseText = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsedData = JSON.parse(responseText);
      setFakeNewsData(parsedData);
    } catch (err) {
      console.error("Failed to verify article", err);
      if (err.response && err.response.status === 429) {
        setError("Rate limit exceeded. Please wait a minute before verifying another article.");
      } else {
        setError("Failed to verify article. Please try again.");
      }
    } finally {
      setLoadingFakeNews(false);
    }
  };

  const getBadgeColor = (classification) => {
    const cls = (classification || "").toLowerCase();
    if (cls.includes("left")) return "bg-blue-500/20 text-blue-300 border-blue-500/50";
    if (cls.includes("right")) return "bg-red-500/20 text-red-300 border-red-500/50";
    if (cls.includes("neutral")) return "bg-green-500/20 text-green-300 border-green-500/50";
    if (cls.includes("sensationalist") || cls.includes("sensational")) return "bg-orange-500/20 text-orange-300 border-orange-500/50";
    return "bg-gray-500/20 text-gray-300 border-gray-500/50";
  };

  const getProbabilityColor = (prob) => {
    if (prob < 20) return "text-green-400";
    if (prob < 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <article className={`card-modern p-4 border transition-all duration-300 flex flex-col relative ${isActive ? 'border-cyan-400 ring-2 ring-cyan-500/50 shadow-cyan-500/30 shadow-lg scale-[1.02] ml-6' : 'border-blue-900/20 hover:blue-glow'}`}>
      
      {/* Pointer/Indicator */}
      {isActive && (
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex items-center justify-center animate-pulse">
          <span className="text-cyan-400 text-3xl drop-shadow-md">👉</span>
        </div>
      )}

      <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={() => logArticleRead(category)} className={`text-lg font-bold hover:underline ${isActive ? 'text-cyan-300' : 'text-gradient'}`}>
        {article.title}
      </a>
      {article.source?.name && (
        <div className="text-xs text-gray-400 mt-2">{article.source.name}</div>
      )}
      {article.description && (
        <p className="text-gray-300 mt-2 mb-4">{article.description}</p>
      )}

      {/* Buttons Section */}
      <div className="mt-auto pt-4 border-t border-blue-900/30 flex flex-wrap gap-3">
        <button 
          onClick={handleListen}
          className={`flex items-center gap-2 text-xs font-medium transition-colors px-3 py-1.5 rounded-full border ${
            isPlaying 
              ? "text-red-400 bg-red-950/30 border-red-800/50 hover:text-red-300 hover:bg-red-900/40" 
              : "text-emerald-400 bg-emerald-950/30 border-emerald-800/50 hover:text-emerald-300 hover:bg-emerald-900/40"
          }`}
        >
          <span>{isPlaying ? "⏹️" : "🎧"}</span> {isPlaying ? "Stop" : "Listen"}
        </button>

        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={() => logArticleRead(category)}
          className="flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors bg-blue-950/30 hover:bg-blue-900/40 px-3 py-1.5 rounded-full border border-blue-800/50"
        >
          <span>📖</span> Read
        </a>

        {!biasData && !loadingBias && (
          <button 
            onClick={handleAnalyzeBias}
            className="flex items-center gap-2 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-950/30 hover:bg-cyan-900/40 px-3 py-1.5 rounded-full border border-cyan-800/50"
          >
            <span>⚖️</span> Analyze Bias
          </button>
        )}
        
        {loadingBias && (
          <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-1.5">
            <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            Analyzing Bias...
          </div>
        )}

        {!fakeNewsData && !loadingFakeNews && (
          <button 
            onClick={handleVerifyFakeNews}
            className="flex items-center gap-2 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors bg-purple-950/30 hover:bg-purple-900/40 px-3 py-1.5 rounded-full border border-purple-800/50"
          >
            <span>🤖</span> AI Verify
          </button>
        )}
        
        {loadingFakeNews && (
          <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-1.5">
            <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            Verifying...
          </div>
        )}
      </div>

      {error && (
        <div className="text-xs text-red-400 mt-3">{error}</div>
      )}

      {/* Results Section */}
      {(biasData || fakeNewsData) && (
        <div className="mt-4 space-y-3">
          {biasData && (
            <div className="bg-gray-900/60 rounded-lg p-3 border border-cyan-700/30">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getBadgeColor(biasData.classification)}`}>
                  {biasData.classification}
                </span>
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Bias Analysis</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {biasData.explanation}
              </p>
            </div>
          )}

          {fakeNewsData && (
            <div className="bg-gray-900/60 rounded-lg p-3 border border-purple-700/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-200">Fake News Probability:</span>
                <span className={`text-lg font-bold ${getProbabilityColor(fakeNewsData.fake_news_probability)}`}>
                  {fakeNewsData.fake_news_probability}%
                </span>
              </div>
              <p className="text-sm text-gray-300">
                {fakeNewsData.fake_news_explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default NewsFeedItem;
