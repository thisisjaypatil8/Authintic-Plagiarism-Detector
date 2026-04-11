import React from 'react';
import { IconUpload, IconCog, IconChart, IconDownload } from '../Icons';

/**
 * Solution Section — "How to Use Authintic" with step-by-step guide
 * Clean style inspired by T-detector with teal accents
 */
const SolutionSection = () => {
    const steps = [
        {
            number: '01',
            title: 'Upload your document and click "Start Checking"',
            description: 'Drag and drop your document or click to browse. Supports .pdf, .docx, and .txt files up to 10MB.',
            icon: <IconUpload className="w-5 h-5" style={{ color: '#0ABAB5' }} />
        },
        {
            number: '02',
            title: 'Wait while Authintic processes your file',
            description: 'Our 3-layer hybrid engine analyzes your document: TF-IDF for direct matches, FAISS for semantic search, and BERT for AI-generated content.',
            icon: <IconCog className="w-5 h-5" style={{ color: '#0ABAB5' }} />
        },
        {
            number: '03',
            title: 'Review your detailed Similarity & AI Report',
            description: 'Get a color-coded report showing exactly which sentences were flagged, by which detection layer, with similarity scores and source references.',
            icon: <IconChart className="w-5 h-5" style={{ color: '#0ABAB5' }} />
        },
        {
            number: '04',
            title: 'Download your official report as PDF',
            description: 'Export a professional PDF report with doughnut chart, flagged sections table, and full highlighted text — ready for submission.',
            icon: <IconDownload className="w-5 h-5" style={{ color: '#0ABAB5' }} />
        }
    ];

    return (
        <section id="how-it-works" className="py-20" style={{ background: '#FAFBFC' }}>
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        How to Use Authintic
                    </h2>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
                        Four simple steps to check your document for plagiarism and AI-generated content
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#0ABAB5] hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-5">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#0ABAB5' }}>
                                        {step.number}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0ABAB5] transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SolutionSection;
