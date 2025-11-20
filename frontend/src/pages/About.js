import React, { lazy, Suspense, useEffect } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import AboutHeroSection from '../components/about/sections/AboutHeroSection';
import FeatureHighlightsSection from '../components/about/sections/FeatureHighlightsSection';
import TechStackSection from '../components/about/sections/TechStackSection';

// Lazy load the TeamSection (contains images)
const TeamSection = lazy(() => import('../components/about/sections/TeamSection'));

/**
 * About Page - Refactored to use modular components
 * Uses lazy loading for image-heavy sections
 */
const About = () => {
    const websiteName = "Authintic";

    // Load Google Fonts
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }, []);

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200 pt-32 pb-16" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="container mx-auto px-6">
                    {/* Hero Section */}
                    <AboutHeroSection />

                    {/* Feature Highlights */}
                    <FeatureHighlightsSection />

                    {/* Main Content Grid */}
                    <div className="max-w-6xl mx-auto space-y-10">
                        {/* Introduction Card */}
                        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-indigo-100 hover:shadow-3xl transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
                            <div className="relative flex items-start gap-5 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Our Journey</h2>
                                    <p className="text-indigo-600 font-medium">Final Year Project - Electronics & Computer Science</p>
                                </div>
                            </div>
                            <p className="text-lg text-gray-700 leading-relaxed relative">
                                Welcome to <strong className="text-indigo-600">{websiteName}</strong> — a groundbreaking plagiarism detection system developed by <strong>Prathamesh Mohite</strong>, <strong>Harsh Pardeshi</strong>, <strong>Viraj Kamble</strong>, and <strong>Jay Patil</strong> at MES's Pillai College of Engineering. Born from our passion for technology and commitment to academic excellence, this project showcases the power of AI in preserving the integrity of scholarly work.
                            </p>
                        </div>

                        {/* Mission Section */}
                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-10 rounded-3xl shadow-2xl text-white relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 -ml-48 -mb-48"></div>
                            <div className="relative flex items-start gap-5 mb-6">
                                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-5">Our Mission</h2>
                                    <p className="text-purple-50 text-lg leading-relaxed">
                                        In an era dominated by AI writing assistants and unprecedented access to information, academic integrity faces new challenges. Our mission is clear: provide students, educators, and researchers with an intelligent, intuitive tool to verify originality and combat the evolving landscape of plagiarism. We're not just detecting copied content — we're building a smarter system that stays ahead of those who try to bypass it.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Technology Section */}
                        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-blue-100 hover:shadow-3xl transition-all">
                            <div className="flex items-start gap-5 mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Hybrid AI Technology</h2>
                                    <p className="text-gray-700 text-lg leading-relaxed mb-8">
                                        {websiteName} goes beyond simple text matching. Our platform leverages a <strong className="text-indigo-600">Hybrid AI Model</strong> combining multiple detection strategies for unparalleled accuracy:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border-2 border-indigo-200 hover:border-indigo-300 transition-all hover:shadow-lg">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <h3 className="font-bold text-xl text-indigo-900">Syntactic Analysis</h3>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">
                                                Employs advanced NLP algorithms including TF-IDF to detect direct word-for-word plagiarism with exceptional precision and recall.
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border-2 border-purple-200 hover:border-purple-300 transition-all hover:shadow-lg">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                </div>
                                                <h3 className="font-bold text-xl text-purple-900">Semantic Analysis</h3>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">
                                                Utilizes state-of-the-art sentence-transformer models to understand context, meaning, and intent — catching sophisticated paraphrasing attempts.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gemini Integration */}
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-10 rounded-3xl shadow-2xl text-white">
                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-5">AI-Powered Learning Assistant</h2>
                                    <p className="text-green-50 text-lg leading-relaxed mb-6">
                                        We believe in empowerment, not just enforcement. Through <strong className="text-white">Google Gemini API</strong> integration, flagged content comes with intelligent rewrite suggestions. This transforms {websiteName} from a mere detector into an educational companion that helps users understand proper citation, paraphrasing, and authentic expression.
                                    </p>
                                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
                                        <p className="text-green-50 italic">
                                            "Learn to express ideas in your own voice while maintaining academic standards — that's the future of education."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <TechStackSection />

                        {/* Guide Section */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-10 rounded-3xl shadow-2xl border-2 border-amber-200">
                            <div className="flex items-start gap-5 mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Project Guide</h2>
                                    <p className="text-gray-600 text-lg mb-8">Under the guidance and mentorship of</p>
                                    <div className="bg-white p-8 rounded-2xl border-2 border-amber-300 hover:shadow-xl transition-all max-w-md mx-auto text-center">
                                        <h3 className="font-bold text-gray-900 text-xl mb-2">Prof. Seema Mishra</h3>
                                        <p className="text-amber-600 font-medium text-lg">Assistant Professor</p>
                                        <p className="text-gray-500 text-sm mt-1">Project Guide</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Section - Lazy Loaded */}
                        <Suspense 
                            fallback={
                                <div className="bg-white p-10 rounded-3xl shadow-2xl border border-indigo-100 flex items-center justify-center min-h-[300px]">
                                    <div className="text-center">
                                        <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="text-gray-600 font-semibold">Loading team...</p>
                                    </div>
                                </div>
                            }
                        >
                            <TeamSection />
                        </Suspense>

                        {/* Institution */}
                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-12 rounded-3xl shadow-2xl text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5">
                                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                            </div>
                            <div className="relative">
                                <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                    🎓 Proudly Presented By
                                </div>
                                <h3 className="text-4xl font-bold mb-3">MES's Pillai College of Engineering</h3>
                                <p className="text-purple-100 text-xl mb-2">Department of Electronics & Computer Science</p>
                                <p className="text-indigo-200 font-medium mt-6">Final Year Project • Academic Year 2024-2025</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default About;
