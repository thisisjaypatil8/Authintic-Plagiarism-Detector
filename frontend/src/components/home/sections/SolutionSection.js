import React, { useState, useRef, useEffect, useCallback } from 'react';
import ProcessStepCard from '../ui/ProcessStepCard';

/**
 * Solution Section - Interactive process explanation
 * Shows the 4-step hybrid analysis process
 */
const SolutionSection = () => {
    const [activeStep, setActiveStep] = useState('upload');
    const processDetailsRef = useRef(null);

    const processData = [
        { id: 'upload', title: '1. Document Upload', icon: '📤', description: 'The user uploads their document through the web interface. The raw text is extracted for processing.' },
        { id: 'preprocess', title: '2. Preprocessing', icon: '⚙️', description: 'The text is cleaned and split into individual sentences. This step prepares the data for accurate analysis.' },
        { id: 'hybrid', title: '3. Hybrid Analysis', icon: '🔬', description: 'Each sentence undergoes a two-stage check: a fast syntactic analysis for direct copies, followed by a deep semantic analysis for paraphrased content.' },
        { id: 'report', title: '4. Report Generation', icon: '📊', description: 'A comprehensive report is generated, highlighting plagiarized sections, identifying original sources, and providing an overall similarity score.' }
    ];

    const updateProcessDetails = useCallback((id) => {
        const step = processData.find(s => s.id === id);
        if (processDetailsRef.current && step) {
            processDetailsRef.current.innerHTML = `<h4 class="font-bold text-xl text-indigo-900 mb-3">${step.title}</h4><p class="text-gray-700 leading-relaxed">${step.description}</p>`;
        }
    }, []);

    useEffect(() => {
        // Set initial step details
        updateProcessDetails('upload');
    }, [updateProcessDetails]);

    const handleProcessClick = (id) => {
        setActiveStep(id);
        updateProcessDetails(id);
    };

    return (
        <section id="solution" className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-block bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        Our Process
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Hybrid Analysis Process</h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Authintic uses a multi-stage process to ensure comprehensive and accurate detection. Click each step to learn more.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 max-w-6xl mx-auto">
                    {processData.map((step) => (
                        <ProcessStepCard
                            key={step.id}
                            id={step.id}
                            icon={step.icon}
                            title={step.title}
                            isActive={activeStep === step.id}
                            onClick={() => handleProcessClick(step.id)}
                        />
                    ))}
                </div>
                <div ref={processDetailsRef} className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl border-2 border-indigo-100 min-h-[140px] transition-all max-w-4xl mx-auto"></div>
            </div>
        </section>
    );
};

export default SolutionSection;
