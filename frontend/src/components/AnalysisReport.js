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

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const user = JSON.parse(localStorage.getItem('user'));
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = { top: 20, right: 15, bottom: 20, left: 15 };
        const contentWidth = pageWidth - margin.left - margin.right;

        // Helper to add page header
        const addPageHeader = (pageNum) => {
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('Authintic Plagiarism Checker', margin.left, 10);
            doc.text(`Page ${pageNum}`, pageWidth - margin.right, 10, { align: 'right' });
            doc.setTextColor(0);
        };

        let currentPage = 1;

        // === PAGE 1: COVER & SUMMARY ===
        addPageHeader(currentPage);
        
        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(79, 70, 229); // Indigo
        doc.text('Plagiarism Analysis Report', pageWidth / 2, 35, { align: 'center' });
        
        // Decorative line
        doc.setDrawColor(79, 70, 229);
        doc.setLineWidth(0.5);
        doc.line(margin.left, 42, pageWidth - margin.right, 42);
        
        // Report Info - FIXED USER NAME
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(60);
        let yPos = 55;
        doc.text(`Analyzed for: ${user?.user?.name || user?.name || 'User'}`, margin.left, yPos);
        doc.text(`File: ${file?.name || 'N/A'}`, margin.left, yPos + 7);
        doc.text(`Date: ${new Date().toLocaleString()}`, margin.left, yPos + 14);
        
        // Similarity Score Box
        yPos = 85;
        doc.setFillColor(254, 226, 226); // Light red background
        doc.roundedRect(margin.left, yPos, contentWidth, 25, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(60);
        doc.text('Overall Similarity Score:', margin.left + 5, yPos + 10);
        doc.setFontSize(20);
        doc.setTextColor(220, 38, 38); // Red
        doc.text(`${overall_score}%`, margin.left + 5, yPos + 20);
        
        // Score Breakdown
        yPos = 120;
        const scoreBoxWidth = contentWidth / 3 - 4;
        
        // Original
        doc.setFillColor(220, 252, 231); // Light green
        doc.roundedRect(margin.left, yPos, scoreBoxWidth, 20, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setTextColor(60);
        doc.text('Original', margin.left + 3, yPos + 8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(34, 197, 94); // Green
        doc.text(`${stats.original_percent.toFixed(1)}%`, margin.left + 3, yPos + 16);
        
        // Paraphrased
        doc.setFillColor(254, 249, 195); // Light yellow
        doc.roundedRect(margin.left + scoreBoxWidth + 2, yPos, scoreBoxWidth, 20, 2, 2, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(60);
        doc.text('Paraphrased', margin.left + scoreBoxWidth + 5, yPos + 8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(234, 179, 8); // Yellow
        doc.text(`${stats.paraphrased_percent.toFixed(1)}%`, margin.left + scoreBoxWidth + 5, yPos + 16);
        
        // Direct Match
        doc.setFillColor(254, 226, 226); // Light red
        doc.roundedRect(margin.left + (scoreBoxWidth + 2) * 2, yPos, scoreBoxWidth, 20, 2, 2, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(60);
        doc.text('Direct Match', margin.left + (scoreBoxWidth + 2) * 2 + 3, yPos + 8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(220, 38, 38); // Red
        doc.text(`${stats.direct_percent.toFixed(1)}%`, margin.left + (scoreBoxWidth + 2) * 2 + 3, yPos + 16);
        
        // Chart
        if (chartRef.current) {
            const chartImage = chartRef.current.toBase64Image();
            doc.addImage(chartImage, 'PNG', pageWidth / 2 - 35, 150, 70, 70);
        }
        
        // Statistical Summary Table
        yPos = 230;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(0);
        doc.text('Statistical Summary', margin.left, yPos);
        
        autoTable(doc, {
            startY: yPos + 5,
            head: [['Category', 'Count', 'Percentage']],
            body: [
                ['Original Sentences', stats.original_count, `${stats.original_percent.toFixed(1)}%`],
                ['Paraphrased Sentences', stats.paraphrased_count, `${stats.paraphrased_percent.toFixed(1)}%`],
                ['Direct Match Sentences', stats.direct_count, `${stats.direct_percent.toFixed(1)}%`],
                ['Total Sentences', stats.total_sentences, '100%'],
            ],
            headStyles: { fillColor: [79, 70, 229], fontSize: 10, fontStyle: 'bold' },
            bodyStyles: { fontSize: 9 },
            foot: [['Total Plagiarized', stats.direct_count + stats.paraphrased_count, `${(stats.direct_percent + stats.paraphrased_percent).toFixed(1)}%`]],
            footStyles: { fillColor: [220, 38, 38], textColor: 255, fontStyle: 'bold' },
            theme: 'grid',
            margin: { left: margin.left, right: margin.right }
        });

        // === PAGE 2: FLAGGED SECTIONS ===
        doc.addPage();
        currentPage++;
        addPageHeader(currentPage);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(79, 70, 229);
        doc.text('Flagged Sections Details', margin.left, 30);
        
        doc.setDrawColor(79, 70, 229);
        doc.line(margin.left, 35, pageWidth - margin.right, 35);
        
        autoTable(doc, {
            startY: 40,
            head: [['#', 'Similarity', 'Type', 'Flagged Text', 'Source']],
            body: flagged_sections.map((section, idx) => [
                idx + 1,
                `${section.similarity.toFixed(1)}%`,
                section.type,
                section.text.substring(0, 100) + (section.text.length > 100 ? '...' : ''),
                section.source.substring(0, 50) + (section.source.length > 50 ? '...' : '')
            ]),
            headStyles: { 
                fillColor: [79, 70, 229], 
                fontSize: 9, 
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 10, halign: 'center' },
                1: { cellWidth: 20, halign: 'center' },
                2: { cellWidth: 25 },
                3: { cellWidth: 70 },
                4: { cellWidth: 55 }
            },
            theme: 'striped',
            margin: { left: margin.left, right: margin.right }
        });

        // === PAGE 3+: FULL TEXT WITH CONTINUOUS HIGHLIGHTING ===
        doc.addPage();
        currentPage++;
        addPageHeader(currentPage);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(79, 70, 229);
        doc.text('Full Document with Highlighted Matches', margin.left, 30);
        
        doc.setDrawColor(79, 70, 229);
        doc.line(margin.left, 35, pageWidth - margin.right, 35);
        
        // Legend
        yPos = 42;
        doc.setFontSize(9);
        doc.setTextColor(60);
        doc.text('Legend:', margin.left, yPos);
        
        doc.setFillColor(220, 252, 231);
        doc.rect(margin.left + 20, yPos - 3, 15, 4, 'F');
        doc.text('Original', margin.left + 37, yPos);
        
        doc.setFillColor(254, 249, 195);
        doc.rect(margin.left + 60, yPos - 3, 20, 4, 'F');
        doc.text('Paraphrased', margin.left + 82, yPos);
        
        doc.setFillColor(254, 226, 226);
        doc.rect(margin.left + 115, yPos - 3, 20, 4, 'F');
        doc.text('Direct Match', margin.left + 137, yPos);
        
        // Merge consecutive segments for continuous highlighting
        const mergedSegments = [];
        let currentMerged = null;

        full_text_structured.forEach((segment) => {
            const segmentKey = segment.plagiarized ? `${segment.type}` : 'original';
            
            if (currentMerged && currentMerged.key === segmentKey) {
                currentMerged.text += segment.text;
            } else {
                if (currentMerged) {
                    mergedSegments.push(currentMerged);
                }
                currentMerged = {
                    key: segmentKey,
                    text: segment.text,
                    plagiarized: segment.plagiarized || false,
                    type: segment.type || null
                };
            }
        });
        
        if (currentMerged) {
            mergedSegments.push(currentMerged);
        }

        // Render with continuous line-based highlighting
        doc.setFont('helvetica', 'normal');
        const fontSize = 10;
        const lineHeight = 5;
        doc.setFontSize(fontSize);
        yPos = 52;
        const maxWidth = contentWidth;

        mergedSegments.forEach((segment) => {
            let bgColor = null;
            if (segment.plagiarized) {
                bgColor = segment.type === 'Direct Match' 
                    ? [254, 226, 226]    // Light red
                    : [254, 249, 195];   // Light yellow
            } else {
                bgColor = [220, 252, 231]; // Light green for original
            }

            // Split text into lines that fit within maxWidth - THIS CREATES CONTINUOUS HIGHLIGHTING
            const lines = doc.splitTextToSize(segment.text, maxWidth);
            
            lines.forEach((line) => {
                // Check if we need a new page
                if (yPos + lineHeight > pageHeight - margin.bottom) {
                    doc.addPage();
                    currentPage++;
                    addPageHeader(currentPage);
                    yPos = margin.top + 5;
                }

                // Draw continuous background highlight for the entire line
                const lineWidth = doc.getTextWidth(line);
                if (bgColor) {
                    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
                    doc.rect(margin.left, yPos - 3.5, lineWidth + 1, lineHeight, 'F');
                }

                // Draw text
                doc.setTextColor(0);
                doc.text(line, margin.left, yPos);
                yPos += lineHeight;
            });
        });

        // Footer on last page
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Generated by Authintic Plagiarism Checker', pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text('© 2025 MES Pillai College of Engineering', pageWidth / 2, pageHeight - 6, { align: 'center' });

        doc.save(`Plagiarism_Report_${file?.name || 'analysis'}.pdf`);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6 border-b pb-6">
                <h2 className="text-2xl font-semibold">Analysis Report</h2>
                <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Download PDF Report
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-1 flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48">
                        <DoughnutChart 
                            ref={chartRef}
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
                <VisualReport structuredText={full_text_structured} analysisResult={analysisResult} />
            )}
        </div>
    );
};

export default AnalysisReport;