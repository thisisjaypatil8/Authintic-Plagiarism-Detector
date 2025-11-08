import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import VisualReport from './VisualReport';
import DoughnutChart from './DoughnutChart';

// This component ONLY displays the results.
// It receives the 'analysisResult' and 'file' objects as props.
const AnalysisReport = ({ analysisResult, file }) => {
    // 1. Create a ref to hold the chart instance
    const chartRef = useRef(null);

    // This check is important. It ensures we don't try to read 'null'
    if (!analysisResult) {
        return null; 
    }

    const { stats, overall_score, full_text_structured, flagged_sections } = analysisResult;

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const user = JSON.parse(localStorage.getItem('user'));
        const page = {
            width: doc.internal.pageSize.getWidth(),
            height: doc.internal.pageSize.getHeight(),
        };
        const margin = { top: 20, right: 14, bottom: 20, left: 14 };

        // --- PAGE 1: SUMMARY & CHART ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('Plagiarism Analysis Report', page.width / 2, margin.top, {
            align: 'center',
        });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Report for: ${user?.name || 'User'}`, margin.left, margin.top + 20);
        doc.text(`Analyzed File: ${file?.name || 'N/A'}`, margin.left, margin.top + 27);
        doc.text(`Date: ${new Date().toLocaleString()}`, margin.left, margin.top + 34);

        doc.setFont('helvetica', 'bold');
        doc.text('Overall Similarity Score:', margin.left, margin.top + 45);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(211, 47, 47); // Red color
        doc.setFontSize(16);
        doc.text(`${overall_score}%`, 75, margin.top + 45);
        doc.setTextColor(0, 0, 0); // Reset color

        // Add Chart Image
        if (chartRef.current) {
            const chartImage = chartRef.current.toBase64Image();
            doc.addImage(chartImage, 'PNG', page.width / 2 - 40, margin.top + 55, 80, 80);
        }
        
        // Add Stats Summary Table
        autoTable(doc, {
            startY: margin.top + 145,
            head: [['Category', 'Sentences', 'Percentage']],
            body: [
                ['Original', stats.original_count, `${stats.original_percent.toFixed(2)}%`],
                ['Paraphrased', stats.paraphrased_count, `${stats.paraphrased_percent.toFixed(2)}%`],
                ['Direct Match', stats.direct_count, `${stats.direct_percent.toFixed(2)}%`],
                ['Total Sentences', stats.total_sentences, '100.00%'],
            ],
            headStyles: { fillColor: [41, 128, 185] }, // Blue header
            foot: [['Total Plagiarized', stats.direct_count + stats.paraphrased_count, `${(100 - stats.original_percent).toFixed(2)}%`]],
            footStyles: { fillColor: [231, 76, 60] }, // Red footer
            theme: 'striped',
        });

        // Add Flagged Sections Table
        const lastTableY = doc.lastAutoTable.finalY;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Flagged Sections Details:', margin.left, lastTableY + 15);

        autoTable(doc, {
            startY: lastTableY + 20,
            head: [['Similarity', 'Type', 'Flagged Text', 'Source']],
            body: flagged_sections.map((section) => [
                `${section.similarity}%`,
                section.type,
                section.text,
                section.source,
            ]),
            headStyles: { fillColor: [41, 128, 185] },
            theme: 'striped',
        });

        // --- NEW PAGE: FULL TEXT APPENDIX ---
        doc.addPage();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Appendix: Full Submitted Text (with Highlighting)', margin.left, margin.top);

        // --- CUSTOM TEXT RENDERER WITH HIGHLIGHTING & PAGINATION ---
        doc.setFont('helvetica', 'normal');
        const fontSize = 10;
        const lineHeight = fontSize * 0.35 * 1.5;
        doc.setFontSize(fontSize);

        let currentX = margin.left;
        let currentY = margin.top + 15;
        const pageHeight = page.height - margin.bottom;
        const pageWidth = page.width - margin.right;

        const addNewPage = () => {
            doc.addPage();
            currentY = margin.top;
            doc.setFontSize(fontSize);
        };
        
        full_text_structured.forEach((segment) => {
            const words = segment.text.split(/(\s+)/); // Split but keep whitespace
            
            let highlightColor = null;
            if (segment.plagiarized) {
                highlightColor = segment.type === 'Direct Match' ? [239, 68, 68] : [245, 158, 11]; // Red-500 or Yellow-600
            }

            words.forEach((word) => {
                if (!word) return;

                const wordWidth = doc.getStringUnitWidth(word) * fontSize / doc.internal.scaleFactor;

                // Handle newlines explicitly
                if (word.includes('\n')) {
                    const parts = word.split('\n');
                    parts.forEach((part, i) => {
                        if (i > 0) { // If it's a part after a newline
                            currentX = margin.left;
                            currentY += lineHeight;
                            if (currentY + lineHeight > pageHeight) addNewPage();
                        }
                        const partWidth = doc.getStringUnitWidth(part) * fontSize / doc.internal.scaleFactor;
                        if (highlightColor && part.trim().length > 0) {
                            doc.setFillColor(highlightColor[0], highlightColor[1], highlightColor[2]);
                            doc.rect(currentX, currentY - (lineHeight * 0.7) + 1, partWidth, lineHeight, 'F');
                        }
                        doc.setTextColor(0, 0, 0);
                        doc.text(part, currentX, currentY);
                        currentX += partWidth;
                    });
                } else {
                    // Word doesn't fit on the current line
                    if (currentX + wordWidth > pageWidth) {
                        currentX = margin.left;
                        currentY += lineHeight;
                    }
                    // Line doesn't fit on the current page
                    if (currentY + lineHeight > pageHeight) {
                        addNewPage();
                    }

                    // Draw highlight
                    if (highlightColor && word.trim().length > 0) {
                        doc.setFillColor(highlightColor[0], highlightColor[1], highlightColor[2]);
                        doc.rect(currentX, currentY - (lineHeight * 0.7) + 1, wordWidth, lineHeight, 'F');
                    }

                    // Draw text
                    doc.setTextColor(0, 0, 0);
                    doc.text(word, currentX, currentY);
                    currentX += wordWidth;
                }
            });
        });

        doc.save(`Plagiarism_Report_${file?.name || 'analysis'}.pdf`);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6 border-b pb-6">
                <h2 className="text-2xl font-semibold">Analysis Report</h2>
                <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
                >
                    Download Report (PDF)
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-1 flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48">
                        <DoughnutChart 
                            ref={chartRef} // Pass the ref here
                            direct={stats.direct_percent}
                            paraphrased={stats.paraphrased_percent}
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
                                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                                Direct Match
                            </span>
                            <span className="font-medium">{stats.direct_percent.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg">
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
                            <span className="text-gray-600">Direct Match Sentences:</span>
                            <span className="font-bold text-red-600">{stats.direct_count}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {full_text_structured && (
                <VisualReport structuredText={full_text_structured} />
            )}
        </div>
    );
};

export default AnalysisReport;