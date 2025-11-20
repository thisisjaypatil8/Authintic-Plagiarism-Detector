import React from 'react';
import features from '../../../data/featuresData';

/**
 * Feature Highlights Section
 * Displays feature cards below the hero
 */
const FeatureHighlightsSection = () => {
    return (
        <div className="max-w-6xl mx-auto mb-16">
            <div className="grid md:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-indigo-100">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureHighlightsSection;
