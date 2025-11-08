import React, { useState } from 'react';
import axios from 'axios';

// This component ONLY renders the visual text and manages its own tooltip
const VisualReport = ({ structuredText }) => {
    const [tooltip, setTooltip] = useState({
        visible: false,
        item: null,
        index: null,
        x: 0,
        y: 0,
    });
    const [rewriteSuggestions, setRewriteSuggestions] = useState({});
    const [rewritingIndex, setRewritingIndex] = useState(null);

    const getAuthToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

    const handleRewrite = async (sentence, index) => {
        setRewritingIndex(index);
        try {
            const token = getAuthToken();
            const response = await axios.post('http://localhost:5000/api/documents/rewrite', 
                { sentence },
                { headers: { 'x-auth-token': token } }
            );
            
            setRewriteSuggestions(prev => ({
                ...prev,
                [index]: response.data.rewritten_text
            }));
        } catch (error) {
            console.error('Rewrite error:', error);
            const errorMsg = error.response?.data?.error || 'Error generating suggestion.';
            setRewriteSuggestions(prev => ({
                ...prev,
                [index]: errorMsg
            }));
        }
        setRewritingIndex(null);
    };

    const handleHighlightClick = (e, item, index) => {
        if (!item.plagiarized) {
            setTooltip({ visible: false });
            return;
        }

        const rect = e.target.getBoundingClientRect();
        setTooltip({
            visible: true,
            item: item,
            index: index,
            x: window.scrollX + rect.left + rect.width / 2,
            y: window.scrollY + rect.top,
        });
    };

    return (
        // This outer div now handles closing the tooltip
        <div onClick={() => setTooltip({ visible: false })}>
            {tooltip.visible && tooltip.item && (
                <div
                    className="tooltip visible"
                    style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
                    onClick={(e) => e.stopPropagation()} // Clicks inside tooltip don't close it
                >
                    <div className="p-2 text-sm">
                        <p>
                            <span className="font-bold">{tooltip.item.type}</span>
                            <span className={`ml-2 font-bold ${tooltip.item.type === 'Direct Match' ? 'text-red-300' : 'text-yellow-300'}`}>
                                ({tooltip.item.similarity}%)
                            </span>
                        </p>
                        <p className="mt-2 text-gray-300">
                            <span className="font-semibold">Source:</span> {tooltip.item.source}
                        </p>
                        <div className="mt-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRewrite(tooltip.item.text, tooltip.index);
                                }}
                                disabled={rewritingIndex === tooltip.index}
                                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {rewritingIndex === tooltip.index ? 'Generating...' : '✨ Suggest Rewrite'}
                            </button>
                            
                            {rewriteSuggestions[tooltip.index] && (
                                <div className="mt-2 p-3 bg-gray-700 rounded-md">
                                    <p className="text-sm text-white">{rewriteSuggestions[tooltip.index]}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <h3 className="text-xl font-semibold mb-4">Highlighted Document</h3>
            <p className="text-sm text-gray-500 mb-4">Click on a highlighted section for details and rewrite options.</p>
            <div className="border p-4 rounded-md bg-gray-50 leading-relaxed whitespace-pre-wrap">
                {structuredText.map((item, index) => {
                    if (item.plagiarized) {
                        return (
                            <span
                                key={index}
                                className={`highlight ${item.type === 'Direct Match' ? 'highlight-direct' : 'highlight-paraphrased'}`}
                                onClick={(e) => {
                                    e.stopPropagation(); // Stop click from bubbling up
                                    handleHighlightClick(e, item, index);
                                }}
                            >
                                {item.text}{' '}
                            </span>
                        );
                    } else {
                        return <span key={index}>{item.text} </span>;
                    }
                })}
            </div>
        </div>
    );
};

export default VisualReport;