import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import AnalysisReport from '../components/AnalysisReport';
import DashboardHero from '../components/dashboard/DashboardHero';
import HowToUse from '../components/dashboard/HowToUse';
import TipsSection from '../components/dashboard/TipsSection';
import FAQSection from '../components/dashboard/FAQSection';
import ModeSelector from '../components/dashboard/ModeSelector';

/**
 * Dashboard Page - Enhanced with informational content and dual-mode analysis
 * Features: Mode selection, file upload, analysis results, how-to guide, tips, and FAQ
 */
const Dashboard = () => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analyzedFile, setAnalyzedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedMode, setSelectedMode] = useState('deep'); // Default to deep mode

    const handleAnalysisStart = () => {
        setAnalysisResult(null);
        setAnalyzedFile(null);
        setErrorMessage('');
    };

    const handleAnalysisComplete = (result, file) => {
        setAnalysisResult(result);
        setAnalyzedFile(file);
        setErrorMessage('');
        
        // Scroll to results
        setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    };

    const handleAnalysisError = (error) => {
        setAnalysisResult(null);
        setAnalyzedFile(null);
        setErrorMessage(error);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Hero Section */}
                <DashboardHero />

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Left Column - Mode Selection, Upload & Results */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Analysis Mode Selection */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Choose Analysis Mode
                            </h2>
                            <ModeSelector 
                                selectedMode={selectedMode}
                                onModeChange={setSelectedMode}
                            />
                        </div>

                        {/* Upload Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Upload Your Document
                            </h2>
                            <FileUpload 
                                onAnalysisStart={handleAnalysisStart}
                                onAnalysisComplete={handleAnalysisComplete}
                                onAnalysisError={handleAnalysisError}
                                mode={selectedMode}
                            />
                        </div>

                        {/* Results Section */}
                        {analysisResult && (
                            <div id="results-section" className="scroll-mt-8">
                                <AnalysisReport 
                                    analysisResult={analysisResult} 
                                    file={analyzedFile} 
                                />
                            </div>
                        )}

                        {/* Error Display */}
                        {errorMessage && !analysisResult && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md" role="alert">
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <strong className="font-bold text-red-700">Error:</strong>
                                        <p className="text-red-600 mt-1">{errorMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Quick Info */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Why Use Authintic?
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">Dual-Mode Detection</p>
                                        <p className="text-sm text-indigo-100">Choose between fast or deep analysis</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">Google Gemini Integration</p>
                                        <p className="text-sm text-indigo-100">AI-powered rewrite suggestions</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">Detailed Reports</p>
                                        <p className="text-sm text-indigo-100">Comprehensive source identification</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature Highlight */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">100% Secure</h3>
                                <p className="text-gray-600 text-sm">
                                    Your documents are analyzed securely and never stored permanently
                                </p>
                            </div>
                        </div>

                        {/* Need Help? */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Need Help?
                            </h3>
                            <p className="text-gray-700 text-sm mb-3">
                                Check our detailed guide and FAQ below for assistance with the plagiarism checker.
                            </p>
                            <button 
                                onClick={() => document.getElementById('how-to-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                View Guide
                            </button>
                        </div>
                    </div>
                </div>

                {/* How To Use Section */}
                <div id="how-to-section" className="scroll-mt-8">
                    <HowToUse />
                </div>

                {/* Tips Section */}
                <TipsSection />

                {/* FAQ Section */}
                <FAQSection />
            </div>
        </div>
    );
};

export default Dashboard;