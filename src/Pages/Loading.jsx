import React from 'react';

const Loading = () => {
    return (
        <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden'>
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
            
            <div className='flex flex-col items-center gap-4 relative z-10'>
                <span className="loading loading-dots loading-lg text-blue-500"></span>
                <p className='text-gray-400 text-sm font-medium animate-pulse'>Loading news...</p>
            </div>
        </div>
    );
};

// Skeleton loader for news cards
export const NewsCardSkeleton = () => (
    <div className='card bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 mb-6 animate-pulse border border-gray-700/50 overflow-hidden'>
        <div className='flex items-center justify-between mb-4 bg-gray-700/30 space-x-4 p-4 rounded-lg'>
            <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-gray-600'></div>
                <div className='flex-1'>
                    <div className='h-3 bg-gray-600 rounded w-24 mb-2'></div>
                    <div className='h-2 bg-gray-600 rounded w-32'></div>
                </div>
            </div>
            <div className='flex gap-2'>
                <div className='w-8 h-8 rounded-full bg-gray-600'></div>
                <div className='w-8 h-8 rounded-full bg-gray-600'></div>
            </div>
        </div>
        <div className='h-4 bg-gray-600 rounded w-3/4 mb-3'></div>
        <div className='h-56 bg-gray-600 rounded-lg mb-3'></div>
        <div className='space-y-2'>
            <div className='h-3 bg-gray-600 rounded w-full'></div>
            <div className='h-3 bg-gray-600 rounded w-5/6'></div>
        </div>
        <div className='flex justify-between mt-4'>
            <div className='h-4 bg-gray-600 rounded w-16'></div>
            <div className='h-4 bg-gray-600 rounded w-16'></div>
        </div>
    </div>
);

export default Loading;