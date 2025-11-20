import React from 'react';
import techStack from '../../../data/techStackData';
import TechStackCard from '../ui/TechStackCard';

/**
 * Tech Stack Section
 * Displays the technology stack used in the project
 */
const TechStackSection = () => {
    return (
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-orange-100">
            <div className="flex items-start gap-5 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Built With Modern Technology</h2>
                    <p className="text-gray-600 text-lg mb-8">A robust, scalable architecture powering next-generation plagiarism detection</p>
                    <div className="grid md:grid-cols-3 gap-5">
                        {techStack.map((tech, index) => (
                            <TechStackCard
                                key={index}
                                category={tech.category}
                                items={tech.items}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechStackSection;
