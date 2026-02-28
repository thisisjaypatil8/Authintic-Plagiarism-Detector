import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import VisualReport from './VisualReport';
import DoughnutChart from './DoughnutChart';

const AnalysisReport = ({ analysisResult, file }) => {
    const chartRef = useRef(null);

    if (!analysisResult) {
        return null; 
    }

    const { stats, overall_score, full_text_structured, flagged_sections } = analysisResult;

    // Safely read ai_paraphrased stats (fallback to 0 for older API responses)
    const aiCount   = stats.ai_paraphrased_count   ?? 0;
    const aiPercent = stats.ai_paraphrased_percent  ?? 0;

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const user = JSON.parse(localStorage.getItem('user'));
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = { top: 20, right: 15, bottom: 20, left: 15 };
        const contentWidth = pageWidth - margin.left - margin.right;

        const addPageHeader = (pageNum) => {
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('Authintic — 3-Layer Hybrid Plagiarism Checker', margin.left, 10);
            doc.text(`Page ${pageNum}`, pageWidth - margin.right, 10, { align: 'right' });
            doc.setTextColor(0);
        };

        let currentPage = 1;

        // === PAGE 1: COVER & SUMMARY ===
        addPageHeader(currentPage);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(79, 70, 229);
        doc.text('Plagiarism Analysis Report', pageWidth / 2, 35, { align: 'center' });
        
        doc.setDrawColor(79, 70, 229);
        doc.setLineWidth(0.5);
        doc.line(margin.left, 42, pageWidth - margin.right, 42);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(60);
        let yPos = 52;
        doc.text(`Analyzed for: ${user?.user?.name || user?.name || 'User'}`, margin.left, yPos);
        doc.text(`File: ${file?.name || 'N/A'}`, margin.left, yPos + 6);
        doc.text(`Date: ${new Date().toLocaleString()}`, margin.left, yPos + 12);
        doc.text(`Detection: 3-Layer Hybrid (TF-IDF + FAISS + BERT)`, margin.left, yPos + 18);
        
        // Overall Score Box
        yPos = 80;
        doc.setFillColor(254, 226, 226);
        doc.roundedRect(margin.left, yPos, contentWidth, 22, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(60);
        doc.text('Overall Similarity Score:', margin.left + 5, yPos + 9);
        doc.setFontSize(18);
        doc.setTextColor(220, 38, 38);
        doc.text(`${overall_score}%`, margin.left + 5, yPos + 18);
        
        // 4-category Score Breakdown
        yPos = 110;
        const scoreBoxWidth = contentWidth / 4 - 3;
        
        // Original
        doc.setFillColor(220, 252, 231);
        doc.roundedRect(margin.left, yPos, scoreBoxWidth, 22, 2, 2, 'F');
        doc.setFontSize(9); doc.setTextColor(60); doc.setFont('helvetica', 'normal');
        doc.text('Original', margin.left + 3, yPos + 8);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(34, 197, 94);
        doc.text(`${stats.original_percent.toFixed(1)}%`, margin.left + 3, yPos + 17);
        
        // Paraphrased
        const x2 = margin.left + scoreBoxWidth + 2;
        doc.setFillColor(254, 249, 195);
        doc.roundedRect(x2, yPos, scoreBoxWidth, 22, 2, 2, 'F');
        doc.setFontSize(9); doc.setTextColor(60); doc.setFont('helvetica', 'normal');
        doc.text('Paraphrased', x2 + 3, yPos + 8);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(234, 179, 8);
        doc.text(`${stats.paraphrased_percent.toFixed(1)}%`, x2 + 3, yPos + 17);
        
        // AI-Paraphrased (NEW — purple)
        const x3 = margin.left + (scoreBoxWidth + 2) * 2;
        doc.setFillColor(237, 233, 254);
        doc.roundedRect(x3, yPos, scoreBoxWidth, 22, 2, 2, 'F');
        doc.setFontSize(9); doc.setTextColor(60); doc.setFont('helvetica', 'normal');
        doc.text('AI-Paraphrased', x3 + 3, yPos + 8);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(139, 92, 246);
        doc.text(`${aiPercent.toFixed(1)}%`, x3 + 3, yPos + 17);
        
        // Direct Match
        const x4 = margin.left + (scoreBoxWidth + 2) * 3;
        doc.setFillColor(254, 226, 226);
        doc.roundedRect(x4, yPos, scoreBoxWidth, 22, 2, 2, 'F');
        doc.setFontSize(9); doc.setTextColor(60); doc.setFont('helvetica', 'normal');
        doc.text('Direct Match', x4 + 3, yPos + 8);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(220, 38, 38);
        doc.text(`${stats.direct_percent.toFixed(1)}%`, x4 + 3, yPos + 17);
        
        // Doughnut Chart — capture from browser canvas
        if (chartRef.current) {
            const chartImage = chartRef.current.toBase64Image();
            doc.addImage(chartImage, 'PNG', pageWidth / 2 - 40, 140, 80, 80);
        }
        
        // Statistical Summary Table
        yPos = 228;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('Statistical Summary', margin.left, yPos);
        
        autoTable(doc, {
            startY: yPos + 5,
            head: [['Category', 'Count', 'Percentage']],
            body: [
                ['Original Sentences', stats.original_count, `${stats.original_percent.toFixed(1)}%`],
                ['Paraphrased Sentences', stats.paraphrased_count, `${stats.paraphrased_percent.toFixed(1)}%`],
                ['AI-Paraphrased (BERT)', aiCount, `${aiPercent.toFixed(1)}%`],
                ['Direct Match Sentences', stats.direct_count, `${stats.direct_percent.toFixed(1)}%`],
                ['Total Sentences', stats.total_sentences, '100%'],
            ],
            headStyles: { fillColor: [79, 70, 229], fontSize: 9, fontStyle: 'bold' },
            bodyStyles: { fontSize: 9 },
            foot: [['Total Plagiarized', stats.direct_count + stats.paraphrased_count + aiCount, `${(stats.direct_percent + stats.paraphrased_percent + aiPercent).toFixed(1)}%`]],
            footStyles: { fillColor: [220, 38, 38], textColor: 255, fontStyle: 'bold' },
            theme: 'grid',
            margin: { left: margin.left, right: margin.right }
        });

        // === PAGE 2: FLAGGED SECTIONS ===
        doc.addPage();
        currentPage++;
        addPageHeader(currentPage);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.setTextColor(79, 70, 229);
        doc.text('Flagged Sections Details', margin.left, 30);
        
        doc.setDrawColor(79, 70, 229);
        doc.line(margin.left, 35, pageWidth - margin.right, 35);
        
        autoTable(doc, {
            startY: 40,
            head: [['#', 'Sim %', 'Type', 'Layer', 'Flagged Text', 'Source']],
            body: flagged_sections.map((section, idx) => [
                idx + 1,
                `${section.similarity.toFixed(1)}%`,
                section.type,
                section.layer || '—',
                section.text.substring(0, 80) + (section.text.length > 80 ? '...' : ''),
                section.source.substring(0, 40) + (section.source.length > 40 ? '...' : '')
            ]),
            headStyles: { 
                fillColor: [79, 70, 229], 
                fontSize: 8, 
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: { fontSize: 7 },
            columnStyles: {
                0: { cellWidth: 8, halign: 'center' },
                1: { cellWidth: 15, halign: 'center' },
                2: { cellWidth: 25 },
                3: { cellWidth: 22 },
                4: { cellWidth: 60 },
                5: { cellWidth: 50 }
            },
            theme: 'striped',
            margin: { left: margin.left, right: margin.right }
        });

        // === PAGE 3+: FULL TEXT WITH HIGHLIGHTING ===
        doc.addPage();
        currentPage++;
        addPageHeader(currentPage);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.setTextColor(79, 70, 229);
        doc.text('Full Document with Highlighted Matches', margin.left, 30);
        
        doc.setDrawColor(79, 70, 229);
        doc.line(margin.left, 35, pageWidth - margin.right, 35);
        
        // Legend with 4 colors
        yPos = 42;
        doc.setFontSize(8);
        doc.setTextColor(60);
        doc.text('Legend:', margin.left, yPos);
        
        doc.setFillColor(220, 252, 231);
        doc.rect(margin.left + 18, yPos - 3, 12, 4, 'F');
        doc.text('Original', margin.left + 32, yPos);
        
        doc.setFillColor(254, 249, 195);
        doc.rect(margin.left + 52, yPos - 3, 16, 4, 'F');
        doc.text('Paraphrased', margin.left + 70, yPos);
        
        doc.setFillColor(237, 233, 254);
        doc.rect(margin.left + 98, yPos - 3, 18, 4, 'F');
        doc.text('AI-Paraphrased', margin.left + 118, yPos);
        
        doc.setFillColor(254, 226, 226);
        doc.rect(margin.left + 148, yPos - 3, 16, 4, 'F');
        doc.text('Direct Match', margin.left + 166, yPos);
        
        // Merge consecutive segments
        const mergedSegments = [];
        let currentMerged = null;

        full_text_structured.forEach((segment) => {
            const segmentKey = segment.plagiarized ? `${segment.type}` : 'original';
            if (currentMerged && currentMerged.key === segmentKey) {
                currentMerged.text += segment.text;
            } else {
                if (currentMerged) mergedSegments.push(currentMerged);
                currentMerged = {
                    key: segmentKey,
                    text: segment.text,
                    plagiarized: segment.plagiarized || false,
                    type: segment.type || null
                };
            }
        });
        if (currentMerged) mergedSegments.push(currentMerged);

        // Render with continuous highlighting
        doc.setFont('helvetica', 'normal');
        const fontSize = 10;
        const lineHeight = 5;
        doc.setFontSize(fontSize);
        yPos = 52;
        const maxWidth = contentWidth;

        mergedSegments.forEach((segment) => {
            let bgColor;
            if (segment.plagiarized) {
                if (segment.type === 'Direct Match') {
                    bgColor = [254, 226, 226];      // Light red
                } else if (segment.type === 'AI-Paraphrased') {
                    bgColor = [237, 233, 254];       // Light purple
                } else {
                    bgColor = [254, 249, 195];       // Light yellow
                }
            } else {
                bgColor = [220, 252, 231];           // Light green
            }

            const lines = doc.splitTextToSize(segment.text, maxWidth);
            lines.forEach((line) => {
                if (yPos + lineHeight > pageHeight - margin.bottom) {
                    doc.addPage();
                    currentPage++;
                    addPageHeader(currentPage);
                    yPos = margin.top + 5;
                }
                const lineWidth = doc.getTextWidth(line);
                doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
                doc.rect(margin.left, yPos - 3.5, lineWidth + 1, lineHeight, 'F');
                doc.setTextColor(0);
                doc.text(line, margin.left, yPos);
                yPos += lineHeight;
            });
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Generated by Authintic — 3-Layer Hybrid Plagiarism Checker', pageWidth / 2, pageHeight - 10, { align: 'center' });

        doc.save(`Plagiarism_Report_${file?.name || 'analysis'}.pdf`);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analysis Report</h2>
                    <p className="text-sm text-gray-500 mt-1">3-Layer Hybrid Detection: TF-IDF + FAISS + BERT</p>
                </div>
                <button
                    onClick={handleDownloadPDF}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Download PDF Report
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