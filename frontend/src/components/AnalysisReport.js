import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import VisualReport from './VisualReport'; // We're keeping this
import DoughnutChart from './DoughnutChart'; // Import our new chart

// This component receives the full 'result' and 'file' objects as props
const AnalysisReport = ({ result, file }) => {
  // Extract the new stats object from the result
  const { stats, overall_score, full_text_structured, flagged_sections, full_text } = result;

  const handleDownloadPDF = () => {
    // This function remains unchanged
    const doc = new jsPDF();
    const user = JSON.parse(localStorage.getItem('user'));
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Plagiarism Analysis Report', 105, 20, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Report for: ${user?.name || 'User'}`, 14, 35);
    doc.text(`Analyzed File: ${file?.name || 'N/A'}`, 14, 42);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 49);

    doc.setFont('helvetica', 'bold');
    doc.text('Overall Similarity Score:', 14, 60);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(211, 47, 47); // Red color
    doc.setFontSize(16);
    doc.text(`${overall_score}%`, 75, 60);
    
    doc.setTextColor(0, 0, 0); // Reset color
    doc.setFontSize(12);

    doc.setFont('helvetica', 'bold');
    doc.text('Flagged Sections:', 14, 75);

    const tableColumn = ["Similarity", "Type", "Flagged Text", "Source"];
    const tableRows = [];

    flagged_sections.forEach(section => {
      const row = [
        `${section.similarity}%`,
        section.type,
        section.text,
        section.source
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      startY: 80,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Full Submitted Text', 14, 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitText = doc.splitTextToSize(full_text, 180);
    doc.text(splitText, 14, 30);

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
      
      {/* --- NEW VISUAL SUMMARY SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Chart Section */}
        <div className="md:col-span-1 flex flex-col items-center justify-center">
          {/* Relative container to center the text */}
          <div className="relative w-48 h-48">
            <DoughnutChart 
              direct={stats.direct_percent}
              paraphrased={stats.paraphrased_percent}
              original={stats.original_percent}
            />
            {/* Absolute centered text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-red-600">{overall_score}%</span>
              <span className="text-sm text-gray-500">Similarity</span>
            </div>
          </div>
          
          {/* Legend */}
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

        {/* Text Stats Section */}
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
      
      {/* Visual Report (this is our existing component) */}
      {full_text_structured && (
        <VisualReport structuredText={full_text_structured} />
      )}
    </div>
  );
};

export default AnalysisReport;