import React from 'react';

/**
 * Tech Stack Card Component
 * Displays a category of technologies with checkmark icons
 * 
 * @param {string} category - Technology category name
 * @param {Array<string>} items - List of technologies in this category
 */
const TechStackCard = ({ category, items }) => {
    return (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-lg hover:-translate-y-1">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                <span className="w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg"></span>
                {category}
            </h3>
            <ul className="space-y-3">
                {items.map((item, i) => (
                    <li key={i} className="text-gray-700 flex items-center gap-3">
                        <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TechStackCard;
