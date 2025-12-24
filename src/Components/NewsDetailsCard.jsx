import React from 'react';
import { Link } from 'react-router-dom';

const NewsDetailsCard = ({news}) => {
    // console.log(news);
    return (
        <div className="container-centered px-4 py-6 animate-slide-up">
            <div className='relative mb-6 overflow-hidden rounded-xl shadow-2xl group'>
                <img className='w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700' src={news.image_url} alt={news.title || 'News image'} />
                <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent'></div>
            </div>
            <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-blue-900/30'>
                <h2 className='text-3xl md:text-4xl mt-4 mb-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300'>{news.title}</h2>
                <p className='text-gray-300 leading-relaxed text-lg mb-6'>{news.details}</p>
                <Link className='inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 mt-4' to={`/category/${news.category_id}`}>
                    ← Back to News Category
                </Link>
            </div>
        </div>
    );
};

export default NewsDetailsCard;