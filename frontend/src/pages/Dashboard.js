import React, { useState, useRef } from 'react';
import axios from 'axios';

// NEW: Import PDF generation libraries
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rewriteSuggestions, setRewriteSuggestions] = useState({});
    const [rewritingIndex, setRewritingIndex] = useState(null);
    const fileInputRef = useRef(null);

    const getAuthToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

    const onFileChange = e => {
        setFile(e.target.files[0]);
        setAnalysisResult(null); // Clear old results
        setMessage('');
    };

    const onFormSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('Uploading and analyzing...');
        setAnalysisResult(null);
        setRewriteSuggestions({});

        if (!file) {
            setMessage('Please select a file first.');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('document', file);
        const token = getAuthToken();

        if (!token) {
            setMessage('Authorization error. Please log in again.');
            setIsLoading(false);
            return;
        }

        try {
            // Use the correct documentService URL from our backend
            const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });
            setAnalysisResult(response.data);
            setMessage('Analysis complete.');
        } catch (error) {
            console.error('Upload error:', error.response?.data || error.message);
            setMessage('Analysis failed: ' + (error.response?.data || 'Server error.'));
        }
        setIsLoading(false);
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
            setRewriteSuggestions(prev => ({
                ...prev,
                [index]: 'Error generating suggestion.'
            }));
        }
        setRewritingIndex(null);
    };

    // --- NEW: PDF DOWNLOAD FUNCTION ---
    const handleDownloadPDF = () => {
        if (!analysisResult) return;

        const doc = new jsPDF();
        const user = JSON.parse(localStorage.getItem('user'));

        // 1. Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('Plagiarism Analysis Report', 105, 20, { align: 'center' });

        // 2. Summary Info
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Report for: ${user?.name || 'User'}`, 14, 35);
        doc.text(`Analyzed File: ${file?.name || 'N/A'}`, 14, 42);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 49);

        // 3. Overall Score
        doc.setFont('helvetica', 'bold');
        doc.text('Overall Similarity Score:', 14, 60);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(211, 47, 47); // Red color
        doc.setFontSize(16);
        doc.text(`${analysisResult.overall_score}%`, 75, 60);

        doc.setTextColor(0, 0, 0); // Reset color
        doc.setFontSize(12);

        // 4. Details Table
        doc.setFont('helvetica', 'bold');
        doc.text('Flagged Sections:', 14, 75);

        const tableColumn = ["Similarity", "Type", "Flagged Text", "Source"];
        const tableRows = [];

        analysisResult.flagged_sections.forEach(section => {
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
            headStyles: { fillColor: [41, 128, 185] }, // Blue header
            didDrawCell: (data) => {
                // Handle text wrapping for long sentences
                if (data.column.index === 2 || data.column.index === 3) {
                    doc.setFontSize(8);
                }
            }
        });

        // 5. Full Text (on a new page)
        doc.addPage();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Full Submitted Text', 14, 20);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        // Split text to handle page breaks
        const splitText = doc.splitTextToSize(analysisResult.full_text, 180);
        doc.text(splitText, 14, 30);

        // 6. Save
        doc.save(`Plagiarism_Report_${file?.name || 'analysis'}.pdf`);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Dashboard</h1>

            {/* File Upload Section */}
            <form onSubmit={onFormSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Check a New Document</h2>
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300"
                    >
                        Choose File
                    </button>
                    <span className="text-gray-500">{file ? file.name : 'No file selected.'}</span>
                    <input
                        type="file"
                        className="hidden"
                        onChange={onFileChange}
                        ref={fileInputRef}
                        accept=".txt,.pdf,.doc,.docx" // <-- UPDATED
                    />
                </div>
                <p className="text-xs text-gray-400 mt-2">Accepted formats: .txt, .pdf, .docx, .doc</p>

                <button
                    type="submit"
                    disabled={isLoading || !file}
                    className="mt-4 w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Analyzing...' : 'Start Analysis'}
                </button>
                {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
            </form>

            {/* Analysis Result Section */}
            {analysisResult && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Analysis Report</h2>
                        {/* --- NEW: DOWNLOAD BUTTON --- */}
                        <button
                            onClick={handleDownloadPDF}
                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
                        >
                            Download Report (PDF)
                        </button>
                    </div>
                    <div className="mb-6 border-b pb-4">
                        <span className="text-gray-600 font-medium">Overall Similarity Score:</span>
                        <span className="ml-2 text-3xl font-bold text-red-600">{analysisResult.overall_score}%</span>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">Flagged Sections</h3>
                    <div className="space-y-6">
                        {analysisResult.flagged_sections.length > 0 ? (
                            analysisResult.flagged_sections.map((section, index) => (
                                <div key={index} className="border p-4 rounded-md bg-gray-50">
                                    <p className="text-gray-800 leading-relaxed">"{section.text}"</p>
                                    <p className="text-sm mt-3">
                                        <span className="font-semibold text-red-700">Source:</span>
                                        <span className="ml-2 text-gray-600">{section.source}</span>
                                    </p>
                                    <p className="text-sm mt-1">
                                        <span className="font-semibold text-red-700">Similarity:</span>
                                        <span className="ml-2 text-gray-600">{section.similarity}% ({section.type})</span>
                                    </p>
                                    <div className="mt-3">
                                        <button
                                            onClick={() => handleRewrite(section.text, index)}
                                            disabled={rewritingIndex === index}
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            {rewritingIndex === index ? 'Generating...' : '✨ Suggest Rewrite'}
                                        </button>
                                        {rewriteSuggestions[index] && (
                                            <div className="mt-2 p-3 bg-indigo-50 rounded-md">
                                                <p className="text-sm text-gray-800">{rewriteSuggestions[index]}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No plagiarized sections found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;