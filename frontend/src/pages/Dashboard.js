import React, { useState } from 'react';
import { IconBolt, IconSearch } from '../components/Icons';
import FileUpload from '../components/FileUpload';
import AnalysisReport from '../components/AnalysisReport';
import FAQSection from '../components/dashboard/FAQSection';

const Dashboard = () => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analyzedFile, setAnalyzedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedMode, setSelectedMode] = useState('deep');
    const [activeTab, setActiveTab] = useState('detector');

    const user = JSON.parse(localStorage.getItem('user'));
    const userName = user?.user?.name || user?.name || 'User';

    const handleAnalysisStart = () => {
        setAnalysisResult(null);
        setAnalyzedFile(null);
        setErrorMessage('');
    };

    const handleAnalysisComplete = (result, file) => {
        setAnalysisResult(result);
        setAnalyzedFile(file);
        setErrorMessage('');
        setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    };

    const handleAnalysisError = (error) => {
        setAnalysisResult(null);
        setAnalyzedFile(null);
        setErrorMessage(error);
    };

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )},
        { id: 'detector', label: 'Plagiarism Detector', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        )},
        { id: 'faq', label: 'FAQ & Guide', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )},
        { id: 'settings', label: 'Settings', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )},
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 py-6 px-4">
                {/* Logo */}
                <div className="mb-8 px-2 flex items-center gap-2 cursor-pointer logo-hover">
                    <img src="/logo.png" alt="Authintic" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-extrabold tracking-tight logo-animated logo-hover">
                        <span className="logo-teal" style={{ color: '#0ABAB5' }}>A</span>
                        <span className="text-gray-800">uth</span>
                        <span className="logo-teal" style={{ color: '#0ABAB5' }}>i</span>
                        <span className="text-gray-800">ntic</span>
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1">
                    {/* Home / Back */}
                    <a
                        href="/"
                        className="sidebar-link w-full text-gray-500 hover:text-[#0ABAB5]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </a>
                    <div className="border-b border-gray-100 my-2"></div>
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`sidebar-link w-full ${activeTab === item.id ? 'active' : ''}`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* User */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#0ABAB5' }}>
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{userName}</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile tab bar */}
                <div className="lg:hidden flex border-b border-gray-200 bg-white overflow-x-auto">
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                activeTab === item.id 
                                    ? 'border-[#0ABAB5] text-[#0ABAB5]' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="p-6 lg:p-10 max-w-5xl">
                    {/* Detector Tab */}
                    {(activeTab === 'detector' || activeTab === 'dashboard') && (
                        <>
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-900">Plagiarism & AI Detector</h1>
                                <p className="text-gray-500 mt-1">Get accurate plagiarism and AI-generated content detection.</p>
                            </div>

                            {/* Mode Selector */}
                            <div className="flex gap-3 mb-6">
                                <button
                                    onClick={() => setSelectedMode('fast')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        selectedMode === 'fast'
                                            ? 'text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                    style={selectedMode === 'fast' ? { background: '#0ABAB5' } : {}}
                                >
                                    <span className="inline-flex items-center gap-1"><IconBolt className="w-4 h-4" /> Fast Mode (TF-IDF)</span>
                                </button>
                                <button
                                    onClick={() => setSelectedMode('deep')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        selectedMode === 'deep'
                                            ? 'text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                    style={selectedMode === 'deep' ? { background: '#0ABAB5' } : {}}
                                >
                                    <span className="inline-flex items-center gap-1"><IconSearch className="w-4 h-4" /> Deep Mode (All 3 Layers)</span>
                                </button>
                            </div>

                            {/* File Upload */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
                                <FileUpload
                                    onAnalysisStart={handleAnalysisStart}
                                    onAnalysisComplete={handleAnalysisComplete}
                                    onAnalysisError={handleAnalysisError}
                                    mode={selectedMode}
                                />
                            </div>

                            {/* After submit notice */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                                <p className="text-gray-500 text-sm">
                                    After submitting, you will receive a <strong className="text-gray-800">Similarity Report</strong> and an <strong className="text-gray-800">AI Report</strong>.
                                </p>
                            </div>

                            {/* Results */}
                            {analysisResult && (
                                <div id="results-section" className="scroll-mt-8">
                                    <AnalysisReport analysisResult={analysisResult} file={analyzedFile} />
                                </div>
                            )}

                            {/* Error */}
                            {errorMessage && !analysisResult && (
                                <div className="bg-red-50 border border-red-200 p-5 rounded-xl" role="alert">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold text-red-700 text-sm">Analysis Error</p>
                                            <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* FAQ Tab */}
                    {activeTab === 'faq' && <FAQSection />}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
                            <div className="bg-white rounded-2xl border border-gray-200 p-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input 
                                            type="text" 
                                            value={userName} 
                                            readOnly 
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input 
                                            type="text" 
                                            value={user?.user?.email || user?.email || ''} 
                                            readOnly 
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Analysis Mode</label>
                                        <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-600">
                                            <option>Deep Mode (All 3 Layers)</option>
                                            <option>Fast Mode (TF-IDF Only)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;