import React from 'react';
import { FiLink, FiZap, FiFileText } from 'react-icons/fi';

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

export const LinkSummarizerRightSidebar = () => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-900/30 animate-fade-in shadow-lg sticky top-24">
    <h3 className="font-bold text-lg mb-3 text-blue-400 flex items-center gap-2">
      <FiFileText /> Capabilities
    </h3>
    <div className="space-y-3 text-sm text-gray-300">
      <p>
        The AI URL Summarizer uses an advanced proxy-rotation engine to bypass security blocks and fetch raw HTML.
      </p>
      <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
        <span className="block font-semibold text-cyan-300 mb-1">Deep Reading</span>
        It reads up to 15,000 characters of the article to ensure it captures all the critical context before summarizing.
      </div>
    </div>
  </div>
);
