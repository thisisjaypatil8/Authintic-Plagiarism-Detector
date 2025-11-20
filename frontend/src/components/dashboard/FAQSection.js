import React, { useState } from 'react';

/**
 * FAQ Section Component
 * Frequently asked questions with expandable answers
 */
const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What file formats are supported?",
            answer: "We currently support .docx (Microsoft Word), .txt (Plain Text), and .pdf (PDF) files. Maximum file size is 10MB."
        },
        {
            question: "How accurate is the plagiarism detection?",
            answer: "Our hybrid AI model combines syntactic analysis (TF-IDF) with semantic understanding (transformer models) to achieve high accuracy in detecting both direct copying and sophisticated paraphrasing."
        },
        {
            question: "What does the similarity score mean?",
            answer: "The similarity score indicates the percentage of your document that matches existing sources. Higher scores suggest more potential plagiarism, but not all matches are problematic (citations, common phrases, etc.)."
        },
        {
            question: "Can I check multiple documents?",
            answer: "Yes! You can check as many documents as you need. Simply upload a new file after reviewing your previous results."
        },
        {
            question: "How long does the analysis take?",
            answer: "Analysis typically takes 30 seconds to 2 minutes depending on document length. Longer documents may take more time for thorough analysis."
        },
        {
            question: "Is my data secure and private?",
            answer: "Yes, your documents are processed securely and are not stored permanently. We respect your privacy and academic integrity."
        },
        {
            question: "What should I do if plagiarism is detected?",
            answer: "Review the flagged sections carefully. Some matches may be legitimate (quotes, common phrases). Use our AI-powered rewrite suggestions or add proper citations where needed."
        },
        {
            question: "Does the tool work for academic papers?",
            answer: "Absolutely! Our tool is designed specifically for academic work, including essays, research papers, theses, and dissertations."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Frequently Asked Questions
                </h2>
                <p className="text-gray-600 text-lg">
                    Find answers to common questions about our plagiarism checker
                </p>
            </div>

            <div className="space-y-3">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition-all"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full text-left px-6 py-4 bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-pink-50 transition-all flex items-center justify-between gap-4"
                        >
                            <span className="font-semibold text-gray-900 text-lg flex items-center gap-3">
                                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 text-purple-600 font-bold text-sm">
                                    Q{index + 1}
                                </span>
                                {faq.question}
                            </span>
                            <svg
                                className={`w-6 h-6 text-purple-600 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {openIndex === index && (
                            <div className="px-6 py-4 bg-purple-50 border-t-2 border-purple-100 animate-fadeIn">
                                <p className="text-gray-700 leading-relaxed pl-11">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQSection;
