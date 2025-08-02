// frontend/src/pages/Home.js

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const Home = () => {
    // State management for the interactive demo
    const [inputText, setInputText] = useState('');
    const [analysisOutput, setAnalysisOutput] = useState('Your highlighted results will appear here.');
    const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

    // Refs for chart and process details
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const processDetailsRef = useRef(null);
    const processStepsRef = useRef(null);

    const processData = [
        { id: 'upload', title: '1. Document Upload', icon: '📤', description: 'The user uploads their document through the web interface. The raw text is extracted for processing.' },
        { id: 'preprocess', title: '2. Preprocessing', icon: '⚙️', description: 'The text is cleaned and split into individual sentences. This step prepares the data for accurate analysis.' },
        { id: 'hybrid', title: '3. Hybrid Analysis', icon: '🔬', description: 'Each sentence undergoes a two-stage check: a fast syntactic analysis for direct copies, followed by a deep semantic analysis for paraphrased content.' },
        { id: 'report', title: '4. Report Generation', icon: '📊', description: 'A comprehensive report is generated, highlighting plagiarized sections, identifying original sources, and providing an overall similarity score.' }
    ];
    
    // Effect for initializing the process diagram and chart
    useEffect(() => {
        const updateProcessDetails = (id) => {
            const step = processData.find(s => s.id === id);
            if (processDetailsRef.current) {
                processDetailsRef.current.innerHTML = `<h4 class="font-bold text-lg text-indigo-800">${step.title}</h4><p class="mt-2 text-indigo-700">${step.description}</p>`;
            }
            processStepsRef.current.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('bg-indigo-100', 'border-indigo-500');
            });
            document.getElementById(`step-btn-${id}`)?.classList.add('bg-indigo-100', 'border-indigo-500');
        };

        updateProcessDetails('upload');

        updateChart([1, 0, 0], 'Analysis results will be summarized here.');

        // Cleanup chart on component unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    const handleProcessClick = (id) => {
        const step = processData.find(s => s.id === id);
        if (processDetailsRef.current) {
            processDetailsRef.current.innerHTML = `<h4 class="font-bold text-lg text-indigo-800">${step.title}</h4><p class="mt-2 text-indigo-700">${step.description}</p>`;
        }
        processStepsRef.current.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('bg-indigo-100', 'border-indigo-500');
        });
        document.getElementById(`step-btn-${id}`)?.classList.add('bg-indigo-100', 'border-indigo-500');
    };

    const sourceDocuments = {
        "source-doc-01.txt": "Artificial Intelligence has great capacities that are cutting edge and exceptional for plagiarism detection.",
        "source-doc-02.txt": "The GPT-3 model covers not only natural language but also coding language.",
        "source-doc-03.txt": "Recent developments in extensive auto-code completion could fill in the actual code with a few comments or a function name."
    };

    const example1 = `AI offers amazing and unique abilities for finding copied work. The model known as GPT-3 works with both code and natural language. This is an original sentence with no matches.`;
    const example2 = `The GPT-3 model covers not only natural language but also coding language. Additionally, modern tools can automatically generate code from simple function names or comments.`;

    const simpleTextSimilarity = (text1, text2) => {
        const words1 = new Set(text1.toLowerCase().split(/\s+/));
        const words2 = new Set(text2.toLowerCase().split(/\s+/));
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        return union.size === 0 ? 0 : intersection.size / union.size;
    };

    const handleAnalyze = () => {
        const text = inputText;
        if (!text.trim()) {
            setAnalysisOutput('Please enter some text to analyze.');
            return;
        }

        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        let results = [];
        let directMatches = 0;
        let paraphrasedMatches = 0;

        sentences.forEach(sentence => {
            let bestMatch = { score: 0, source: null, type: 'original' };

            for (const [sourceName, sourceText] of Object.entries(sourceDocuments)) {
                const score = simpleTextSimilarity(sentence, sourceText);
                if (score > bestMatch.score) {
                    bestMatch = { score, source: sourceName, type: 'paraphrased' };
                }
            }
            
            if (Object.values(sourceDocuments).some(src => src.trim() === sentence.trim())) {
                 bestMatch.score = 1.0;
                 bestMatch.type = 'direct';
            }

            if (bestMatch.score > 0.95) {
                bestMatch.type = 'direct';
                directMatches++;
            } else if (bestMatch.score > 0.4) {
                bestMatch.type = 'paraphrased';
                paraphrasedMatches++;
            } else {
                bestMatch.type = 'original';
            }
            results.push({ text: sentence, match: bestMatch });
        });

        const output = results.map((result, index) => {
            if (result.match.type !== 'original') {
                return (
                    <span
                        key={index}
                        className={`highlight ${result.match.type === 'direct' ? 'highlight-direct' : 'highlight-paraphrased'}`}
                        onMouseMove={(e) => handleHighlightHover(e, result.match)}
                        onMouseOut={handleHighlightOut}
                    >
                        {result.text}
                    </span>
                );
            }
            return <span key={index}>{result.text}</span>;
        });

        setAnalysisOutput(output);
        const totalSentences = sentences.length;
        const originalCount = totalSentences - directMatches - paraphrasedMatches;
        updateChart([originalCount, paraphrasedMatches, directMatches]);
    };

    const handleHighlightHover = (e, match) => {
        setTooltip({
            visible: true,
            content: `<strong>${match.type.charAt(0).toUpperCase() + match.type.slice(1)} Match</strong><br>Similarity: ${(match.score * 100).toFixed(1)}%<br>Source: ${match.source}`,
            x: e.pageX,
            y: e.pageY,
        });
    };

    const handleHighlightOut = () => {
        setTooltip({ ...tooltip, visible: false });
    };
    
    const updateChart = (data, legendText) => {
        const chartLegend = document.getElementById('chart-legend');
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const [original, paraphrased, direct] = data;
        const total = original + paraphrased + direct;

        if (total === 0 || legendText) {
            if(chartLegend) chartLegend.textContent = legendText || 'No data to display.';
            return;
        }

        chartInstanceRef.current = new Chart(chartRef.current, {
            type: 'doughnut',
            data: {
                labels: ['Original', 'Paraphrased', 'Direct Match'],
                datasets: [{
                    data: data,
                    backgroundColor: ['rgba(79, 70, 229, 0.7)', 'rgba(251, 191, 36, 0.8)', 'rgba(239, 68, 68, 0.8)'],
                    borderColor: '#f8f7f4',
                    borderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: { legend: { display: false } }
            }
        });

        const originalPercent = ((original / total) * 100).toFixed(1);
        const paraphrasedPercent = ((paraphrased / total) * 100).toFixed(1);
        const directPercent = ((direct / total) * 100).toFixed(1);
        
        if(chartLegend) {
            chartLegend.innerHTML = `
                <div class="flex justify-center space-x-4">
                    <span class="font-semibold"><span class="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>${originalPercent}% Original</span>
                    <span class="font-semibold"><span class="inline-block w-3 h-3 rounded-full bg-amber-400 mr-2"></span>${paraphrasedPercent}% Paraphrased</span>
                    <span class="font-semibold"><span class="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>${directPercent}% Direct</span>
                </div>
            `;
        }
    };

    return (
        <>
            <div id="tooltip" className={`tooltip ${tooltip.visible ? 'visible' : ''}`} style={{ left: tooltip.x, top: tooltip.y }} dangerouslySetInnerHTML={{ __html: tooltip.content }}></div>
            
            <section id="hero" className="py-20 md:py-32 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                        A New Era of Plagiarism Detection
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        This project, "Authintic," is an AI-powered system designed to address the challenges of modern academic integrity, tackling sophisticated paraphrasing where traditional tools fail.
                    </p>
                    <div className="mt-10">
                        <a href="#demo" className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition transform hover:scale-105">
                            Explore the Interactive Demo
                        </a>
                    </div>
                </div>
            </section>

            <section id="problem" className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">The Problem: Beyond Simple Copying</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Traditional plagiarism detectors are good at finding exact matches, but struggle with AI-assisted paraphrasing—where the meaning is copied, but the words are changed.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-red-200">
                            <h3 className="font-bold text-xl mb-2 text-red-700">Traditional Detection Fails Here</h3>
                            <p className="text-sm text-gray-500 mb-4">A simple text-matcher would likely miss the connection between these two paragraphs.</p>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded"><p className="font-semibold text-sm">Source Text:</p><p className="text-gray-700">Recent developments in extensive auto-code completion could fill in the actual code with a few comments or a function name without other inputs.</p></div>
                                <div className="bg-red-50 p-4 rounded"><p className="font-semibold text-sm">Paraphrased Text:</p><p className="text-gray-700">Modern tools can automatically generate code from simple function names or comments, requiring minimal user input.</p></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-green-200">
                            <h3 className="font-bold text-xl mb-2 text-green-700">Authintic's Semantic Solution</h3>
                            <p className="text-sm text-gray-500 mb-4">Our system analyzes the underlying meaning (semantics) to identify such cases as highly similar.</p>
                            <div className="text-center py-10"><div className="text-5xl mb-4">🧠</div><p className="font-semibold text-gray-800">By understanding context, not just words, our hybrid model successfully flags sophisticated plagiarism.</p></div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section id="solution" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Hybrid Analysis Process</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Authintic uses a multi-stage process to ensure comprehensive and accurate detection. Click each step to learn more.</p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center items-start gap-4">
                        <div ref={processStepsRef} className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 w-full">
                            {processData.map((step) => (
                                <button key={step.id} id={`step-btn-${step.id}`} onClick={() => handleProcessClick(step.id)} className="flex-1 p-4 bg-white rounded-lg shadow-md text-left flex items-center space-x-4 border-2 border-transparent hover:border-indigo-500 hover:bg-indigo-50 transition">
                                    <div className="text-3xl">{step.icon}</div>
                                    <div><h4 className="font-bold">{step.title}</h4></div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div ref={processDetailsRef} className="mt-8 bg-indigo-50 p-6 rounded-lg min-h-[120px] transition"></div>
                </div>
            </section>

            <section id="demo" className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Interactive Demo</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Paste your own text or use one of our examples to see the hybrid detection model in action.</p>
                    </div>
                    <div className="grid lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-xl">Analyze Document</h3>
                                <div className="flex space-x-2">
                                    <button onClick={() => setInputText(example1)} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md">Example 1</button>
                                    <button onClick={() => setInputText(example2)} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md">Example 2</button>
                                </div>
                            </div>
                            <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full h-80 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" placeholder="Paste your text here..."></textarea>
                            <button onClick={handleAnalyze} className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">Analyze Text</button>
                            <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50 min-h-[100px] whitespace-pre-wrap">
                                {analysisOutput}
                            </div>
                        </div>
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="font-bold text-xl text-center mb-4">Analysis Summary</h3>
                            <div className="chart-container" style={{height: '400px'}}>
                                <canvas ref={chartRef}></canvas>
                            </div>
                            <div id="chart-legend" className="text-center mt-4 text-gray-600"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
