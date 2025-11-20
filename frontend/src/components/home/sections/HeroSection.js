import React from 'react';
import FeatureCard from '../ui/FeatureCard';

/**
 * Hero Section - Landing section with animated gradient, CTAs, and stats
 */
const HeroSection = () => {
    return (
        <section id="hero" className="relative py-20 md:py-32 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '1s'}}></div>
            </div>
            
            <div className="container mx-auto px-6 text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 shadow-md hover:shadow-lg transition-shadow">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                    </span>
                    AI-Powered Detection
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                    A New Era of<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animated-gradient">
                        Plagiarism Detection
                    </span>
                </h1>
                
                <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    <span className="font-semibold text-indigo-600">Authintic</span> is an AI-powered system designed to address the challenges of modern academic integrity, tackling sophisticated paraphrasing where traditional tools fail.
                </p>
                
                <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center">
                    <a href="#demo" className="group bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl animated-gradient flex items-center gap-3">
                        <span>Explore Interactive Demo</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                    <a href="#solution" className="bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-lg border-3 border-indigo-600 hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>How It Works</span>
                    </a>
                </div>
                
                {/* Stats Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <FeatureCard 
                        icon="99.5%" 
                        title="Detection Accuracy" 
                        variant="indigo"
                    />
                    <FeatureCard 
                        icon="AI-Powered" 
                        title="Semantic Analysis" 
                        variant="purple"
                    />
                    <FeatureCard 
                        icon="Instant" 
                        title="Real-Time Results" 
                        variant="pink"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
