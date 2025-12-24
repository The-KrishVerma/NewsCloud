import React from 'react';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router';
import { useLocation } from 'react-router-dom';

const AuthLayout = () => {
        const { pathname } = useLocation();
        const hideHeader = pathname.endsWith('/login');

        // When on the login page we want a full-bleed layout so no outer
        // light background or side padding shows at the corners.
        return (
                <div className={hideHeader ? 'min-h-screen' : 'bg-base-200 min-h-screen'}>
                     {!hideHeader && (
                         <header className='w-11/12 mx-auto py-5'>
                             <Navbar />
                         </header>
                     )}

                     <main className={hideHeader ? 'w-full min-h-screen' : 'w-11/12 mx-auto py-5'}>
                        <Outlet />
                     </main>
                </div>
        );
};

export default AuthLayout;