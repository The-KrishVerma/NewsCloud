import React, { Suspense } from 'react';

const LeftAside = () => {
    return (
        <div>
            <Suspense fallback={<span className="loading loading-spinner text-accent"></span>
            }>
            </Suspense>
        </div>
    );
};

export default LeftAside;