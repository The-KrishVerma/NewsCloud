import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';

const LatestNews = () => {
    const [headlines, setHeadlines] = useState([]);
    const [fetchFailed, setFetchFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const API_URL = `https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=50&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`;

        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error('API fetch failed');
                return res.json();
            })
            .then((data) => {
                if (cancelled) return;
                const articles = Array.isArray(data.articles) ? data.articles : [];
                if (articles.length > 0) {
                    const titles = articles.slice(0, 5).map((a) => a.title).filter(Boolean);
                    if (titles.length > 0) {
                        setHeadlines(titles);
                        setFetchFailed(false);
                        return;
                    }
                }
                setHeadlines([]);
                setFetchFailed(true);
            })
            .catch(() => {
                if (!cancelled) {
                    setHeadlines([]);
                    setFetchFailed(true);
                }
            });

        return () => { cancelled = true; };
    }, []);

    if (fetchFailed) {
        return (
            <div className='flex items-center gap-5 bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-blue-900/20'>
                <p className='text-sm text-red-400'>Connection error. Please ensure you’re online.</p>
            </div>
        );
    }

    if (!headlines || headlines.length === 0) return null;

    return (
        <div className='flex items-center gap-5 bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-blue-900/20'>
            <p className='px-3 py-2 text-white font-bold rounded bg-gradient-to-r from-blue-600 to-cyan-500'>NEWS</p>
            <Marquee
                className='flex gap-10 text-sm md:text-base font-medium text-blue-200'
                pauseOnHover={true}
                gradient={false}
                speed={50}
            >
                {headlines.map((news, index) => (
                    <span key={index} className="mx-4 whitespace-nowrap">{news}</span>
                ))}
            </Marquee>
        </div>
    );
};

export default LatestNews;
