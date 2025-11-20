import React from 'react';

/**
 * Process Step Card component for the "How It Works" section
 * @param {string} id - Step identifier
 * @param {string} icon - Emoji icon
 * @param {string} title - Step title
 * @param {boolean} isActive - Whether this step is currently active
 * @param {function} onClick - Click handler
 */
const ProcessStepCard = ({ id, icon, title, isActive, onClick }) => {
    const activeClasses = isActive 
        ? 'ring-2 ring-indigo-500 bg-indigo-50 shadow-lg scale-105'
        : 'hover:shadow-md';

    return (
        <button
            id={`step-btn-${id}`}
            onClick={onClick}
            className={`group p-6 bg-white rounded-2xl shadow-md text-center flex flex-col items-center space-y-4 border-2 border-transparent hover:shadow-xl transition-all hover:scale-105 active:scale-95 ${activeClasses}`}
        >
            <div className="text-5xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {title}
            </h4>
        </button>
    );
};

export default ProcessStepCard;
