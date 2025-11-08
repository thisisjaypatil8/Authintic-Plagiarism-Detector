import React, { useState, useRef } from 'react';
import axios from 'axios';

// This component now handles all upload logic
// It takes a function prop 'onAnalysisComplete' to send data to the parent
const FileUpload = ({ onAnalysisStart, onAnalysisComplete, onAnalysisError }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const getAuthToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

    const onFileChange = e => {
        setFile(e.target.files[0]);
        setMessage('');
        onAnalysisStart(); // Clear parent's old results
    };

    const onFormSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('Uploading and analyzing...');

        if (!file) {
            setMessage('Please select a file first.');
            setIsLoading(false);
            onAnalysisError('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('document', file);
        const token = getAuthToken();

        if (!token) {
            setMessage('Authorization error. Please log in again.');
            setIsLoading(false);
            onAnalysisError('Authorization error. Please log in again.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });
            // Pass the full result (and the file) up to the parent
            onAnalysisComplete(response.data, file);
            setMessage('Analysis complete.');
        } catch (error) {
            console.error('Upload error:', error.response?.data || error.message);
            const errorMsg = 'Analysis failed: ' + (error.response?.data?.error || error.response?.data || 'Server error.');
            setMessage(errorMsg);
            onAnalysisError(errorMsg);
        }
        setIsLoading(false);
    };

    return (
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
                    accept=".txt,.pdf,.doc,.docx"
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
    );
};

export default FileUpload;