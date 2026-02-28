import React from 'react';
import { IconShield, IconMicroscope } from '../Icons';

/**
 * Problem Section — "Why You'll Love Using Authintic" with alternating white/light-blue
 */
const ProblemSection = () => {
    return (
        <>
            {/* Section 1: Why Authintic — teal header band */}
            <section className="py-16" style={{ background: '#0ABAB5' }}>
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Why You'll Love Using Authintic
                    </h2>
                    <p className="text-white/80 max-w-3xl mx-auto text-lg leading-relaxed">
                        Authintic helps you identify potential issues before submission. Run a full plagiarism and 
                        AI content check with our 3-layer hybrid detector, so you can submit your work with confidence.
                    </p>
                </div>
            </section>

            {/* Section 2: Features with alternating layout */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    {/* Feature 1 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Get Detailed Reports — Know Exactly Where Issues Are
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                See exactly which sentences were flagged and by which detection layer. 
                                Our reports include Turnitin-style highlighting with color-coded results: 
                                red for direct matches, yellow for paraphrased, and purple for AI-generated content. 
                                Each flagged section shows the source reference and similarity score.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">Direct Match</span>
                                    <span className="text-sm text-gray-700">Exact wording from source</span>
                                </div>
                                <div className="flex items-center gap-3 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                                    <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">Paraphrased</span>
                                    <span className="text-sm text-gray-700">Same meaning, different words</span>
                                </div>
                                <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                                    <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">AI-Generated</span>
                                    <span className="text-sm text-gray-700">Caught by BERT classifier</span>
                                </div>
                                <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Original</span>
                                    <span className="text-sm text-gray-700">Your own writing ✓</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                        <div className="order-2 md:order-1 rounded-2xl p-8 border border-gray-200" style={{ background: '#E8F4FD' }}>
                            <div className="text-center">
                                <div className="mb-4 flex justify-center"><IconShield className="w-12 h-12" style={{ color: '#0ABAB5' }} /></div>
                                <p className="text-lg font-semibold text-gray-800">Your Document is Secure</p>
                                <p className="text-sm text-gray-600 mt-2">Analyzed in real-time, never stored permanently</p>
                                <div className="mt-4 flex justify-center gap-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Not indexed
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Not collected
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Keep Your Academic Integrity Intact
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Early results give you time to revise before final submission. 
                                Authintic helps reduce risk and uncertainty by showing you exactly 
                                how your essay will be evaluated — without storing your paper in any database.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                3-Layer Detection — Beyond Simple Keyword Matching
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Traditional tools only check for identical words. Authintic uses three layers 
                                of analysis to catch even the most sophisticated forms of plagiarism:
                            </p>
                            <ol className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0ABAB5' }}>1</span>
                                    <div>
                                        <span className="font-semibold text-gray-900">TF-IDF Cosine Similarity</span>
                                        <p className="text-sm text-gray-500">Catches direct copies and close matches</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0ABAB5' }}>2</span>
                                    <div>
                                        <span className="font-semibold text-gray-900">FAISS Semantic Search</span>
                                        <p className="text-sm text-gray-500">Finds meaning-level similarities across 1.77M indexed vectors</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0ABAB5' }}>3</span>
                                    <div>
                                        <span className="font-semibold text-gray-900">BERT Classifier</span>
                                        <p className="text-sm text-gray-500">Detects AI-paraphrased content (fine-tuned on PAN25)</p>
                                    </div>
                                </li>
                            </ol>
                        </div>
                        <div className="rounded-2xl p-8 border border-gray-200 text-center" style={{ background: '#E8F4FD' }}>
                            <div className="mb-4 flex justify-center"><IconMicroscope className="w-14 h-14" style={{ color: '#0ABAB5' }} /></div>
                            <p className="text-lg font-bold text-gray-900 mb-2">Hybrid Analysis</p>
                            <p className="text-sm text-gray-600">TF-IDF → FAISS → BERT cascade</p>
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <p className="text-lg font-bold" style={{ color: '#0ABAB5' }}>F1</p>
                                    <p className="text-xs text-gray-500">0.78</p>
                                    <p className="text-xs text-gray-400">TF-IDF</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <p className="text-lg font-bold" style={{ color: '#0ABAB5' }}>F1</p>
                                    <p className="text-xs text-gray-500">0.71</p>
                                    <p className="text-xs text-gray-400">FAISS</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <p className="text-lg font-bold" style={{ color: '#0ABAB5' }}>F1</p>
                                    <p className="text-xs text-gray-500">1.00</p>
                                    <p className="text-xs text-gray-400">BERT</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProblemSection;
