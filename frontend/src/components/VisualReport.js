import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconCheck, IconStar, IconClipboard, IconChart, IconTarget, IconLightbulb, IconBookOpen } from './Icons';

const VisualReport = ({ structuredText, analysisResult }) => {
    const [overallGuidance, setOverallGuidance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showGuidance, setShowGuidance] = useState(true);

    // Convert **bold** markdown to <strong> HTML
    const renderMarkdown = (text) => {
        if (!text) return '';
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    const getAuthToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

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
    
    // Color mapping for 4 types
    const getHighlightStyle = (type) => {
        switch (type) {
            case 'Direct Match':
                return { bg: 'bg-red-100 border-red-300', dot: 'bg-red-500', text: 'text-red-700' };
            case 'AI-Paraphrased':
                return { bg: 'bg-purple-100 border-purple-300', dot: 'bg-purple-500', text: 'text-purple-700' };
            case 'Paraphrased':
            default:
                return { bg: 'bg-yellow-100 border-yellow-300', dot: 'bg-yellow-500', text: 'text-yellow-700' };
        }
    };

    if (flaggedCount === 0) {
        return (
            <div>
                <h3 className="text-xl font-semibold mb-4">Document Analysis</h3>
                <div className="text-center py-8 bg-green-50 rounded-xl border-2 border-green-300">
                    <p className="text-lg font-semibold text-green-700">
                        <span className="inline-flex items-center gap-2"><IconCheck className="w-5 h-5 text-green-600" /> Excellent! No plagiarism detected.</span>
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                        This document appears to be original content.
                    </p>
                </div>
                <div className="mt-6 border p-4 rounded-xl bg-gray-50 whitespace-pre-wrap visual-report-text">
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
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                        <p className="text-blue-700">Generating personalized guidance...</p>
                    </div>
                </div>
            ) : overallGuidance && showGuidance ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-300 rounded-xl p-6 mb-6 shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                                {overallGuidance.ai_generated ? <span className="inline-flex items-center gap-2"><IconStar className="w-5 h-5" style={{ color: '#0ABAB5' }} /> AI-Powered Guidance</span> : <span className="inline-flex items-center gap-2"><IconClipboard className="w-5 h-5" /> Analysis Summary</span>}
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
                            <IconChart className="w-5 h-5" style={{ color: '#0ABAB5' }} /> Summary
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(overallGuidance.summary) }}></p>
                    </div>

                    {/* Priority Areas */}
                    {overallGuidance.priority_areas && overallGuidance.priority_areas.length > 0 && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg">
                            <h5 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                                <IconTarget className="w-5 h-5" style={{ color: '#F59E0B' }} /> Priority Areas
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
                            <IconLightbulb className="w-5 h-5" style={{ color: '#0ABAB5' }} /> How to Improve This Document
                        </h5>
                        <ol className="space-y-2">
                            {overallGuidance.tips.map((tip, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                                        {i + 1}
                                    </span>
                                    <span className="text-gray-700 text-sm pt-0.5" dangerouslySetInnerHTML={{ __html: renderMarkdown(tip) }}></span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => {
                                const text = `PLAGIARISM GUIDANCE\n\n${overallGuidance.summary}\n\nPRIORITY AREAS:\n${overallGuidance.priority_areas?.join(', ')}\n\nIMPROVEMENT TIPS:\n${overallGuidance.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}`;
                                navigator.clipboard.writeText(text);
                                alert('Guidance copied to clipboard!');
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <IconClipboard className="w-4 h-4" /> Copy All Guidance
                        </button>
                    </div>
                </div>
            ) : !showGuidance && (
                <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-6">
                    <button
                        onClick={() => setShowGuidance(true)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <span className="inline-flex items-center gap-2"><IconBookOpen className="w-4 h-4" /> Show Guidance</span>
                    </button>
                </div>
            )}

            {/* Highlighted Document */}
            <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Document with Highlights</h4>
                <p className="text-sm text-gray-600 mb-4 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-4 h-4 bg-red-200 rounded"></span> Direct Match
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-4 h-4 bg-yellow-200 rounded"></span> Paraphrased
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-4 h-4 bg-purple-200 rounded"></span> AI-Paraphrased (BERT)
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-4 h-4 bg-green-100 rounded"></span> Original
                    </span>
                </p>
                <div className="border-2 border-gray-200 p-6 rounded-xl bg-white visual-report-text">
                    {structuredText.map((item, index) => {
                        if (item.plagiarized) {
                            const style = getHighlightStyle(item.type);
                            return (
                                <span
                                    key={index}
                                    className={`${style.bg} border px-1 py-0.5 rounded hover:opacity-80 transition-opacity cursor-help relative group`}
                                    title={`${item.type} — ${item.similarity}%${item.layer ? ` | ${item.layer}` : ''}`}
                                >
                                    {item.text}{' '}
                                    {/* Layer badge on hover */}
                                    {item.layer && (
                                        <span className="hidden group-hover:inline-block absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                            {item.layer}
                                        </span>
                                    )}
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