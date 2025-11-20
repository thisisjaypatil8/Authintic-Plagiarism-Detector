import React from 'react';

/**
 * Reusable Feature Card component for stats and features
 * @param {string} icon - Emoji or SVG icon
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @param {string} variant - Color variant (indigo, purple, pink, amber, etc.)
 * @param {string} size - Size variant (small, medium, large)
 */
const FeatureCard = ({ 
    icon, 
    title, 
    description, 
    variant = 'indigo',
    size = 'medium'
}) => {
    const variantClasses = {
        indigo: 'border-indigo-100 hover:border-indigo-200 hover:shadow-indigo-100',
        purple: 'border-purple-100 hover:border-purple-200 hover:shadow-purple-100',
        pink: 'border-pink-100 hover:border-pink-200 hover:shadow-pink-100',
        amber: 'border-amber-100 hover:border-amber-200 hover:shadow-amber-100',
        green: 'border-green-100 hover:border-green-200 hover:shadow-green-100'
    };

    const titleColorClasses = {
        indigo: 'text-indigo-600',
        purple: 'text-purple-600',
        pink: 'text-pink-600',
        amber: 'text-amber-600',
        green: 'text-green-600'
    };

    const sizeClasses = {
        small: 'p-4',
        medium: 'p-6',
        large: 'p-8'
    };

    const titleSizeClasses = {
        small: 'text-2xl',
        medium: 'text-4xl',
        large: 'text-5xl'
    };

    return (
        <div className={`bg-white/80 backdrop-blur-sm ${sizeClasses[size]} rounded-2xl shadow-lg border ${variantClasses[variant]} hover:shadow-xl transition-all hover:scale-105`}>
            <div className={`${titleSizeClasses[size]} font-bold ${titleColorClasses[variant]} mb-2`}>
                {icon}
            </div>
            <div className="text-gray-600 font-medium">{title}</div>
            {description && (
                <p className="text-gray-500 text-sm mt-2">{description}</p>
            )}
        </div>
    );
};

export default FeatureCard;
