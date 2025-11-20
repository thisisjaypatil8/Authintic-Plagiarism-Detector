import React from 'react';

/**
 * Auth Button Component
 * Styled button for authentication forms with loading state
 * 
 * @param {string} children - Button text
 * @param {boolean} loading - Whether button is in loading state
 * @param {string} loadingText - Text to show when loading
 * @param {boolean} disabled - Whether button is disabled
 * @param {string} type - Button type (submit, button)
 */
const AuthButton = ({
    children,
    loading = false,
    loadingText = 'Loading...',
    disabled = false,
    type = 'submit',
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={loading || disabled}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default AuthButton;
