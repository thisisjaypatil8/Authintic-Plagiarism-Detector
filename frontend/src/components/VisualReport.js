import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VisualReport = ({ structuredText, analysisResult }) => {
    const [overallGuidance, setOverallGuidance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showGuidance, setShowGuidance] = useState(true);

    const getAuthToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

    // Auto-fetch overall guidance when component mounts
    useEffect(() => {
        if (analysisResult && analysisResult.flagged_sections && analysisResult.flagged_sections.length > 0) {
            fetchOverallGuidance();
        }
    }, [analysisResult]);

    const fetchOverallGuidance = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await axios.post(
                'http://localhost:5000/api/documents/guidance/summary',
                {
                    flagged_sections: analysisResult.flagged_sections,
                    overall_score: analysisResult.overall_score
                },
                { headers: { 'x-auth-token': token } }
            );
            
            setOverallGuidance(response.data);
        } catch (error) {
            console.error('Summary guidance error:', error);
            setOverallGuidance({
                summary: 'Unable to generate AI guidance at this time.',
                tips: ['Review flagged sections carefully', 'Rewrite in your own words', 'Add proper citations'],
                priority_areas: ['Flagged sections'],
                ai_generated: false
            });
        } finally {
            setLoading(false);
        }
    };

    const flaggedCount = structuredText.filter(item => item.plagiarized).length;
    
    if (flaggedCount === 0) {
        return (
            <div>
                <h3 className="text-xl font-semibold mb-4">Document Analysis</h3>
                <div className="text-center py-8 bg-green-50 rounded-lg border-2 border-green-300">
                    <p className="text-lg font-semibold text-green-700">
                        🎉 Excellent! No plagiarism detected.
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                        This document appears to be original content.
                    </p>
                </div>
                <div className="mt-6 border p-4 rounded-md bg-gray-50 leading-relaxed whitespace-pre-wrap">
                    {structuredText.map((item, index) => (
                        <span key={index}>{item.text} </span>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Guidance & Recommendations</h3>
            
            {/* Overall Guidance Summary */}
            {loading ? (
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                        <p className="text-blue-700">Generating personalized guidance...</p>
                    </div>
                </div>
            ) : overallGuidance && showGuidance ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-300 rounded-lg p-6 mb-6 shadow-md">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                                {overallGuidance.ai_generated ? '✨ AI-Powered Guidance' : '📋 Analysis Summary'}
                            </h4>
                            <p className="text-sm text-indigo-600">Overall document assessment and improvement plan</p>
                        </div>
                        <button
                            onClick={() => setShowGuidance(false)}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                            title="Hide guidance"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                            <p className="text-2xl font-bold text-red-600">{overallGuidance.overall_score}%</p>
                            <p className="text-xs text-gray-600">Similarity</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                            <p className="text-2xl font-bold text-orange-600">{overallGuidance.total_issues}</p>
                            <p className="text-xs text-gray-600">Total Issues</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                            <p className="text-2xl font-bold text-red-700">{overallGuidance.direct_matches}</p>
                            <p className="text-xs text-gray-600">Direct Matches</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                            <p className="text-2xl font-bold text-yellow-600">{overallGuidance.paraphrased}</p>
                            <p className="text-xs text-gray-600">Paraphrased</p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <span>📊</span> Summary
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed">{overallGuidance.summary}</p>
                    </div>

                    {/* Priority Areas */}
                    {overallGuidance.priority_areas && overallGuidance.priority_areas.length > 0 && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg">
                            <h5 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                                <span>🎯</span> Priority Areas
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {overallGuidance.priority_areas.map((area, i) => (
                                    <span key={i} className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Improvement Tips */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span>💡</span> How to Improve This Document
                        </h5>
                        <ol className="space-y-2">
                            {overallGuidance.tips.map((tip, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                                        {i + 1}
                                    </span>
                                    <span className="text-gray-700 text-sm pt-0.5">{tip}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Copy Button */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => {
                                const text = `PLAGIARISM GUIDANCE\n\n${overallGuidance.summary}\n\nPRIORITY AREAS:\n${overallGuidance.priority_areas?.join(', ')}\n\nIMPROVEMENT TIPS:\n${overallGuidance.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}`;
                                navigator.clipboard.writeText(text);
                                alert('Guidance copied to clipboard!');
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <span>📋</span> Copy All Guidance
                        </button>
                    </div>
                </div>
            ) : !showGuidance && (
                <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-6">
                    <button
                        onClick={() => setShowGuidance(true)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        📖 Show Guidance
                    </button>
                </div>
            )}

            {/* Highlighted Document */}
            <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Document with Highlights</h4>
                <p className="text-sm text-gray-600 mb-4">
                    <span className="inline-block w-4 h-4 bg-red-200 mr-1"></span> Direct Match
                    <span className="inline-block w-4 h-4 bg-yellow-200 ml-3 mr-1"></span> Paraphrased
                    <span className="inline-block w-4 h-4 bg-green-100 ml-3 mr-1"></span> Original
                </p>
                <div className="border-2 border-gray-300 p-6 rounded-lg bg-white leading-relaxed">
                    {structuredText.map((item, index) => {
                        if (item.plagiarized) {
                            const bgColor = item.type === 'Direct Match' ? 'bg-red-200' : 'bg-yellow-200';
                            return (
                                <span
                                    key={index}
                                    className={`${bgColor} px-1 py-0.5 rounded hover:opacity-75 transition-opacity`}
                                    title={`${item.type} - ${item.similarity}%`}
                                >
                                    {item.text}{' '}
                                </span>
                            );
                        } else {
                            return <span key={index} className="bg-green-50">{item.text} </span>;
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export default VisualReport;