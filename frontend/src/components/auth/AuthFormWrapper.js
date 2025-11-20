import React from 'react';

/**
 * Auth Form Wrapper Component
 * Common layout wrapper for authentication forms (Login/Register)
 * 
 * @param {string} title - Form title
 * @param {string} subtitle - Form subtitle
 * @param {ReactNode} icon - Icon component for header
 * @param {ReactNode} children - Form content
 * @param {string} logoSrc - Logo image source
 */
const AuthFormWrapper = ({
    title,
    subtitle,
    icon,
    children,
    logoSrc = './logo.png'
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div
                    className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
                    style={{
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        animationDelay: '1s',
                    }}
                ></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-white">
                        <div className="flex justify-center mb-4">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-3">
                                <img
                                    src={logoSrc}
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
                            {icon}
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-center text-indigo-100 mt-2">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Form Content */}
                    <div className="px-8 py-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthFormWrapper;
