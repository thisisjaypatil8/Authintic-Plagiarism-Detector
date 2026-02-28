import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ProblemSection from '../components/home/ProblemSection';
import SolutionSection from '../components/home/SolutionSection';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <HeroSection />

            {/* Problem / Features Section */}
            <ProblemSection />

            {/* How To Use Section */}
            <SolutionSection />

            {/* Testimonials Section */}
            <section className="py-20" style={{ background: '#F5F5F5' }}>
                <div className="container mx-auto px-6 max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
                        What Students Say About Authintic
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: 'Cleopatra J.', text: 'The report is incredibly detailed with color-coded results. Knowing exactly which layer flagged each sentence gives me real confidence before submitting.', stars: 5 },
                            { name: 'Isabella A.', text: "Easy to use and fast! The 3-layer analysis catches paraphrased content that other tools completely miss. Plus, my document isn't stored anywhere.", stars: 5 },
                            { name: 'Valentina Y.', text: "I checked my draft before uploading to Canvas. The AI detection report helped me fix issues and everything went through fine. Great tool!", stars: 5 }
                        ].map((review, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(review.stars)].map((_, j) => (
                                        <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">{review.text}</p>
                                <div className="border-t border-gray-100 pt-3">
                                    <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
