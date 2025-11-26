import React, { useState } from 'react';

/**
 * GuidanceCard - Displays educational guidance for plagiarism fixes
 * Shows issue, tips, key phrases, and source in an expandable card
 */
const GuidanceCard = ({ section, index, onMarkReviewed }) => {
    const [expanded, setExpanded] = useState(false);
    
    const severityColors = {
        high: 'bg-red-50 border-red-300 border-l-4',
        medium: 'bg-yellow-50 border-yellow-300 border-l-4',
        low: 'bg-green-50 border-green-300 border-l-4'
    };
    
    const severityIcons = {
        high: '🔴',
        medium: '🟡',
        low: '🟢'
    };
    
    const copyGuidance = () => {
        const text = `Issue: ${section.guidance.issue}\n\nHow to Fix:\n${section.guidance.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}`;
        navigator.clipboard.writeText(text);
        alert('Guidance copied to clipboard!');
    };
    
    return (
        <div className={`border-2 rounded-lg p-4 mb-4 ${severityColors[section.guidance.severity]} transition-all`}>
            {/* Header - Click to expand/collapse */}
            <div 
                className="flex justify-between items-start cursor-pointer" 
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{severityIcons[section.guidance.severity]}</span>
                        <span className="font-bold text-gray-900">{section.type}</span>
                        <span className="text-sm text-gray-600">({section.similarity}% match)</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {section.guidance.ai_generated ? '✨ AI-Powered Guidance' : '📋 Rule-Based Guidance'}
                    </p>
                </div>
                <button className="text-gray-600 hover:text-gray-900 text-xl">
                    {expanded ? '▼' : '▶'}
                </button>
            </div>
            
            {/* Flagged Text Preview */}
            <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                <p className="text-sm text-gray-700 italic">
                    "{section.text.substring(0, 150)}{section.text.length > 150 ? '...' : ''}"
                </p>
            </div>
            
            {/* Expanded Guidance Content */}
            {expanded && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                    {/* Issue Explanation */}
                    <div className="bg-white p-3 rounded-lg border border-red-200">
                        <p className="font-semibold text-red-700 flex items-center gap-2">
                            <span>⚠️</span> Issue:
                        </p>
                        <p className="text-sm text-gray-700 mt-1">{section.guidance.issue}</p>
                    </div>
                    
                    {/* Tips */}
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <p className="font-semibold text-blue-700 flex items-center gap-2 mb-2">
                            <span>💡</span> How to Fix:
                        </p>
                        <ul className="list-decimal pl-5 space-y-2">
                            {section.guidance.tips.map((tip, i) => (
                                <li key={i} className="text-sm text-gray-700">{tip}</li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Key Phrases (if available) */}
                    {section.guidance.key_phrases && section.guidance.key_phrases.length > 0 && (
                        <div className="bg-white p-3 rounded-lg border border-purple-200">
                            <p className="font-semibold text-purple-700 flex items-center gap-2 mb-2">
                                <span>🔍</span> Key Phrases to Change:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {section.guidance.key_phrases.map((phrase, i) => (
                                    <span 
                                        key={i} 
                                        className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
                                    >
                                        "{phrase}"
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Source */}
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-700 flex items-center gap-2">
                            <span>📚</span> Source:
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{section.source}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                copyGuidance();
                            }}
                            className="flex-1 text-sm px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <span>📋</span> Copy Guidance
                        </button>
                        {onMarkReviewed && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkReviewed(index);
                                }}
                                className="flex-1 text-sm px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <span>✅</span> Mark as Reviewed
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuidanceCard;
