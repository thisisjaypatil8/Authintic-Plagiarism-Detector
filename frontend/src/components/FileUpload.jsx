import React, { useState, useRef } from 'react';
import axios from 'axios';

/**
 * FileUpload — Clean drop zone with document icon, drag & drop
 * Inspired by T-detector file upload area
 */
const FileUpload = ({ onAnalysisStart, onAnalysisComplete, onAnalysisError, mode = 'deep' }) => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const fileInputRef = useRef(null);

    const getAuthToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        onAnalysisStart();
        setLoadingMessage('Uploading document...');

        const formData = new FormData();
        formData.append('document', file);
        formData.append('mode', mode);

        const token = getAuthToken();

        try {
            setLoadingMessage(mode === 'deep' ? 'Running 3-layer analysis (TF-IDF → FAISS → BERT)...' : 'Running TF-IDF analysis...');

            const response = await axios.post(
                'http://localhost:5000/api/documents/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-auth-token': token
                    },
                    timeout: 300000
                }
            );
            onAnalysisComplete(response.data, file);
        } catch (error) {
            const msg = error.response?.data?.error || error.message || 'Server error. Please try again.';
            onAnalysisError(msg);
        }

        setIsLoading(false);
        setLoadingMessage('');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    return (
        <form onSubmit={onFormSubmit}>
            {/* Drop Zone */}
            <div
                className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
                onClick={() => !isLoading && fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files[0])}
                    accept=".txt,.pdf,.doc,.docx"
                    disabled={isLoading}
                />

                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-[#0ABAB5] animate-spin"></div>
                        </div>
                        <p className="text-gray-700 font-medium">{loadingMessage}</p>
                        <p className="text-gray-400 text-sm mt-1">This may take a moment...</p>
                    </div>
                ) : (
                    <>
                        {/* Document Icon */}
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#E6F9F8' }}>
                            <svg className="w-10 h-10" style={{ color: '#0ABAB5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>

                        {file ? (
                            <div>
                                <p className="text-gray-900 font-semibold">{file.name}</p>
                                <p className="text-gray-400 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB — Click to change</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-900 font-semibold text-lg">Choose a File or Drag It Here</p>
                                <p className="text-gray-400 text-sm mt-1">Supported formats: .docx, or .txt</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Start Checking Button */}
            <div className="flex items-center justify-end gap-4 mt-6">
                <a href="#file-requirements" className="text-sm font-medium hover:underline" style={{ color: '#0ABAB5' }}>
                    File Requirements &gt;&gt;
                </a>
                <button
                    type="submit"
                    disabled={!file || isLoading}
                    className="flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-full transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: !file || isLoading ? '#ccc' : '#0ABAB5' }}
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Start Checking
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default FileUpload;