import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import AnalysisReport from '../components/AnalysisReport';

const Dashboard = () => {
    // This component now only manages the state
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analyzedFile, setAnalyzedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAnalysisStart = () => {
        setAnalysisResult(null);
        setAnalyzedFile(null);
        setErrorMessage('');
    };

    const handleAnalysisComplete = (result, file) => {
        setAnalysisResult(result);
        setAnalyzedFile(file);
        setErrorMessage('');
    };

    const handleAnalysisError = (error) => {
        setAnalysisResult(null);
        setAnalyzedFile(null);
        setErrorMessage(error);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Dashboard</h1>
            
            <FileUpload 
                onAnalysisStart={handleAnalysisStart}
                onAnalysisComplete={handleAnalysisComplete}
                onAnalysisError={handleAnalysisError}
            />

            {/* Conditionally render the report */}
            {analysisResult && (
                <AnalysisReport 
                    result={analysisResult} 
                    file={analyzedFile} 
                />
            )}

            {/* Display an error if one occurred */}
            {errorMessage && !analysisResult && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{errorMessage}</span>
                </div>
            )}
        </div>
    );
};

export default Dashboard;