import React from 'react';
import { format } from 'date-fns';

const Header = () => {
    return (
        <div className='mt-8 md:mt-12 py-8 flex flex-col justify-center items-center gap-4 text-center animate-slide-down'>
            <div className='relative'>
                <div className='absolute -inset-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 rounded-3xl blur-3xl opacity-40 animate-pulse'></div>
                <h1 className='relative z-10 text-6xl md:text-7xl lg:text-8xl font-black text-gradient'>
                    NewsCloud
                </h1>
            </div>
            <p className='text-sm md:text-base text-gray-400 font-medium tracking-wider animate-fade-in' style={{animationDelay: '0.2s'}}>
                {format(new Date(), 'EEEE, MMM dd, yyyy • hh:mm a')}
            </p>
            <div className='h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full animate-scale-in' style={{animationDelay: '0.4s'}}></div>
        </div>
    );
};

export default Header;