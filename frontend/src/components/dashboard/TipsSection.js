import React from 'react';

/**
 * Tips Section Component
 * Best practices and tips for better plagiarism detection results
 */
const TipsSection = () => {
    const tips = [
        {
            title: "Use High-Quality Sources",
            description: "When researching, prioritize reputable academic sources and properly cite them in your work.",
            icon: "📚",
            color: "blue"
        },
        {
            title: "Paraphrase Effectively",
            description: "Don't just rearrange words. Understand the concept and express it in your own unique way.",
            icon: "✍️",
            color: "purple"
        },
        {
            title: "Quote Properly",
            description: "When using direct quotes, always use quotation marks and provide accurate citations.",
            icon: "💬",
            color: "green"
        },
        {
            title: "Check Early & Often",
            description: "Don't wait until the last minute. Check your work throughout the writing process.",
            icon: "⏰",
            color: "orange"
        },
        {
            title: "Understand the Results",
            description: "A match doesn't always mean plagiarism. Review flagged content and determine if it needs citation.",
            icon: "🔍",
            color: "pink"
        },
        {
            title: "Keep Your Sources",
            description: "Maintain a bibliography as you research so you can easily cite sources later.",
            icon: "📝",
            color: "indigo"
        }
    ];

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-8 mb-8 border-2 border-amber-200">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Pro Tips for Better Results
                </h2>
                <p className="text-gray-700 text-lg">
                    Follow these best practices to maintain academic integrity
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
                {tips.map((tip, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-xl border-2 border-amber-100 hover:border-amber-300 transition-all hover:shadow-md group"
                    >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">
                            {tip.icon}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                            {tip.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {tip.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TipsSection;
