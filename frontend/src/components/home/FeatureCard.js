import React from 'react';

/**
 * FeatureCard — Teal-accent stat card
 */
const FeatureCard = ({ icon, title, variant = 'teal' }) => {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#0ABAB5] transition-all group text-center">
            <div className="text-2xl font-extrabold mb-1 transition-colors group-hover:text-[#0ABAB5]" style={{ color: '#0ABAB5' }}>
                {icon}
            </div>
            <div className="text-sm font-medium text-gray-600">{title}</div>
        </div>
    );
};

export default FeatureCard;
