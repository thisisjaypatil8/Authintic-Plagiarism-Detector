import React from 'react';
import { IconMicroscope, IconBolt, IconBrain } from '../Icons';

const AuthFormWrapper = ({
    title,
    subtitle,
    icon,
    children,
    logoSrc = '/logo.png'
}) => {
    return (
        <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Left — Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 bg-white">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-10 cursor-pointer logo-hover">
                    <img src={logoSrc} alt="Authintic" className="w-9 h-9 object-contain" />
                    <span className="text-xl font-extrabold tracking-tight">
                        <span style={{ color: '#0ABAB5' }}>A</span>
                        <span className="text-gray-800">uth</span>
                        <span style={{ color: '#0ABAB5' }}>i</span>
                        <span className="text-gray-800">ntic</span>
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                {subtitle && (
                    <p className="text-gray-500 mb-8">{subtitle}</p>
                )}

                {/* Form Content */}
                {children}
            </div>

            {/* Right — Illustration Panel */}
            <div 
                className="hidden lg:flex w-1/2 flex-col items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0ABAB5 0%, #099D99 50%, #0D3B4A 100%)' }}
            >
                {/* Decorative circles */}
                <div className="absolute top-20 right-20 w-40 h-40 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-24 left-16 w-56 h-56 border border-white/10 rounded-full"></div>
                <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-white/5 rounded-full blur-xl"></div>

                {/* Central illustration */}
                <div className="relative z-10 text-center">
                    <div className="w-32 h-32 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <img src={logoSrc} alt="Authintic" className="w-20 h-20 object-contain brightness-0 invert" />
                    </div>

                    {/* Floating badges */}
                    <div className="absolute -top-8 -right-16 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-xs font-medium flex items-center gap-1">
                        <IconMicroscope className="w-3.5 h-3.5" /> TF-IDF
                    </div>
                    <div className="absolute top-12 -left-20 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-xs font-medium flex items-center gap-1">
                        <IconBolt className="w-3.5 h-3.5" /> FAISS
                    </div>
                    <div className="absolute -bottom-4 -right-12 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-xs font-medium flex items-center gap-1">
                        <IconBrain className="w-3.5 h-3.5" /> BERT
                    </div>

                    <h3 className="text-white text-2xl font-bold mb-3">
                        3-Layer Hybrid Detection
                    </h3>
                    <p className="text-white/70 text-sm max-w-xs mx-auto">
                        Accurate plagiarism and AI-content detection powered by TF-IDF, FAISS, and BERT.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthFormWrapper;
