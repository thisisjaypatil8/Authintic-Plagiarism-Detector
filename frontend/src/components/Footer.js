import React, { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedName from './AnimatedName';

const Footer = () => {
    const [footerHovered, setFooterHovered] = useState(false);

    return (
        <footer className="w-full mt-auto" style={{ background: '#0F2B35' }}>
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="logo-hover inline-flex items-center gap-2 cursor-pointer">
                            <img src="/logo.png" alt="Authintic" className="w-8 h-8 object-contain brightness-0 invert" />
                            <h3 className="text-xl font-extrabold text-white">
                                <span className="logo-teal" style={{ color: '#0ABAB5' }}>A</span>uth<span className="logo-teal" style={{ color: '#0ABAB5' }}>i</span>ntic
                            </h3>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 mt-3">
                            3-Layer Hybrid AI Plagiarism Detector.
                            Accurate similarity and AI-detection reports,
                            without storing your documents.
                        </p>
                        <p className="text-gray-500 text-xs">
                            Built at MES Pillai College of Engineering
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4 text-sm tracking-wide uppercase">Product</h4>
                        <ul className="space-y-3">
                            <li><Link to="/dashboard" className="text-gray-400 hover:text-[#0ABAB5] text-sm transition-colors">Dashboard</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-[#0ABAB5] text-sm transition-colors">About</Link></li>
                            <li><Link to="/login" className="text-gray-400 hover:text-[#0ABAB5] text-sm transition-colors">Login</Link></li>
                            <li><Link to="/register" className="text-gray-400 hover:text-[#0ABAB5] text-sm transition-colors">Sign Up</Link></li>
                        </ul>
                    </div>

                    {/* Technology */}
                    <div>
                        <h4 className="font-bold text-white mb-4 text-sm tracking-wide uppercase">Technology</h4>
                        <ul className="space-y-3">
                            <li className="text-gray-400 text-sm">TF-IDF Analysis</li>
                            <li className="text-gray-400 text-sm">FAISS Semantic Search</li>
                            <li className="text-gray-400 text-sm">BERT Classifier</li>
                            <li className="text-gray-400 text-sm">Google Gemini AI</li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-white mb-4 text-sm tracking-wide uppercase">Resources</h4>
                        <ul className="space-y-3">
                            <li><Link to="/resources#user-guide" className="text-gray-400 hover:text-[#0ABAB5] text-sm transition-colors">User Guide</Link></li>
                            <li><Link to="/resources#faq" className="text-gray-400 hover:text-[#0ABAB5] text-sm transition-colors">FAQ</Link></li>
                            <li><Link to="/resources" className="text-gray-400 hover:text-[#0ABAB5] text-sm transition-colors">Articles</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-[#0ABAB5] text-sm transition-colors">Contact Us</Link></li>
                            <li><a href="https://pan.webis.de/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0ABAB5] text-sm transition-colors">PAN Shared Tasks ↗</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div 
                className="border-t" 
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                onMouseEnter={() => setFooterHovered(true)}
                onMouseLeave={() => setFooterHovered(false)}
            >
                <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} Authintic. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-xs mt-2 md:mt-0">
                        Developed by Prathamesh, Harsh, Viraj, and <AnimatedName name="Jay" tag="span" animColor="#0ABAB5" flashColor="#00f0ff" triggered={footerHovered} />
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
