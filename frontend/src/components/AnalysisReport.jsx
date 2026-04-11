import React, { useRef, useState, useCallback } from 'react';
import VisualReport from './VisualReport';
import DoughnutChart from './DoughnutChart';
import { generatePlagiarismPDF } from '../utils/pdfGenerator';

const AnalysisReport = ({ analysisResult, file }) => {
    const chartRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!analysisResult) {
        return null; 
    }

    const { stats, overall_score, full_text_structured } = analysisResult;

    // Safely read ai_paraphrased stats (fallback to 0 for older API responses)
    const aiCount   = stats.ai_paraphrased_count   ?? 0;
    const aiPercent = stats.ai_paraphrased_percent  ?? 0;

    // ── PDF Download Handler ─────────────────────────────────────────
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleDownloadPDF = useCallback(async () => {
        if (isGenerating) return;        // prevent double-clicks
        setIsGenerating(true);
        try {
            await generatePlagiarismPDF({ analysisResult, file, chartRef });
        } catch (err) {
            console.error('PDF download failed:', err);
        } finally {
            setIsGenerating(false);
        }
    }, [analysisResult, file, isGenerating]);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analysis Report</h2>
                    <p className="text-sm text-gray-500 mt-1">3-Layer Hybrid Detection: TF-IDF + FAISS + BERT</p>
                </div>
                <button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className={`px-5 py-2.5 text-white font-semibold rounded-xl flex items-center gap-2 shadow-md transition-all ${
                        isGenerating
                            ? 'bg-gray-400 cursor-wait'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg'
                    }`}
                >
                    {isGenerating ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Generating PDF…
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Download PDF Report
                        </>
                    )}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-1 flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48">
                        <DoughnutChart 
                            ref={chartRef}
                            direct={stats.direct_percent}
                            paraphrased={stats.paraphrased_percent}
                            aiParaphrased={aiPercent}
                            original={stats.original_percent}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-red-600">{overall_score}%</span>
                            <span className="text-sm text-gray-500">Similarity</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 space-y-2 text-sm w-full max-w-xs">
                        <div className="flex justify-between">
                            <span className="flex items-center">
                                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                                Original
                            </span>
                            <span className="font-medium">{stats.original_percent.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="flex items-center">
                                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                                Paraphrased
                            </span>
                            <span className="font-medium">{stats.paraphrased_percent.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="flex items-center">
                                <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                                AI-Paraphrased
                            </span>
                            <span className="font-medium">{aiPercent.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="flex items-center">
                                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                                Direct Match
                            </span>
                            <span className="font-medium">{stats.direct_percent.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4">Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Sentences:</span>
                            <span className="font-bold text-gray-800">{stats.total_sentences}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Original Sentences:</span>
                            <span className="font-bold text-green-600">{stats.original_count}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Paraphrased Sentences:</span>
                            <span className="font-bold text-yellow-600">{stats.paraphrased_count}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">AI-Paraphrased (BERT):</span>
                            <span className="font-bold text-purple-600">{aiCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Direct Match Sentences:</span>
                            <span className="font-bold text-red-600">{stats.direct_count}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {full_text_structured && (
                <VisualReport structuredText={full_text_structured} analysisResult={analysisResult} />
            )}
        </div>
    );
};

export default AnalysisReport;