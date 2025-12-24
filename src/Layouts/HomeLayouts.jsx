import React, { useState } from 'react';
import { useNavigation, Outlet, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Navbar from '../Components/Navbar';
import LatestNews from '../Components/LatestNews';
import LeftAside from '../Components/HomeLayout/LeftAside';
import SocialLogin from '../Components/HomeLayout/SocialLogin';
import Loading from '../Pages/Loading';
import NewsFeed from '../Pages/NewsFeed';

const categories = [
    { name: 'Trending', key: 'general' },
    { name: 'Sports', key: 'sports' },
    { name: 'Entertainment', key: 'entertainment' },
    { name: 'Business', key: 'business' },
    { name: 'Technology', key: 'technology' },
    { name: 'Health', key: 'health' },
];

const HomeLayouts = () => {
    const { state } = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState('general');
    const location = useLocation();

    return (
        <div className="bg-gradient-to-br from-black via-gray-950 to-gray-900 min-h-screen">
            <header>
                <Header />
            </header>

            <section className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-10 px-4 mb-6 shadow-lg shadow-blue-600/30">
                <div className="w-11/12 mx-auto text-center animate-slide-down">
                    <h1 className="text-4xl font-bold mb-2">Welcome to NewsCloud</h1>
                    <p className="text-lg mb-4 text-blue-100">Stay updated with the latest headlines from around the world. Choose a category to explore!</p>
                </div>
            </section>

            <nav className='w-11/12 mx-auto my-3'>
                <Navbar />
            </nav>

            <section className='w-11/12 mx-auto my-3 animate-slide-up'>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-900/30 p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
                        <span className='text-blue-400'>⭐</span>Featured News
                    </h2>
                    <LatestNews />
                </div>
            </section>

            <main className='w-11/12 mx-auto my-3 grid grid-cols-1 lg:grid-cols-12 gap-8'>
                <aside className='hidden lg:block lg:col-span-3 sticky top-20 h-fit'>
                    <LeftAside />
                    <div className="space-y-3 bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-blue-900/30">
                        <h3 className="font-bold text-lg mb-3 text-blue-400 flex items-center gap-2">
                            <span>📂</span> Categories
                        </h3>
                        {categories.map((category) => (
                            <button
                                key={category.key}
                                className={`btn w-full text-left rounded transition-all ${
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
                    <div className="mt-6">
                        <SocialLogin />
                    </div>
                </aside>

                <section className='col-span-1 lg:col-span-9'>
                    {location.pathname === '/' && (
                        <div className="lg:hidden mb-6">
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-blue-900/30">
                                <h3 className="font-bold text-lg mb-3 text-blue-400 flex items-center gap-2">
                                    <span>📂</span> Categories
                                </h3>
                                <select 
                                    value={selectedCategory} 
                                    onChange={e => setSelectedCategory(e.target.value)}
                                    className="w-full p-2.5 text-gray-300 bg-gray-700/50 rounded-md outline-none border border-gray-600/30 focus:border-blue-600/50"
                                >
                                    {categories.map((category) => (
                                        <option key={category.key} value={category.key}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {location.pathname === '/' ? (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-900/30 p-6 animate-slide-up">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gradient">
                                {categories.find(c => c.key === selectedCategory)?.name} News
                            </h2>
                            {state === 'loading'
                                ? <Loading />
                                : <NewsFeed category={selectedCategory} pageSize={20} />}
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </section>
            </main>
        </div>
    );
};

export default HomeLayouts;
