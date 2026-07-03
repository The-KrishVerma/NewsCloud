import React, { useState } from 'react';
import { useNavigation, Outlet, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Navbar from '../Components/Navbar';
import LatestNews from '../Components/LatestNews';
import LeftAside from '../Components/HomeLayout/LeftAside';
import Loading from '../Pages/Loading';
import NewsFeed from '../Pages/NewsFeed';
import FilterBox from '../Components/FilterBox';
import { NewsFinderLeftSidebar, NewsFinderRightSidebar } from '../Components/NewsFinderSidebars';
import { CompareLeftSidebar, CompareRightSidebar } from '../Components/CompareSidebars';
import { AboutLeftSidebar, AboutRightSidebar } from '../Components/AboutSidebars';
import { LinkSummarizerLeftSidebar, LinkSummarizerRightSidebar } from '../Components/LinkSummarizerSidebars';

const categories = [
    { name: 'General', key: 'general' },
    { name: 'Business', key: 'business' },
    { name: 'Technology', key: 'technology' },
    { name: 'Entertainment', key: 'entertainment' },
    { name: 'Sports', key: 'sports' },
    { name: 'Science', key: 'science' },
    { name: 'Health', key: 'health' },
];

const HomeLayouts = () => {
    const { state } = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [selectedCountry, setSelectedCountry] = useState('us');
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [fromDate, setFromDate] = useState('');
    const location = useLocation();

    return (
        <div className="bg-gradient-to-br from-black via-gray-950 to-gray-900 min-h-screen pb-6">
            <header>
                <Header />
            </header>

            <section className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-10 px-4 mb-6 shadow-lg shadow-blue-600/30">
                <div className="w-11/12 mx-auto text-center animate-slide-down">
                    <h1 className="text-4xl font-bold mb-2">Welcome to NewsCloud</h1>
                    <p className="text-lg mb-4 text-blue-100">Your AI-powered news companion. Discover top headlines, generate instant summaries, and analyze diverse perspectives.</p>
                </div>
            </section>

            <nav className='w-11/12 mx-auto my-3'>
                <Navbar />
            </nav>
            {location.pathname !== '/analytics' && location.pathname !== '/newsfinder' && location.pathname !== '/compare' && location.pathname !== '/about' && location.pathname !== '/link-summarizer' && (
                <div className="lg:hidden mb-6 w-11/12 mx-auto">
                    <FilterBox 
                        country={selectedCountry} 
                        language={selectedLanguage} 
                        category={selectedCategory} 
                        fromDate={fromDate}
                        setSelectedCountry={setSelectedCountry} 
                        setSelectedLanguage={setSelectedLanguage} 
                        setSelectedCategory={setSelectedCategory} 
                        setFromDate={setFromDate}
                        categories={categories} 
                    />
                </div>
            )}
            
            <section className='w-11/12 mx-auto my-3 animate-slide-up'>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-900/30 px-6 pb-3 pt-3 mb-0">
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
                        <span className='text-blue-400'>🔥</span>Trending News
                    </h2>
                    <LatestNews country={selectedCountry} language={selectedLanguage} />
                </div>
            </section>

            <main className='w-11/12 mx-auto my-3 grid grid-cols-1 lg:grid-cols-[repeat(50,minmax(0,1fr))] gap-4'>
                {location.pathname !== '/analytics' && (
                    <aside className='hidden lg:block lg:col-[span_9_/_span_9] sticky top-20 h-fit'>
                        {location.pathname === '/newsfinder' ? (
                            <NewsFinderLeftSidebar />
                        ) : location.pathname === '/link-summarizer' ? (
                            <LinkSummarizerLeftSidebar />
                        ) : location.pathname === '/compare' ? (
                            <CompareLeftSidebar />
                        ) : location.pathname === '/about' ? (
                            <AboutLeftSidebar />
                        ) : (
                            <>
                                <LeftAside />
                                <div className="space-y-1.5 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-900/30">
                                    <h3 className="font-bold text-base mb-2 text-blue-400 flex items-center gap-2">
                                        <span>📂</span> Categories
                                    </h3>
                                    {categories.map((category) => (
                                        <button
                                            key={category.key}
                                            className={`btn w-full text-left rounded transition-all py-1.5 px-3 text-sm ${
                                                selectedCategory === category.key
                                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/50'
                                                    : 'bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:border-blue-600/50 hover:text-blue-300'
                                            }`}
                                            onClick={() => setSelectedCategory(category.key)}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </aside>
                )}

                <section className={`col-span-1 ${location.pathname === '/analytics' ? 'lg:col-[span_50_/_span_50]' : 'lg:col-[span_30_/_span_30]'}`}>
                    

                    {location.pathname === '/' ? (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-900/30 p-6 animate-slide-up">
                            <h2 className="text-4xl md:text-5xl font-black mb-2 text-gradient">
                                {categories.find(c => c.key === selectedCategory)?.name} News
                            </h2>
                            {state === 'loading'
                                ? <Loading />
                                : <NewsFeed category={selectedCategory} pageSize={20} country={selectedCountry} language={selectedLanguage} fromDate={fromDate} />}
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </section>
                {location.pathname !== '/analytics' && (
                    <aside className='hidden lg:block lg:col-[span_11_/_span_11] sticky top-20 h-fit'>
                        {location.pathname === '/newsfinder' ? (
                            <NewsFinderRightSidebar />
                        ) : location.pathname === '/link-summarizer' ? (
                            <LinkSummarizerRightSidebar />
                        ) : location.pathname === '/compare' ? (
                            <CompareRightSidebar />
                        ) : location.pathname === '/about' ? (
                            <AboutRightSidebar />
                        ) : (
                            <FilterBox 
                                country={selectedCountry} 
                                language={selectedLanguage} 
                                fromDate={fromDate}
                                setSelectedCountry={setSelectedCountry} 
                                setSelectedLanguage={setSelectedLanguage} 
                                setFromDate={setFromDate}
                            />
                        )}
                    </aside>
                )}
            </main>
        </div>
    );
};

export default HomeLayouts;
