import { useState, useEffect } from "react";
import axios from "axios";
import { Readability } from "@mozilla/readability";
import ReactMarkdown from "react-markdown";
import { FiLink } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const LinkSummarizer = () => {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [articleContent, setArticleContent] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState("");
  const apiUrl = import.meta.env.VITE_SMRY_KEY;
  const location = useLocation();
  const navigate = useNavigate();

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryUrl = params.get('url');
    if (queryUrl) {
      setUrl(queryUrl);
      
      // Check if it's already in history
      try {
        const saved = JSON.parse(localStorage.getItem('newscloud_summarizer_history') || '[]');
        const existing = saved.find(item => item.url === queryUrl);
        if (existing && existing.summary) {
          setSummary(existing.summary);
          return;
        }
      } catch (e) {
        // ignore JSON parse errors
      }
      
      // If not in history but passed in URL, we could auto-summarize here,
      // but requiring the user to click summarize is safer to avoid looping.
    }
  }, [location.search]);

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
        setArticleContent(articleText);
      }

      if (!articleText) {
        throw new Error("Could not extract text from this URL. The site might be blocking access.");
      }

      const promptText = `Please act as an expert analyst and provide a highly detailed, professional summary of the following article. Format the output in Markdown with the following structure:
1. "## 📌 Executive Summary" - A brief, punchy overview.
2. "## 🔑 Key Takeaways" - A bulleted list of the most important facts.
3. "## 📖 Detailed Analysis" - A deeper dive into the article's contents.
4. "## 💡 Conclusion" - A short wrap-up of its implications.

Make sure to use bold text for emphasis and keep the tone informative.

Article Text:
${articleText}`;

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

      // Save to history
      try {
        const saved = JSON.parse(localStorage.getItem('newscloud_summarizer_history') || '[]');
        const newHistory = [
          { url: targetUrl, summary: responseText, time: new Date().toISOString() },
          ...saved.filter(item => item.url !== targetUrl)
        ].slice(0, 50); // keep last 50
        localStorage.setItem('newscloud_summarizer_history', JSON.stringify(newHistory));
        window.dispatchEvent(new Event('summarizer_history_updated'));
        
        // Update URL to match current summary without reloading
        navigate(`/link-summarizer?url=${encodeURIComponent(targetUrl)}`, { replace: true });
      } catch (e) {
        console.warn("Failed to save history", e);
      }
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

  const handleReadSummary = () => {
    if ('speechSynthesis' in window) {
      if (isReading) {
        window.speechSynthesis.cancel();
        setIsReading(false);
      } else {
        window.speechSynthesis.cancel(); // Clear any existing speech
        setIsReading(true);
        
        // Prevent GC by storing utterances globally
        window.__speechUtterances = [];
        
        // Strip markdown before reading
        const textToRead = summary.replace(/[#*`_]/g, '');
        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        utterance.onend = () => {
          setIsReading(false);
        };
        utterance.onerror = () => {
          setIsReading(false);
        };
        
        window.__speechUtterances.push(utterance);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert("Sorry, your browser doesn't support text to speech!");
    }
  };

  const handleVerifyBias = async () => {
    if (!articleContent) return;
    setIsVerifying(true);
    setVerificationResult("");
    
    try {
      const promptText = `Please act as an expert fact-checker and media analyst. Analyze the following article for bias and verify its key claims. Format the output in Markdown with the exact following structure:
1. "## ⚖️ Bias Assessment" - Analyze the article for any political, corporate, or emotional bias. Identify the tone and perspective.
2. "## 🔍 Fact Verification" - Highlight key claims made in the article and assess their credibility or point out if they need further verification.

Article Text:
${articleContent}`;

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiUrl}`,
        {
          contents: [{ role: "user", parts: [{ text: promptText }] }],
          generationConfig: { responseMimeType: "text/plain" }
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const responseText = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
      setVerificationResult(responseText);
    } catch (err) {
      console.error(err);
      setVerificationResult("Failed to verify the article. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-900/30 p-6 animate-slide-up">
      <h2 className="text-4xl md:text-5xl font-black mb-2 text-gradient">URL Summarizer</h2>
      <p className="text-gray-300 mb-6">
        Paste any news article link and our AI will generate a comprehensive summary in seconds.
      </p>

      {/* Input Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <form onSubmit={handleSummarize} className="relative flex items-center">
          <div className="absolute left-4 text-gray-400">
            <FiLink size={20} />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full bg-gray-800/80 border border-blue-900/50 rounded-full py-4 pl-12 pr-48 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-lg"
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
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-blue-900/30 flex-wrap gap-4">
            <h2 className="text-xl font-bold text-gray-200">AI Summary</h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleVerifyBias}
                disabled={isVerifying}
                className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-full font-semibold shadow-md transition-all bg-purple-500/20 text-purple-400 border border-purple-500/50 hover:bg-purple-500/30 disabled:opacity-50"
              >
                <span className="text-lg">{isVerifying ? "⏳" : "🔍"}</span>
                {isVerifying ? "Checking..." : "Verify & Check Bias"}
              </button>
              <button 
                onClick={handleReadSummary}
                className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-full font-semibold shadow-md transition-all ${
                  isReading 
                    ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30" 
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30"
                }`}
              >
                <span className="text-lg">{isReading ? "⏹️" : "▶️"}</span>
                {isReading ? "Stop Playing" : "Play Summary"}
              </button>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-blue-800/50 shadow-2xl animate-fade-in">
              <div className="prose prose-invert prose-blue max-w-none prose-p:leading-relaxed prose-li:text-gray-300 prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-cyan-400 prose-headings:to-blue-500">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            </div>
          </div>

          {verificationResult && (
            <div className="relative group mt-8 animate-fade-in">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-purple-800/50 shadow-2xl">
                <div className="prose prose-invert prose-purple max-w-none prose-p:leading-relaxed prose-li:text-gray-300 prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-pink-400 prose-headings:to-purple-500">
                  <ReactMarkdown>{verificationResult}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkSummarizer;
