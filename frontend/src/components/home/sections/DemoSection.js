import React, { useState } from 'react';
import useTextAnalysis from '../../../hooks/useTextAnalysis';
import AnalysisChart from '../charts/AnalysisChart';
import Tooltip from '../ui/Tooltip';

/**
 * Demo Section - Interactive plagiarism detection demo
 * This is the heaviest component and will be lazy-loaded
 */
const DemoSection = () => {
    const [inputText, setInputText] = useState('');
    const [analysisOutput, setAnalysisOutput] = useState('Your highlighted results will appear here.');
    const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
    const [chartData, setChartData] = useState([1, 0, 0]);
    
    const { analyze, isAnalyzing } = useTextAnalysis();

    const example1 = `AI offers amazing and unique abilities for finding copied work. The model known as GPT-3 works with both code and natural language. This is an original sentence with no matches.`;
    const example2 = `The GPT-3 model covers not only natural language but also coding language. Additionally, modern tools can automatically generate code from simple function names or comments.`;

    const handleAnalyze = async () => {
        const result = await analyze(inputText);
        
        if (result.error) {
            setAnalysisOutput(result.error);
            setChartData([1, 0, 0]);
            return;
        }

        // Render highlighted output
        const output = result.sentences.map((item, index) => {
            if (item.match.type !== 'original') {
                return (
                    <span
                        key={index}
                        className={`highlight ${item.match.type === 'direct' ? 'highlight-direct' : 'highlight-paraphrased'}`}
                        onMouseMove={(e) => handleHighlightHover(e, item.match)}
                        onMouseOut={handleHighlightOut}
                    >
                        {item.text}
                    </span>
                );
            }
            return <span key={index}>{item.text}</span>;
        });

        setAnalysisOutput(output);
        setChartData([result.stats.original, result.stats.paraphrased, result.stats.direct]);
    };

    const handleHighlightHover = (e, match) => {
        setTooltip({
            visible: true,
            content: `<strong class="text-base">${match.type.charAt(0).toUpperCase() + match.type.slice(1)} Match</strong><br><span class="text-sm">Similarity: ${(match.score * 100).toFixed(1)}%</span><br><span class="text-xs opacity-90">Source: ${match.source}</span>`,
            x: e.pageX,
            y: e.pageY,
        });
    };

    const handleHighlightOut = () => {
        setTooltip({ ...tooltip, visible: false });
    };

    return (
        <section id="demo" className="py-20 bg-white">
            <Tooltip 
                visible={tooltip.visible}
                content={tooltip.content}
                x={tooltip.x}
                y={tooltip.y}
            />

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        Try It Now
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Interactive Demo</h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Paste your own text or use one of our examples to see the hybrid detection model in action.</p>
                </div>
                
                <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                    <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-2xl text-gray-800 flex items-center gap-3">
                                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Analyze Document
                            </h3>
                            <div className="flex space-x-3">
                                <button onClick={() => setInputText(example1)} className="text-sm bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-indigo-700 px-5 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">Example 1</button>
                                <button onClick={() => setInputText(example2)} className="text-sm bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 px-5 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">Example 2</button>
                            </div>
                        </div>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full h-72 p-5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-gray-700 leading-relaxed shadow-inner"
                            placeholder="Paste your text here to analyze for plagiarism..."
                        ></textarea>
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="mt-6 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 animated-gradient"
                        >
                            {isAnalyzing ? (
                                <>
                                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Analyzing with AI...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>Analyze Text</span>
                                </>
                            )}
                        </button>
                        <div className="mt-8 p-6 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white min-h-[160px] whitespace-pre-wrap leading-loose text-gray-800 shadow-inner">
                            {analysisOutput}
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-2xl border-2 border-gray-100">
                        <h3 className="font-bold text-2xl text-center mb-8 text-gray-800 flex items-center justify-center gap-3">
                            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Analysis Summary
                        </h3>
                        <AnalysisChart data={chartData} />
                        <div id="chart-legend" className="text-center text-gray-600"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DemoSection;
