import React from "react";
import { Link } from "react-router-dom";
import NewsFeed from "./NewsFeed";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4 md:py-24">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto text-center relative z-10 animate-slide-down">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300">
            NewsCloud — Clear News, Fast
          </h2>
          <p className="text-base md:text-lg mb-8 text-gray-400 max-w-2xl mx-auto opacity-90">
            NewsCloud uses AI to turn long-form reporting into concise, trustworthy summaries and personalized feeds — helping you stay informed without the noise.
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-8 py-4 rounded-full hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
            aria-label="Explore NewsCloud"
          >
            Explore NewsCloud
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {/* News Feed Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 mb-8 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Featured News</h1>
            <div className="flex-1 h-1 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
          </div>
          <NewsFeed/>
        </section>
      </main>
    </div>
  );
};

export default Home;
