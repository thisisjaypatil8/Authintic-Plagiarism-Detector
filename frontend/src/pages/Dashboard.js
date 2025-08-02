// frontend/src/pages/Dashboard.js

import React, { useState, useRef } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rewriteSuggestions, setRewriteSuggestions] = useState({});
    const [rewritingIndex, setRewritingIndex] = useState(null);
    const fileInputRef = useRef(null);

    // 1. Helper function to get the auth token from local storage
    const getAuthToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

    const onFileChange = e => {
        setFile(e.target.files[0]);
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

        try {
            const token = getAuthToken();
            if (!token) {
                setMessage('Authorization error. Please log in again.');
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('document', file);
            
            // 2. Create a config object with the auth token in the headers
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            };

            // 3. Pass the config object with the request
            const response = await axios.post('http://localhost:5000/api/documents/upload', formData, config);

            setAnalysisResult(response.data);
            setMessage('Analysis Complete!');
        } catch (error) {
            console.error('File upload error:', error);
            setMessage('Analysis failed. Your session may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRewrite = async (sentence, index) => {
        setRewritingIndex(index);
        try {
            const token = getAuthToken();
            if (!token) {
                setRewriteSuggestions(prev => ({ ...prev, [index]: "Authorization error." }));
                return;
            }

            // 4. Create config object for the rewrite request
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };

            // 5. Pass the config object with the request
            const response = await axios.post('http://localhost:5000/api/documents/rewrite', { sentence }, config);
            setRewriteSuggestions(prev => ({
                ...prev,
                [index]: response.data.rewritten_text
            }));
        } catch (error) {
            console.error('Rewrite error:', error);
            setRewriteSuggestions(prev => ({
                ...prev,
                [index]: "Error getting suggestion."
            }));
        } finally {
            setRewritingIndex(null);
        }
    };

    const handleClear = () => {
        setFile(null);
        setAnalysisResult(null);
        setMessage('');
        setRewriteSuggestions({});
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="container mx-auto mt-10 p-4">
            <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Dashboard</h2>
                <form onSubmit={onFormSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                            Upload your document
                        </label>
                        <div className="mt-1 flex items-center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={onFileChange}
                                disabled={isLoading}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Analyzing...' : 'Upload & Analyze'}
                    </button>
                </form>

                {message && !isLoading && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}
            </div>

            {analysisResult && (
                <div className="w-full max-w-2xl mx-auto mt-8 p-6 sm:p-8 bg-white rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Analysis Report</h3>
                        <button 
                            onClick={handleClear}
                            className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                        >
                            Clear
                        </button>
                    </div>
                    <p className="text-lg mb-4"><strong>Overall Plagiarism Score:</strong> {analysisResult.overall_score}%</p>
                    <h4 className="text-lg font-semibold mb-2">Flagged Sections:</h4>
                    <div className="space-y-4">
                        {analysisResult.flagged_sections.length > 0 ? (
                            analysisResult.flagged_sections.map((section, index) => (
                                <div key={index} className="border border-gray-200 p-4 rounded-md">
                                    <p className="text-gray-700 italic">"{section.text}"</p>
                                    <p className="text-sm mt-2">
                                        <strong>Source:</strong> <span className="text-gray-600">{section.source}</span>
                                    </p>
                                    <p className="text-sm">
                                        <strong>Similarity:</strong> <span className="font-semibold text-indigo-600">{section.similarity}% ({section.type})</span>
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
