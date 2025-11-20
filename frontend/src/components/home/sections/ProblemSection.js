import React from 'react';

/**
 * Problem Section - Showcases the challenge traditional tools face
 * and how Authintic solves it
 */
const ProblemSection = () => {
    return (
        <section id="problem" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        The Challenge
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Beyond Simple Copying</h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Traditional plagiarism detectors are good at finding exact matches, but struggle with AI-assisted paraphrasing—where the meaning is copied, but the words are changed.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-10 items-stretch max-w-6xl mx-auto">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative bg-white p-8 rounded-2xl shadow-xl border-2 border-red-100 hover:border-red-200 transition-all h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg float-animation">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-2xl text-red-700">Traditional Detection Fails</h3>
                            </div>
                            <p className="text-gray-600 mb-6 text-lg">A simple text-matcher would likely miss the connection between these two paragraphs.</p>
                            <div className="space-y-5">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border-l-4 border-gray-400 hover:shadow-md transition-shadow">
                                    <p className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Source Text:
                                    </p>
                                    <p className="text-gray-800 leading-relaxed">Recent developments in extensive auto-code completion could fill in the actual code with a few comments or a function name without other inputs.</p>
                                </div>
                                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-5 rounded-xl border-l-4 border-red-500 hover:shadow-md transition-shadow">
                                    <p className="font-bold text-sm text-red-700 mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Paraphrased Text:
                                    </p>
                                    <p className="text-gray-800 leading-relaxed">Modern tools can automatically generate code from simple function names or comments, requiring minimal user input.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative bg-white p-8 rounded-2xl shadow-xl border-2 border-green-100 hover:border-green-200 transition-all h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg float-animation" style={{animationDelay: '0.5s'}}>
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-2xl text-green-700">Authintic's Solution</h3>
                            </div>
                            <p className="text-gray-600 mb-6 text-lg">Our system analyzes the underlying meaning (semantics) to identify such cases as highly similar.</p>
                            <div className="text-center py-10 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl border-2 border-green-200 hover:shadow-inner transition-all">
                                <div className="text-7xl mb-6 float-animation" style={{animationDelay: '1s'}}>🧠</div>
                                <p className="font-bold text-gray-900 px-6 text-lg leading-relaxed mb-3">Context-Aware Intelligence</p>
                                <p className="text-gray-700 px-6">By understanding context, not just words, our hybrid model successfully flags sophisticated plagiarism.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
