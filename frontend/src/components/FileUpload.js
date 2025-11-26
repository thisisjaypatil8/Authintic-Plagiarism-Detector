import React, { useState, useRef } from 'react';
import axios from 'axios';

// This component now handles all upload logic
// It takes a function prop 'onAnalysisComplete' to send data to the parent
// Also accepts 'mode' prop to determine analysis type
const FileUpload = ({ onAnalysisStart, onAnalysisComplete, onAnalysisError, mode = 'deep' }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const getAuthToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

    const onFileChange = e => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setMessage('');
        onAnalysisStart(); // Clear parent's old results
    };

    const onFormSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        
        // Show mode-specific loading message
        const loadingMsg = mode === 'fast' 
            ? 'Analyzing... (~1-3 seconds)' 
            : 'Deep analysis in progress... (~10-30 seconds)';
        setMessage(loadingMsg);

        if (!file) {
            const errorMsg = 'Please select a file first.';
            setMessage(errorMsg);
            setIsLoading(false);
            onAnalysisError(errorMsg);
            return;
        }

        const formData = new FormData();
        formData.append('document', file);
        formData.append('mode', mode); // Include mode in the request
        const token = getAuthToken();

        if (!token) {
            const errorMsg = 'Authorization error. Please log in again.';
            setMessage(errorMsg);
            setIsLoading(false);
            onAnalysisError(errorMsg);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });
            
            // Check if result was cached
            const cached = response.data.cached;
            const completionMsg = cached 
                ? 'Analysis complete. (Loaded from cache)' 
                : 'Analysis complete.';
            
            setMessage(completionMsg);
            onAnalysisComplete(response.data, file);
        } catch (error) {
            console.error('Upload error:', error.response?.data || error.message);
            const errorMsg = 'Analysis failed: ' + (error.response?.data?.error || error.response?.data || 'Server error.');
            setMessage(errorMsg);
            onAnalysisError(errorMsg);
        }
        setIsLoading(false);
    };

    // Get mode-specific UI text
    const getModeDisplay = () => {
        if (mode === 'fast') {
            return { icon: '⚡', text: 'Fast Mode', color: 'text-blue-600' };
        }
        return { icon: '🔍', text: 'Deep Mode', color: 'text-purple-600' };
    };

    const modeDisplay = getModeDisplay();

    return (
        <div>
            {/* Mode Indicator */}
            <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Selected mode:</span>
                <span className={`font-semibold ${modeDisplay.color} flex items-center gap-1`}>
                    <span>{modeDisplay.icon}</span>
                    {modeDisplay.text}
                </span>
            </div>

            <div className="flex items-center space-x-4 mb-4">
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300 transition-colors"
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
            <p className="text-xs text-gray-400 mb-4">Accepted formats: .txt, .pdf, .docx, .doc</p>
            
            <button
                onClick={onFormSubmit}
                disabled={isLoading || !file}
                className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Analyzing...
                    </span>
                ) : 'Start Analysis'}
            </button>
            {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
        </div>
    );
};

export default FileUpload;