import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FiMessageSquare } from "react-icons/fi";
 
const Summarize = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_SMRY_KEY;
  const chatRef = useRef(null);
 
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatHistory, generatingAnswer]);
 
  const isValidQuery = (str) => typeof str === "string" && str.trim().length > 0;
 
 const fetchSummary = async (query) => {
  console.log("Fetching summary for query:", query);
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiUrl}`,
    {
      contents: [
        {
          parts: [{ text: `Find news related to:\n${query}` }]
        }
      ]
    },
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  console.log("Received response:", res.data);
  return res.data.candidates?.[0]?.content?.parts?.[0]?.text;
};
 
 
  const handleSummarize = async (e) => {
    e.preventDefault();
    setError("");
 
    if (!input.trim()) {
      setError("Please enter a search query or keywords");
      return;
    }

    const currentQuery = input.trim();
    setInput("");
    setGeneratingAnswer(true);
 
    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuery, time: new Date().toLocaleTimeString() },
    ]);
 
    try {
      const summaryText = await fetchSummary(currentQuery);
      setChatHistory((prev) => [...prev, { type: "answer", content: summaryText, time: new Date().toLocaleTimeString() }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [...prev, { type: "answer", content: "❌ Failed to find or summarize news. Please try again later.", time: new Date().toLocaleTimeString() }]);
    } finally {
      setGeneratingAnswer(false);
    }
  };
 
  return (
    <div className="px-0 py-0">
      <div className="w-full">
        {/* Main Column (chat + input) */}
        <div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-blue-900/30 p-6 mt-0 shadow-none no-glow h-full flex flex-col">
            <div className="w-full">
              <div className="mb-4 text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gradient mb-2">NewsFinder</h1>
              </div>
            </div>
            {error && (
              <div className="m-6 mb-0 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-200 flex items-center gap-2">
                  <span className="text-red-400">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Chat Area */}
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[44vh] min-h-[140px]"
            >
            {chatHistory.length === 0 && !generatingAnswer && (
              <div className="h-full flex items-center justify-center text-center">
                <div className="max-w-sm">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Ready to Find News
                  </h3>
                  <p className="text-gray-300 mb-3 text-base">
                    Enter keywords or a short headline and let our AI find relevant news and summarize it for you.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      ✨ AI-Powered
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      🚀 Lightning Fast
                    </span>
                    <span className="px-3 py-1 bg-blue-700/20 text-blue-200 rounded-full text-sm">
                      📝 Concise
                    </span>
                  </div>
                </div>
              </div>
            )}
 
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${
                  chat.type === "question" ? "flex-row-reverse" : "flex-row"
                }`}
              >
 
                {/* Message Bubble */}
                <div className={`flex-1 max-w-screen-xl ${
                  chat.type === "question" ? "text-right" : "text-left"
                }`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    chat.type === "question"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-black/40 text-white backdrop-blur-sm border border-blue-800 rounded-bl-sm"
                  }`}>
                    {chat.type === "question" ? (
                      <div className="space-y-2">
                      
                        <p className="break-all">{chat.content}</p>
                      </div>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{chat.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
 
                  {/* Timestamp */}
                  <div className={`flex items-center gap-1 mt-2 text-xs text-gray-400 ${
                    chat.type === "question" ? "justify-end" : "justify-start"
                  }`}>
                    {chat.time}
                  </div>
                </div>
              </div>
            ))}
 
            {/* Loading State */}
            {generatingAnswer && (
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="inline-block p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 rounded-bl-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-gray-300">Searching for news and generating summary...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>

            {/* Input Area */}
            <div className="border-t border-white/20 pt-4 px-4 pb-0 mt-4">
              <form onSubmit={handleSummarize} className="space-y-4">
                <div className="relative">
                  <textarea
                    className="w-full px-3 py-2 pr-4 bg-black/40 border border-blue-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none backdrop-blur-sm"
                    placeholder="Enter keywords or headline to search for news..."
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={generatingAnswer}
                  />

                </div>

                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 disabled:opacity-50"
                    onClick={() => {
                      setChatHistory([]);
                      setInput("");
                      setError("");
                    }}
                    disabled={generatingAnswer}
                  >
                    Clear Chat
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-150 disabled:opacity-50 disabled:transform-none"
                    disabled={generatingAnswer}
                  >
                    {generatingAnswer ? "Analyzing..." : "Find News"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* aside removed per request */}
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-gray-400">
        <p className="text-sm">
          Powered by <span className="text-blue-400 font-medium">Google Gemini AI</span> • 
          <span className="text-blue-300 font-medium ml-2">NewsCloud Platform</span>
        </p>
      </div>
    </div>
  );
};
 
export default Summarize;
