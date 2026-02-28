import React, { lazy, Suspense } from 'react';
import { IconStar, IconMicroscope, IconTarget, IconBolt, IconGradCap } from '../components/Icons';
import ErrorBoundary from '../components/common/ErrorBoundary';
import TechStackSection from '../components/about/TechStackSection';
import AnimatedName from '../components/AnimatedName';

const TeamSection = lazy(() => import('../components/about/TeamSection'));

const About = () => {
    const websiteName = "Authintic";

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>

                {/* HERO — Large headline + right illustration */}
                <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E6F9F8 0%, #fff 100%)' }}>
                    <div className="container mx-auto px-6 max-w-6xl pt-28 pb-20">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border" style={{ borderColor: '#0ABAB5', color: '#0ABAB5', background: 'rgba(10,186,181,0.05)' }}>
                                    <span className="inline-flex items-center gap-2"><IconStar className="w-5 h-5" style={{ color: '#0ABAB5' }} /> About Our Project</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                                    Meet <span style={{ color: '#0ABAB5' }}>{websiteName}</span>
                                </h1>
                                <p className="text-xl text-gray-500 leading-relaxed">
                                    A groundbreaking plagiarism detection system developed at MES Pillai College of Engineering, combining TF-IDF, FAISS, and BERT in a single hybrid pipeline.
                                </p>
                            </div>
                            <div className="hidden md:flex justify-center">
                                <div className="relative">
                                    <div className="w-72 h-72 rounded-3xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ABAB5, #099D99)' }}>
                                        <img src="/logo.png" alt="Authintic" className="w-36 h-36 object-contain brightness-0 invert" />
                                    </div>
                                    <div className="absolute -top-4 -right-4 bg-white shadow-lg rounded-2xl px-4 py-3 text-sm font-bold text-gray-900">
                                        <span className="inline-flex items-center gap-1"><IconMicroscope className="w-4 h-4" /> 3-Layer Hybrid</span>
                                    </div>
                                    <div className="absolute -bottom-4 -left-4 bg-white shadow-lg rounded-2xl px-4 py-3 text-sm font-bold text-gray-900">
                                        <span className="inline-flex items-center gap-1"><IconTarget className="w-4 h-4" /> PAN25 Evaluated</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 1 — Our Journey (text left, visual right) */}
                <section className="py-20">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#0ABAB5' }}>Our Journey</p>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 leading-snug">
                                    Building the future of <br/>academic integrity
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    Welcome to <strong style={{ color: '#0ABAB5' }}>{websiteName}</strong> — developed by <strong>Prathamesh Mohite</strong>, <strong>Harsh Pardeshi</strong>, <strong>Viraj Kamble</strong>, and <AnimatedName /> at MES's Pillai College of Engineering. Born from our passion for technology and commitment to academic excellence, this project showcases the power of AI in preserving the integrity of scholarly work.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    In an era dominated by AI writing assistants and unprecedented access to information, academic integrity faces new challenges. Our mission is to provide students, educators, and researchers with an intelligent, intuitive tool to verify originality.
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <div className="relative p-8 rounded-3xl" style={{ background: '#F0FDFA' }}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm text-center border border-gray-100">
                                            <div className="text-3xl font-extrabold" style={{ color: '#0ABAB5' }}>3</div>
                                            <div className="text-sm text-gray-500 mt-1">Detection Layers</div>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-sm text-center border border-gray-100">
                                            <div className="text-3xl font-extrabold" style={{ color: '#0ABAB5' }}>1.77M</div>
                                            <div className="text-sm text-gray-500 mt-1">FAISS Vectors</div>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-sm text-center border border-gray-100">
                                            <div className="text-3xl font-extrabold" style={{ color: '#0ABAB5' }}>1.00</div>
                                            <div className="text-sm text-gray-500 mt-1">BERT F1 Score</div>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-sm text-center border border-gray-100">
                                            <div className="text-3xl font-extrabold" style={{ color: '#0ABAB5' }}>PAN25</div>
                                            <div className="text-sm text-gray-500 mt-1">Benchmark</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2 — Technology (visual left, text right) */}
                <section className="py-20" style={{ background: '#FAFBFC' }}>
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            {/* Visual left */}
                            <div className="flex justify-center order-2 md:order-1">
                                <div className="space-y-4 w-full max-w-sm">
                                    {[
                                        { num: '1', title: 'TF-IDF Cosine Similarity', desc: 'Syntactic analysis — direct match detection', score: 'F1: 0.78', bg: '#FEF2F2', border: '#FCA5A5' },
                                        { num: '2', title: 'FAISS Semantic Search', desc: 'Semantic analysis — paraphrase detection', score: 'F1: 0.71', bg: '#FEF9C3', border: '#FDE047' },
                                        { num: '3', title: 'BERT Classifier', desc: 'AI-generated text identification', score: 'F1: 1.00', bg: '#F3E8FF', border: '#C4B5FD' },
                                    ].map(layer => (
                                        <div key={layer.num} className="flex items-center gap-4 p-5 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all" style={{ borderColor: layer.border }}>
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0" style={{ background: '#0ABAB5' }}>
                                                {layer.num}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900">{layer.title}</h3>
                                                <p className="text-xs text-gray-500">{layer.desc}</p>
                                            </div>
                                            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: layer.bg, color: '#333' }}>{layer.score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Text right */}
                            <div className="order-1 md:order-2">
                                <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#0ABAB5' }}>Hybrid AI Technology</p>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 leading-snug">
                                    Three layers, one <br/>powerful pipeline
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    {websiteName} goes beyond simple text matching. Our platform leverages a <strong style={{ color: '#0ABAB5' }}>Hybrid AI Model</strong> combining three complementary detection strategies in a cascading pipeline.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Each layer is optimized to catch different types of plagiarism — TF-IDF for direct copies, FAISS for meaning-level similarities across 1.77M indexed vectors, and BERT for AI-generated content identification.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3 — Gemini Integration (text left, visual right) */}
                <section className="py-20">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#0ABAB5' }}>AI-Powered Learning</p>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 leading-snug">
                                    From detection to <br/>education
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    Through <strong style={{ color: '#0ABAB5' }}>Google Gemini API</strong> integration, flagged content comes with intelligent rewrite suggestions — transforming {websiteName} from a detector into an educational companion.
                                </p>
                                <div className="p-5 rounded-2xl border border-gray-200" style={{ background: '#F0FDFA' }}>
                                    <p className="text-gray-500 italic text-sm leading-relaxed">
                                        "Learn to express ideas in your own voice while maintaining academic standards — that's the future of education."
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="p-8 rounded-3xl text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D3B4A 0%, #0F2B35 100%)' }}>
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl opacity-5 -mr-20 -mt-20"></div>
                                    <div className="relative space-y-4">
                                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                            <p className="text-xs text-gray-400 mb-1">AI Suggestion</p>
                                            <p className="text-sm text-white/80">"Consider rephrasing this sentence to better express your original interpretation..."</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                            <p className="text-xs text-gray-400 mb-1">Originality Tips</p>
                                            <p className="text-sm text-white/80">"Add a citation for this source and paraphrase in your own words."</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-white/60">
                                            <IconBolt className="w-5 h-5" />
                                            <span>Powered by Google Gemini</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="py-16" style={{ background: '#FAFBFC' }}>
                    <div className="container mx-auto px-6 max-w-6xl">
                        <TechStackSection />
                    </div>
                </section>

                {/* Guide + Team */}
                <section className="py-16">
                    <div className="container mx-auto px-6 max-w-6xl space-y-10">
                        
                        {/* Guide — Compact inline layout */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#E6F9F8' }}>
                                    <svg className="w-7 h-7" style={{ color: '#0ABAB5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <p className="text-sm font-bold uppercase tracking-wide mb-0.5" style={{ color: '#0ABAB5' }}>Project Guide</p>
                                    <p className="text-gray-400 text-sm">Under the guidance and mentorship of</p>
                                </div>
                                <div className="bg-gray-50 border border-gray-100 rounded-xl px-8 py-4 text-center hover:shadow-md transition-all">
                                    <h3 className="font-bold text-gray-900 text-lg">Prof. Seema Mishra</h3>
                                    <p className="text-sm font-medium" style={{ color: '#0ABAB5' }}>Assistant Professor</p>
                                </div>
                            </div>
                        </div>

                        {/* Team */}
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center min-h-[150px]">
                                    <div className="w-8 h-8 border-2 border-gray-200 border-t-[#0ABAB5] rounded-full animate-spin"></div>
                                </div>
                            }
                        >
                            <TeamSection />
                        </Suspense>
                    </div>
                </section>

                {/* Institution Banner */}
                <section className="py-16">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="p-12 rounded-3xl text-white text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0ABAB5 0%, #099D99 60%, #0D3B4A 100%)' }}>
                            <div className="relative">
                                <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                    <span className="inline-flex items-center gap-2"><IconGradCap className="w-5 h-5" /> Proudly Presented By</span>
                                </div>
                                <h3 className="text-3xl font-bold mb-2">MES's Pillai College of Engineering</h3>
                                <p className="text-white/80 text-lg mb-1">Department of Electronics & Computer Science</p>
                                <p className="text-white/60 font-medium mt-4">Final Year Project • Academic Year 2024-2025</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </ErrorBoundary>
    );
};

export default About;
