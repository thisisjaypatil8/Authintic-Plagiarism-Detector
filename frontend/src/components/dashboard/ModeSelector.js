import React from 'react';

/**
 * ModeSelector Component
 * Allows users to choose between Fast and Deep analysis modes
 */
const ModeSelector = ({ selectedMode, onModeChange }) => {
    const modes = [
        {
            id: 'fast',
            icon: '⚡',
            title: 'Fast Mode',
            time: '~1-3 seconds',
            accuracy: '~85%',
            description: 'Direct copy detection using TF-IDF',
            features: [
                'Quick analysis',
                'Detects exact matches',
                'Ideal for initial checks'
            ],
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'deep',
            icon: '🔍',
            title: 'Deep Mode',
            time: '~10-30s (cached: ~1-3s)',
            accuracy: '~95%+',
            description: 'AI-powered semantic analysis',
            features: [
                'Detects paraphrasing',
                'Comprehensive analysis',
                'Recommended for final checks'
            ],
            color: 'from-purple-500 to-indigo-600'
        }
    ];

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {modes.map(mode => (
                <div
                    key={mode.id}
                    onClick={() => onModeChange(mode.id)}
                    className={`
                        relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300
                        ${selectedMode === mode.id
                            ? 'border-indigo-500 shadow-lg scale-[1.02]'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }
                    `}
                >
                    {/* Selection Indicator */}
                    <div className="absolute top-4 right-4">
                        <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center
                            ${selectedMode === mode.id
                                ? 'border-indigo-500 bg-indigo-500'
                                : 'border-gray-300 bg-white'
                            }
                        `}>
                            {selectedMode === mode.id && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Mode Icon and Title */}
                    <div className="mb-4">
                        <div className={`
                            inline-flex items-center justify-center w-14 h-14 rounded-xl mb-3
                            bg-gradient-to-br ${mode.color} text-white text-2xl shadow-md
                        `}>
                            {mode.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{mode.title}</h3>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Processing Time:</span>
                            <span className="text-gray-900 font-semibold">{mode.time}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Accuracy:</span>
                            <span className="text-gray-900 font-semibold">{mode.accuracy}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4">{mode.description}</p>

                    {/* Features */}
                    <div className="space-y-2">
                        {mode.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Selected Badge */}
                    {selectedMode === mode.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Selected Mode
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ModeSelector;
