import React from 'react';

/**
 * How To Use Component
 * Step-by-step guide for using the plagiarism checker
 */
const HowToUse = () => {
    const steps = [
        {
            number: "1",
            title: "Upload Your Document",
            description: "Click the upload area and select your document (.docx, .txt, or .pdf). We support files up to 10MB.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            ),
            color: "indigo"
        },
        {
            number: "2",
            title: "AI Analysis Begins",
            description: "Our hybrid AI model analyzes your document using both syntactic (TF-IDF) and semantic (transformer models) detection.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            color: "purple"
        },
        {
            number: "3",
            title: "Review Results",
            description: "Get a detailed report with highlighted matches, similarity scores, and source identification for each flagged section.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            color: "pink"
        },
        {
            number: "4",
            title: "Get Suggestions",
            description: "Use our AI-powered rewrite suggestions (powered by Google Gemini) to improve flagged content while maintaining originality.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            color: "green"
        }
    ];

    const colorMap = {
        indigo: "from-indigo-500 to-indigo-600",
        purple: "from-purple-500 to-purple-600",
        pink: "from-pink-500 to-pink-600",
        green: "from-green-500 to-green-600"
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    How It Works
                </h2>
                <p className="text-gray-600 text-lg">
                    Follow these simple steps to check your document for plagiarism
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-all hover:shadow-lg group"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[step.color]} rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                                {step.number}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                                    {step.title}
                                    <span className={`text-${step.color}-600`}>
                                        {step.icon}
                                    </span>
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HowToUse;
