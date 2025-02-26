import React from 'react';
import { FaTools } from 'react-icons/fa';

const DevelopmentPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <FaTools className="text-6xl text-gray-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Under Development</h1>
            <p className="text-lg text-gray-600 text-center">
                We're working to bring you this page. Stay tuned for updates!
            </p>
        </div>
    );
};

export default DevelopmentPage;