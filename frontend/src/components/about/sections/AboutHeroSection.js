import React from 'react';

/**
 * About Hero Section
 * Landing section for the About page
 */
const AboutHeroSection = () => {
    const websiteName = "Authintic";

    return (
        <div className="text-center mb-20 animate-fade-in">
            <div className="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
                ✨ About Our Project
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">{websiteName}</span>
            </h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Revolutionizing academic integrity through cutting-edge AI and semantic understanding
            </p>
        </div>
    );
};

export default AboutHeroSection;
