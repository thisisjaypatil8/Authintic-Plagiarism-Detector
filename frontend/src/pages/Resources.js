import React, { useState } from 'react';
import { IconRobot, IconMicroscope, IconShield, IconLightbulb, IconWarning, IconBolt, IconGradCap, IconCheck, IconDocument, IconChart, IconHugFace, IconBook, IconLink, IconQuestion, IconBookOpen } from '../components/Icons';

const Resources = () => {
    const [expandedArticle, setExpandedArticle] = useState(null);

    const articles = [
        {
            id: 1,
            title: 'The Rise of AI Plagiarism',
            subtitle: 'How AI-generated text is changing the plagiarism landscape',
            icon: <IconRobot className="w-7 h-7" style={{ color: '#0ABAB5' }} />,
            readTime: '5 min read',
            sections: [
                { type: 'text', content: 'The rapid advancement of AI language models has introduced a new form of academic dishonesty: AI-generated plagiarism. Unlike traditional plagiarism, where text is copied directly from a source, AI plagiarism involves using tools like ChatGPT, Claude, or Gemini to generate entirely new text that may appear original but lacks genuine intellectual contribution.' },
                { type: 'heading', content: 'The Detection Gap' },
                { type: 'text', content: 'Traditional plagiarism detectors rely on comparing submitted text against known databases. They excel at finding exact or near-exact matches. However, AI-generated content is technically "original" — it doesn\'t exist in any prior database. This creates a significant blind spot for conventional tools.' },
                { type: 'callout', color: '#0ABAB5', bg: '#E6F9F8', iconEl: <IconLightbulb className="w-5 h-5" style={{ color: '#0ABAB5' }} />, title: 'How Authintic Solves This', content: 'Authintic addresses this challenge through its 3-layer hybrid detection system. The BERT classifier (Layer 3) is specifically fine-tuned on the PAN25 dataset to identify patterns characteristic of AI-generated and AI-paraphrased text, even when no direct source match exists.' },
                { type: 'heading', content: 'The Arms Race' },
                { type: 'text', content: 'As AI tools become more sophisticated, the arms race between generation and detection will continue. The key is using multiple complementary approaches — exactly what Authintic\'s hybrid model does:' },
                { type: 'list', items: [
                    { bold: 'Layer 1 (TF-IDF):', text: ' Catches direct copies and simple paraphrases' },
                    { bold: 'Layer 2 (FAISS):', text: ' Detects semantic similarity across 1.77M indexed vectors' },
                    { bold: 'Layer 3 (BERT):', text: ' Identifies AI-generated patterns at the sentence level' },
                ]},
                { type: 'heading', content: 'Impact on Education' },
                { type: 'text', content: 'Studies suggest that up to 30% of student submissions may now contain some AI-generated content. This doesn\'t mean students are "cheating" — many use AI as a starting point. The challenge is distinguishing between legitimate AI-assisted learning and wholesale content generation.' },
                { type: 'callout', color: '#F59E0B', bg: '#FEF3C7', iconEl: <IconWarning className="w-5 h-5" style={{ color: '#F59E0B' }} />, title: 'Important Note', content: 'Detection tools should be used as educational aids, not punitive instruments. The goal is to help students develop authentic writing skills.' },
            ]
        },
        {
            id: 2,
            title: 'How 3-Layer Detection Works',
            subtitle: 'A technical overview of TF-IDF, FAISS, and BERT cascade',
            icon: <IconMicroscope className="w-7 h-7" style={{ color: '#0ABAB5' }} />,
            readTime: '7 min read',
            sections: [
                { type: 'text', content: 'Authintic uses a cascading 3-layer approach where each layer addresses a different type of plagiarism:' },
                { type: 'heading', content: 'Layer 1: TF-IDF Cosine Similarity', color: '#0ABAB5' },
                { type: 'text', content: 'Term Frequency–Inverse Document Frequency converts text into numerical vectors. By computing cosine similarity between these vectors, we efficiently identify sentences that share significant vocabulary overlap. This catches direct copies and close paraphrases.' },
                { type: 'code', lines: [
                    'similarity = dot(tfidf_A, tfidf_B) / (|tfidf_A| × |tfidf_B|)',
                    '→ Threshold: 0.6 for flagging',
                    '→ F1 Score: 0.78 on PAN25',
                ]},
                { type: 'heading', content: 'Layer 2: FAISS Semantic Search', color: '#0ABAB5' },
                { type: 'text', content: 'Using the all-MiniLM-L6-v2 model, each sentence is converted into a 384-dimensional embedding that captures semantic meaning. These embeddings are indexed in a FAISS database containing 1.77 million vectors.' },
                { type: 'text', content: 'When a new document is submitted, each sentence is compared against this index to find semantically similar content — even if the wording is completely different.' },
                { type: 'code', lines: [
                    'embedding = model.encode(sentence) → [384-dim float vector]',
                    'FAISS index: IVF + L2 distance search',
                    '→ F1 Score: 0.71 on PAN25',
                ]},
                { type: 'heading', content: 'Layer 3: BERT Classifier', color: '#0ABAB5' },
                { type: 'text', content: 'A fine-tuned BERT model classifies sentences as "original," "paraphrased," or "AI-generated." This layer is particularly effective against sophisticated paraphrasing and AI-assisted rewriting.' },
                { type: 'code', lines: [
                    'BERT input: [CLS] sentence [SEP]',
                    'Output: 3-class softmax (original / paraphrase / AI)',
                    '→ F1 Score: 1.00 on PAN25 test set',
                ]},
                { type: 'heading', content: 'The Cascade Pipeline' },
                { type: 'callout', color: '#0ABAB5', bg: '#E6F9F8', iconEl: <IconBolt className="w-5 h-5" style={{ color: '#0ABAB5' }} />, title: 'Pipeline Flow', content: '1. Sentences pass through TF-IDF (fast screening)\n2. If similarity exceeds threshold → flagged as "Direct Match"\n3. Remaining sentences go to FAISS for semantic analysis\n4. BERT classifies any remaining suspicious content\n\nThis cascade balances speed with accuracy — TF-IDF is fast but shallow, FAISS catches meaning-level similarities, and BERT provides the deepest analysis.' },
            ]
        },
        {
            id: 3,
            title: 'Protecting Academic Integrity',
            subtitle: 'A guide for educators and students on maintaining originality',
            icon: <IconShield className="w-7 h-7" style={{ color: '#0ABAB5' }} />,
            readTime: '6 min read',
            sections: [
                { type: 'text', content: 'Academic integrity is the foundation of meaningful education. Here\'s how both educators and students can work together to maintain it:' },
                { type: 'heading', content: 'For Students', color: '#0ABAB5' },
                { type: 'list', items: [
                    { bold: 'Start early', text: ' — last-minute work leads to shortcuts' },
                    { bold: 'Always cite your sources', text: ', even when paraphrasing' },
                    { bold: 'Use plagiarism checkers', text: ' like Authintic before submission' },
                    { bold: 'Understand the difference', text: ' between collaboration and copying' },
                    { bold: 'When in doubt', text: ', ask your professor about citation requirements' },
                ]},
                { type: 'heading', content: 'For Educators', color: '#0ABAB5' },
                { type: 'list', items: [
                    { bold: 'Design assignments', text: ' that encourage original thinking' },
                    { bold: 'Use plagiarism detection', text: ' as an educational tool, not just punishment' },
                    { bold: 'Provide clear guidelines', text: ' on what constitutes plagiarism' },
                    { bold: 'Use detailed reports', text: ' to have constructive conversations with students' },
                    { bold: 'Focus on the learning process', text: ', not just the final product' },
                ]},
                { type: 'heading', content: 'The Role of AI Detection' },
                { type: 'text', content: 'Modern plagiarism detection isn\'t just about catching cheaters. Tools like Authintic provide detailed reports that help students understand exactly where their work needs improvement.' },
                { type: 'callout', color: '#0ABAB5', bg: '#E6F9F8', iconEl: <IconGradCap className="w-5 h-5" style={{ color: '#0ABAB5' }} />, title: "Authintic's Educational Features", content: '• Color-coded highlights — instantly see which parts need attention\n• Layer identification — understand how plagiarism was detected\n• AI guidance — Gemini-powered rewrite suggestions\n• PDF reports — detailed documentation for review' },
                { type: 'callout', color: '#22C55E', bg: '#F0FDF4', iconEl: <IconCheck className="w-5 h-5" style={{ color: '#22C55E' }} />, title: 'Remember', content: 'The goal isn\'t to police students, but to help them develop authentic writing skills that will serve them throughout their careers.' },
            ]
        }
    ];

    const renderSection = (section, i) => {
        switch (section.type) {
            case 'heading':
                return (
                    <h3 key={i} className="text-lg font-bold mt-6 mb-2" style={{ color: section.color || '#1a2a32' }}>
                        {section.content}
                    </h3>
                );
            case 'text':
                return (
                    <p key={i} className="text-gray-700 leading-relaxed mb-3" style={{ fontSize: '15px' }}>
                        {section.content}
                    </p>
                );
            case 'callout':
                return (
                    <div key={i} className="rounded-xl p-4 my-4" style={{ background: section.bg, borderLeft: `4px solid ${section.color}` }}>
                        <p className="font-bold text-gray-900 mb-1 flex items-center gap-2">{section.iconEl} {section.title}</p>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
                    </div>
                );
            case 'code':
                return (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 my-3 font-mono text-sm text-gray-700 overflow-x-auto">
                        {section.lines.map((line, j) => (
                            <div key={j}>{line}</div>
                        ))}
                    </div>
                );
            case 'list':
                return (
                    <ul key={i} className="my-3 space-y-2 pl-5" style={{ listStyle: 'disc' }}>
                        {section.items.map((item, j) => (
                            <li key={j} className="text-gray-700 text-sm leading-relaxed">
                                <strong>{item.bold}</strong>{item.text}
                            </li>
                        ))}
                    </ul>
                );
            default:
                return null;
        }
    };

    const resources = [
        { title: 'User Guide', description: 'Step-by-step guide to using Authintic', link: '#user-guide', iconEl: <IconBookOpen className="w-6 h-6" style={{ color: '#0ABAB5' }} /> },
        { title: 'PAN Shared Tasks', description: 'Benchmark datasets for plagiarism detection', link: 'https://pan.webis.de/', iconEl: <IconChart className="w-6 h-6" style={{ color: '#0ABAB5' }} />, external: true },
        { title: 'all-MiniLM-L6-v2', description: 'Sentence embedding model on HuggingFace', link: 'https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2', iconEl: <IconHugFace className="w-6 h-6" style={{ color: '#0ABAB5' }} />, external: true },
        { title: 'FAISS Documentation', description: 'Facebook AI Similarity Search library', link: 'https://github.com/facebookresearch/faiss', iconEl: <IconBolt className="w-6 h-6" style={{ color: '#0ABAB5' }} />, external: true },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="pt-28 pb-12 text-center" style={{ background: 'linear-gradient(180deg, #E6F9F8 0%, #fff 100%)' }}>
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Resources & <span style={{ color: '#0ABAB5' }}>Articles</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Learn about AI plagiarism detection, how our technology works, and best practices for academic integrity.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6 max-w-5xl pb-16">
                {/* Articles */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3"><IconDocument className="w-6 h-6" style={{ color: '#0ABAB5' }} /> Awareness Articles</h2>
                    <div className="space-y-4">
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                            >
                                <button
                                    onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                                    className="w-full p-6 flex items-center gap-4 text-left"
                                >
                                    <span className="flex-shrink-0">{article.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900">{article.title}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">{article.subtitle}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 flex-shrink-0">{article.readTime}</span>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${expandedArticle === article.id ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {expandedArticle === article.id && (
                                    <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                                        {article.sections.map((section, i) => renderSection(section, i))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* User Guide */}
                <section id="user-guide" className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3"><IconBook className="w-6 h-6" style={{ color: '#0ABAB5' }} /> Quick Start Guide</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { step: '01', title: 'Create an account', desc: 'Sign up with your email and create a secure password.' },
                            { step: '02', title: 'Upload your document', desc: 'Drag and drop or browse for .pdf, .docx, or .txt files up to 10MB.' },
                            { step: '03', title: 'Choose analysis mode', desc: 'Fast Mode (TF-IDF only) for quick checks, or Deep Mode for full 3-layer analysis.' },
                            { step: '04', title: 'Review your report', desc: 'Get color-coded results with similarity scores, layer info, and PDF export.' },
                        ].map(item => (
                            <div key={item.step} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-[#0ABAB5] transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#0ABAB5' }}>
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3"><IconQuestion className="w-6 h-6" style={{ color: '#0ABAB5' }} /> Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {[
                            { q: 'What file formats are supported?', a: 'Authintic supports .pdf, .docx, and .txt files up to 10MB.' },
                            { q: 'Is my document stored after analysis?', a: 'No. Your document is analyzed in real-time and never stored permanently. We do not index submitted content.' },
                            { q: 'How accurate is the detection?', a: 'Authintic uses a 3-layer hybrid system (TF-IDF + FAISS + BERT) evaluated on the PAN25 benchmark. Individual layer F1 scores range from 0.71 to 1.00.' },
                            { q: 'What is Deep Mode vs Fast Mode?', a: 'Fast Mode uses only TF-IDF for quick screening. Deep Mode runs all 3 layers (TF-IDF → FAISS → BERT) for comprehensive analysis.' },
                            { q: 'Can it detect AI-generated content?', a: 'Yes. The BERT classifier (Layer 3) is fine-tuned to identify AI-paraphrased and AI-generated text patterns.' },
                        ].map((item, i) => (
                            <details key={i} className="bg-white rounded-xl border border-gray-200 group">
                                <summary className="p-5 cursor-pointer font-medium text-gray-900 flex items-center justify-between hover:text-[#0ABAB5] transition-colors">
                                    {item.q}
                                    <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                                    {item.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* External Resources */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3"><IconLink className="w-6 h-6" style={{ color: '#0ABAB5' }} /> External Resources</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {resources.map((res, i) => (
                            <a
                                key={i}
                                href={res.link}
                                target={res.external ? '_blank' : '_self'}
                                rel={res.external ? 'noopener noreferrer' : undefined}
                                className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-[#0ABAB5] hover:shadow-md transition-all group"
                            >
                                <span className="flex-shrink-0">{res.iconEl}</span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 group-hover:text-[#0ABAB5] transition-colors">{res.title}</h3>
                                    <p className="text-sm text-gray-500">{res.description}</p>
                                </div>
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-[#0ABAB5] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Resources;
