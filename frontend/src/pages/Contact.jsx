import React, { useState } from 'react';
import AnimatedName from '../components/AnimatedName';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const [teamCardHovered, setTeamCardHovered] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="pt-28 pb-12 text-center" style={{ background: 'linear-gradient(180deg, #E6F9F8 0%, #fff 100%)' }}>
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Get in <span style={{ color: '#0ABAB5' }}>Touch</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Have questions about Authintic? Want to report a bug or suggest a feature? We'd love to hear from you.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6 max-w-5xl pb-16">
                <div className="grid md:grid-cols-5 gap-10">
                    {/* Contact Form */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-2xl border border-gray-200 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>

                            {submitted && (
                                <div className="mb-6 p-4 rounded-xl border text-sm font-medium" style={{ background: '#E6F9F8', borderColor: '#0ABAB5', color: '#099D99' }}>
                                    ✓ Thank you! Your message has been received. We'll get back to you soon.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0ABAB5] focus:ring-2 focus:ring-[#0ABAB5]/20 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="you@example.com"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0ABAB5] focus:ring-2 focus:ring-[#0ABAB5]/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="What's this about?"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0ABAB5] focus:ring-2 focus:ring-[#0ABAB5]/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="Tell us more..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0ABAB5] focus:ring-2 focus:ring-[#0ABAB5]/20 transition-all resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-8 py-3 text-white font-semibold rounded-full transition-all hover:shadow-lg text-sm"
                                    style={{ background: '#0ABAB5' }}
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-2 space-y-5">
                        <div 
                            className="p-6 rounded-2xl text-white" 
                            style={{ background: 'linear-gradient(135deg, #0ABAB5, #099D99)' }}
                            onMouseEnter={() => setTeamCardHovered(true)}
                            onMouseLeave={() => setTeamCardHovered(false)}
                        >
                            <h3 className="font-bold text-lg mb-4">Project Team</h3>
                            <div className="space-y-3 text-white/90 text-sm">
                                <p><strong>Prathamesh Mohite</strong></p>
                                <p><strong>Harsh Pardeshi</strong></p>
                                <p><strong>Viraj Kamble</strong></p>
                                <p><AnimatedName animColor="#ffffff" flashColor="#ffeb3b" triggered={teamCardHovered} /></p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-gray-200" style={{ background: '#FAFBFC' }}>
                            <h3 className="font-bold text-gray-900 mb-4">Institution</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p className="font-semibold text-gray-800">MES's Pillai College<br/>of Engineering</p>
                                <p>Department of Electronics & Computer Science</p>
                                <p className="text-gray-400 text-xs mt-3">New Panvel, Navi Mumbai, Maharashtra</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-gray-200" style={{ background: '#FAFBFC' }}>
                            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="/resources#faq" className="hover:text-[#0ABAB5] text-gray-600 transition-colors">
                                        → Frequently Asked Questions
                                    </a>
                                </li>
                                <li>
                                    <a href="/resources#user-guide" className="hover:text-[#0ABAB5] text-gray-600 transition-colors">
                                        → User Guide
                                    </a>
                                </li>
                                <li>
                                    <a href="/about" className="hover:text-[#0ABAB5] text-gray-600 transition-colors">
                                        → About the Project
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
