import { useState } from "react";
import axios from "axios";
import { Readability } from "@mozilla/readability";
import ReactMarkdown from "react-markdown";
import { FiLink } from "react-icons/fi";

const LinkSummarizer = () => {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_SMRY_KEY;

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!url.trim().match(/^https?:\/\//i)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const targetUrl = url.trim();
      const proxyUrls = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
        `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(targetUrl)}`
      ];

      let htmlData = null;
      let lastError = null;

      for (const proxy of proxyUrls) {
        try {
          console.log("Trying proxy:", proxy);
          const response = await axios.get(proxy, {
            responseType: proxy.includes('allorigins') ? 'json' : 'text'
          });
          
          if (proxy.includes('allorigins') && response.data && response.data.contents) {
            htmlData = response.data.contents;
            break;
          } else if (response.data && typeof response.data === 'string') {
            htmlData = response.data;
            break;
          }
        } catch (err) {
          console.warn("Proxy failed:", proxy, err.message);
          lastError = err;
        }
      }

      if (!htmlData) {
        throw lastError || new Error("All proxy services failed to fetch the article. The website might be blocking access.");
      }
      
      let articleText = "";
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, "text/html");
      const reader = new Readability(doc);
      const parsedArticle = reader.parse();
      if (parsedArticle && parsedArticle.textContent) {
        articleText = parsedArticle.textContent.substring(0, 15000);
      }

      if (!articleText) {
        throw new Error("Could not extract text from this URL. The site might be blocking access.");
      }

      const promptText = `Please provide a highly detailed, comprehensive summary of the following article. Structure it nicely with bullet points and key takeaways. \n\nArticle Text:\n${articleText}`;

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiUrl}`,
        {
          contents: [{ role: "user", parts: [{ text: promptText }] }],
          generationConfig: { responseMimeType: "text/plain" }
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const responseText = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
      setSummary(responseText);
    } catch (err) {
      console.error(err);
      let errorMessage = "Failed to summarize the article. Please try again.";
      if (err.response) {
        if (err.response.status === 429) {
          errorMessage = "Rate limit exceeded (429). The Gemini API is receiving too many requests. Please wait a minute and try again.";
        } else if (err.response.status === 503) {
          errorMessage = "The proxy service is currently unavailable (503). Please try again later or try a different link.";
        } else {
          errorMessage = `Request failed with status code ${err.response.status}. Please check your API key and try again.`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-900/30 p-6 animate-slide-up">
      <h2 className="text-4xl md:text-5xl font-black mb-2 text-gradient">URL Summarizer</h2>
      <p className="text-gray-300 mb-6">
        Paste any news article link and our AI will generate a comprehensive summary in seconds.
      </p>

      {/* Input Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <form onSubmit={handleSummarize} className="relative flex items-center">
          <div className="absolute left-4 text-gray-400">
            <FiLink size={20} />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full bg-gray-800/80 border border-blue-900/50 rounded-full py-4 pl-12 pr-40 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-lg"
            disabled={loading}
            required
          />
          <button
            type="submit"
            className="absolute right-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium px-6 py-2 rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
            disabled={loading || !url.trim()}
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-center max-w-2xl mx-auto">
          <p className="text-red-200">⚠️ {error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-medium">Extracting and reading article...</p>
        </div>
      )}

      {summary && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-blue-900/30">
            <h2 className="text-xl font-bold text-gray-200">AI Summary</h2>
          </div>
          <div className="bg-gray-900/60 rounded-xl p-6 md:p-8 border border-blue-800/50 shadow-inner animate-fade-in">
            <div className="prose prose-invert prose-blue max-w-none prose-p:leading-relaxed prose-li:text-gray-300">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkSummarizer;
