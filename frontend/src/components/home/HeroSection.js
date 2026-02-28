import React from 'react';
import FeatureCard from './FeatureCard';

/**
 * Hero Section — Clean T-detector style with teal accents
 */
const HeroSection = () => {
    return (
        <section id="hero" className="relative py-24 md:py-36 bg-white overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(10,186,181,0.06) 0%, transparent 70%)' }}></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(10,186,181,0.04) 0%, transparent 70%)' }}></div>
            </div>

            <div className="container mx-auto px-6 text-center relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 border" style={{ borderColor: '#0ABAB5', color: '#0ABAB5', background: 'rgba(10,186,181,0.05)' }}>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#0ABAB5' }}></span>
                        <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#0ABAB5' }}></span>
                    </span>
                    3-Layer Hybrid AI Detection
                </div>

                {/* Headline */}
                <h1 className="mb-6 tracking-tight">
                    <span className="block text-6xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-2">
                        Authintic
                    </span>
                    <span className="block text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 leading-tight">
                        Advanced Plagiarism  
                        <span style={{ color: '#0ABAB5' }}> & AI Detection Platform</span>
                    </span>
                </h1>

                <p className="mt-4 text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                    Instantly scan your document for plagiarism and AI-generated content.
                    Get a Similarity Report and an AI Report powered by our 3-layer hybrid engine.
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a
                        href="/dashboard"
                        className="group px-8 py-4 text-white font-bold text-lg rounded-full transition-all hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                        style={{ background: '#0ABAB5' }}
                    >
                        Start Checking
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                    <a href="#how-it-works" className="px-8 py-4 text-gray-700 font-semibold text-lg rounded-full border-2 border-gray-300 hover:border-[#0ABAB5] hover:text-[#0ABAB5] transition-all flex items-center gap-2">
                        How It Works
                    </a>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <FeatureCard icon="3-Layer" title="Hybrid Detection" variant="teal" />
                    <FeatureCard icon="1.77M" title="Vectors Indexed" variant="teal" />
                    <FeatureCard icon="PAN25" title="Benchmarked" variant="teal" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
