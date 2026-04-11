import React from 'react';

/**
 * Error Alert Component
 * Displays error messages for authentication forms
 * 
 * @param {string} message - Error message to display
 */
const ErrorAlert = ({ message }) => {
    if (!message) return null;

    return (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start gap-3">
            <svg
                className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                />
            </svg>
            <p className="text-sm text-red-700">{message}</p>
        </div>
    );
};

export default ErrorAlert;
