import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const Home = () => {
    const [inputText, setInputText] = useState('');
    const [analysisOutput, setAnalysisOutput] = useState('Your highlighted results will appear here.');
    const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
    const [isAnalyzing, setIsAnalyzing] = useState(false);

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
   
    useEffect(() => {
        const updateProcessDetails = (id) => {
            const step = processData.find(s => s.id === id);
            if (processDetailsRef.current) {
                processDetailsRef.current.innerHTML = `<h4 class="font-bold text-xl text-indigo-900 mb-3">${step.title}</h4><p class="text-gray-700 leading-relaxed">${step.description}</p>`;
            }
            processStepsRef.current.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'shadow-lg', 'scale-105');
                btn.classList.add('hover:shadow-md');
            });
            const activeBtn = document.getElementById(`step-btn-${id}`);
            if (activeBtn) {
                activeBtn.classList.add('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'shadow-lg', 'scale-105');
                activeBtn.classList.remove('hover:shadow-md');
            }
        };

        updateProcessDetails('upload');
        updateChart([1, 0, 0], 'Analysis results will be summarized here.');

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    const handleProcessClick = (id) => {
        const step = processData.find(s => s.id === id);
        if (processDetailsRef.current) {
            processDetailsRef.current.innerHTML = `<h4 class="font-bold text-xl text-indigo-900 mb-3">${step.title}</h4><p class="text-gray-700 leading-relaxed">${step.description}</p>`;
        }
        processStepsRef.current.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'shadow-lg', 'scale-105');
            btn.classList.add('hover:shadow-md');
        });
        const activeBtn = document.getElementById(`step-btn-${id}`);
        if (activeBtn) {
            activeBtn.classList.add('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'shadow-lg', 'scale-105');
            activeBtn.classList.remove('hover:shadow-md');
        }
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

        setIsAnalyzing(true);
       
        setTimeout(() => {
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
            setIsAnalyzing(false);
        }, 1000);
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
                    backgroundColor: [
                        'rgba(79, 70, 229, 0.8)',
                        'rgba(251, 191, 36, 0.85)',
                        'rgba(239, 68, 68, 0.85)'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 800
                }
            }
        });

        const originalPercent = ((original / total) * 100).toFixed(1);
        const paraphrasedPercent = ((paraphrased / total) * 100).toFixed(1);
        const directPercent = ((direct / total) * 100).toFixed(1);
       
        if(chartLegend) {
            chartLegend.innerHTML = `
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                        <div class="flex items-center gap-2">
                            <span class="w-4 h-4 rounded-full bg-indigo-600"></span>
                            <span class="font-semibold text-gray-700">Original</span>
                        </div>
                        <span class="text-xl font-bold text-indigo-600">${originalPercent}%</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                        <div class="flex items-center gap-2">
                            <span class="w-4 h-4 rounded-full bg-amber-400"></span>
                            <span class="font-semibold text-gray-700">Paraphrased</span>
                        </div>
                        <span class="text-xl font-bold text-amber-500">${paraphrasedPercent}%</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div class="flex items-center gap-2">
                            <span class="w-4 h-4 rounded-full bg-red-500"></span>
                            <span class="font-semibold text-gray-700">Direct Match</span>
                        </div>
                        <span class="text-xl font-bold text-red-500">${directPercent}%</span>
                    </div>
                </div>
            `;
        }
    };

    return (
        <>
            <style>{`
                .highlight {
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    padding: 3px 6px;
                    border-radius: 4px;
                    margin: 0 2px;
                    display: inline-block;
                }
                .highlight-direct {
                    background: linear-gradient(120deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.25) 100%);
                    border-bottom: 3px solid rgba(239, 68, 68, 0.8);
                    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);
                }
                .highlight-paraphrased {
                    background: linear-gradient(120deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.25) 100%);
                    border-bottom: 3px solid rgba(251, 191, 36, 0.8);
                    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.1);
                }
                .highlight:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .highlight-direct:hover {
                    background: linear-gradient(120deg, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.35) 100%);
                }
                .highlight-paraphrased:hover {
                    background: linear-gradient(120deg, rgba(251, 191, 36, 0.25) 0%, rgba(251, 191, 36, 0.35) 100%);
                }
                .tooltip {
                    position: absolute;
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%);
                    color: white;
                    padding: 14px 18px;
                    border-radius: 10px;
                    font-size: 13px;
                    pointer-events: none;
                    transform: translate(-50%, -120%);
                    opacity: 0;
                    transition: opacity 0.25s ease;
                    z-index: 1000;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
                    backdrop-filter: blur(10px);
                    max-width: 280px;
                }
                .tooltip.visible {
                    opacity: 1;
                }
                .tooltip::after {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 8px solid rgba(0, 0, 0, 0.95);
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .float-animation {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animated-gradient {
                    background-size: 200% 200%;
                    animation: gradient-shift 8s ease infinite;
                }
            `}</style>

            <div id="tooltip" className={`tooltip ${tooltip.visible ? 'visible' : ''}`} style={{ left: tooltip.x, top: tooltip.y }} dangerouslySetInnerHTML={{ __html: tooltip.content }}></div>
           
            {/* Hero Section */}
            <section id="hero" className="relative py-20 md:py-32 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '1s'}}></div>
                </div>
               
                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 shadow-md hover:shadow-lg transition-shadow">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                        </span>
                        AI-Powered Detection
                    </div>
                   
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                        A New Era of<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animated-gradient">
                            Plagiarism Detection
                        </span>
                    </h1>
                   
                    <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        <span className="font-semibold text-indigo-600">Authintic</span> is an AI-powered system designed to address the challenges of modern academic integrity, tackling sophisticated paraphrasing where traditional tools fail.
                    </p>
                   
                    <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <a href="#demo" className="group bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl animated-gradient flex items-center gap-3">
                            <span>Explore Interactive Demo</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                        <a href="#solution" className="bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-lg border-3 border-indigo-600 hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>How It Works</span>
                        </a>
                    </div>
                   
                    {/* Stats Section */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-indigo-100 hover:shadow-xl transition-all hover:scale-105">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">99.5%</div>
                            <div className="text-gray-600 font-medium">Detection Accuracy</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all hover:scale-105">
                            <div className="text-4xl font-bold text-purple-600 mb-2">AI-Powered</div>
                            <div className="text-gray-600 font-medium">Semantic Analysis</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-pink-100 hover:shadow-xl transition-all hover:scale-105">
                            <div className="text-4xl font-bold text-pink-600 mb-2">Instant</div>
                            <div className="text-gray-600 font-medium">Real-Time Results</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section id="problem" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            The Challenge
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Beyond Simple Copying</h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Traditional plagiarism detectors are good at finding exact matches, but struggle with AI-assisted paraphrasing—where the meaning is copied, but the words are changed.</p>
                    </div>
                   
                    <div className="grid md:grid-cols-2 gap-10 items-stretch max-w-6xl mx-auto">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-xl border-2 border-red-100 hover:border-red-200 transition-all h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg float-animation">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-2xl text-red-700">Traditional Detection Fails</h3>
                                </div>
                                <p className="text-gray-600 mb-6 text-lg">A simple text-matcher would likely miss the connection between these two paragraphs.</p>
                                <div className="space-y-5">
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border-l-4 border-gray-400 hover:shadow-md transition-shadow">
                                        <p className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Source Text:
                                        </p>
                                        <p className="text-gray-800 leading-relaxed">Recent developments in extensive auto-code completion could fill in the actual code with a few comments or a function name without other inputs.</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-50 to-pink-50 p-5 rounded-xl border-l-4 border-red-500 hover:shadow-md transition-shadow">
                                        <p className="font-bold text-sm text-red-700 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            Paraphrased Text:
                                        </p>
                                        <p className="text-gray-800 leading-relaxed">Modern tools can automatically generate code from simple function names or comments, requiring minimal user input.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                       
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-xl border-2 border-green-100 hover:border-green-200 transition-all h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg float-animation" style={{animationDelay: '0.5s'}}>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-2xl text-green-700">Authintic's Solution</h3>
                                </div>
                                <p className="text-gray-600 mb-6 text-lg">Our system analyzes the underlying meaning (semantics) to identify such cases as highly similar.</p>
                                <div className="text-center py-10 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl border-2 border-green-200 hover:shadow-inner transition-all">
                                    <div className="text-7xl mb-6 float-animation" style={{animationDelay: '1s'}}>🧠</div>
                                    <p className="font-bold text-gray-900 px-6 text-lg leading-relaxed mb-3">Context-Aware Intelligence</p>
                                    <p className="text-gray-700 px-6">By understanding context, not just words, our hybrid model successfully flags sophisticated plagiarism.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
           
            {/* Solution Section */}
            <section id="solution" className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Our Process
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Hybrid Analysis Process</h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Authintic uses a multi-stage process to ensure comprehensive and accurate detection. Click each step to learn more.</p>
                    </div>
                   
                    <div ref={processStepsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 max-w-6xl mx-auto">
                        {processData.map((step, index) => (
                            <button
                                key={step.id}
                                id={`step-btn-${step.id}`}
                                onClick={() => handleProcessClick(step.id)}
                                className="group p-6 bg-white rounded-2xl shadow-md text-center flex flex-col items-center space-y-4 border-2 border-transparent hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                            >
                                <div className="text-5xl group-hover:scale-110 transition-transform">{step.icon}</div>
                                <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{step.title}</h4>
                            </button>
                        ))}
                    </div>
                    <div ref={processDetailsRef} className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl border-2 border-indigo-100 min-h-[140px] transition-all max-w-4xl mx-auto"></div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-20 bg-white">
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
                            <div className="chart-container mb-8" style={{height: '280px'}}>
                                <canvas ref={chartRef}></canvas>
                            </div>
                            <div id="chart-legend" className="text-center text-gray-600"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
