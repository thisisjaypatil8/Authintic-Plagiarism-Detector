import React from 'react';

/**
 * Dashboard Hero Component
 * Welcome section with quick stats and motivational content
 */
const DashboardHero = () => {
    return (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-white mb-8 shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 -ml-48 -mb-48"></div>
            
            <div className="relative">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center gap-3">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            Plagiarism Checker
                        </h1>
                        <p className="text-xl text-purple-100">
                            Ensure your work is 100% original with our AI-powered detection
                        </p>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white border-opacity-30">
                        <p className="text-sm text-purple-100 mb-1">Supported Formats</p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="text-xs font-semibold bg-white bg-opacity-30 px-3 py-1 rounded-full">.docx</span>
                            <span className="text-xs font-semibold bg-white bg-opacity-30 px-3 py-1 rounded-full">.txt</span>
                            <span className="text-xs font-semibold bg-white bg-opacity-30 px-3 py-1 rounded-full">.pdf</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHero;
