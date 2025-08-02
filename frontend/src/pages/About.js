import React from 'react';

const About = () => {
    // You can choose a name from the project plan or use a placeholder.
    const websiteName = "Authintic"; 

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">About Our Project</h1>
                
                <div className="text-gray-700 space-y-6">
                    <p className="text-lg">
                        Welcome to <strong>{websiteName}</strong>, a final year project by Prathamesh Mohite, Harsh Pardeshi, Viraj Kamble, and Jay Patil for the Department of Electronics & Computer Science at MES's Pillai College of Engineering.
                    </p>

                    <div>
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-2">Our Mission</h2>
                        <p>
                            In an era where information is abundant and AI-powered writing tools are increasingly common, maintaining academic integrity is more challenging than ever. Our mission is to provide a powerful, intelligent, and easy-to-use tool for students, educators, and researchers to verify the originality of their work. We aim to combat the "new era of plagiarism" by developing a system that is smarter than the tools used to cheat it.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-2">Our Technology</h2>
                        <p className="mb-4">
                            This platform is more than just a simple text-matching tool. It is built on a sophisticated <strong>Hybrid AI Model</strong> that combines two key techniques:
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>
                                <strong>Syntactic Analysis:</strong> Using traditional NLP algorithms like TF-IDF, our system detects direct, word-for-word plagiarism with high precision.
                            </li>
                            <li>
                                <strong>Semantic Analysis:</strong> Leveraging advanced sentence-transformer models, our engine understands the <em>meaning</em> and <em>context</em> of sentences. This allows it to identify instances of sophisticated paraphrasing, where the wording is different but the core idea has been copied.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-2">Gemini-Powered Rewrite Suggestions</h2>
                        <p>
                            To make our tool not just a detector but also a constructive learning aid, we have integrated the <strong>Google Gemini API</strong>. When a section of text is flagged, users can get an AI-powered suggestion to rewrite the sentence in a completely original way, helping them learn how to properly integrate sources and express ideas in their own voice.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-2">Tech Stack</h2>
                        <p>
                            Our full technology stack includes the MERN stack (MongoDB, Express.js, React, Node.js) for the web application and a dedicated Python backend using Flask, PyTorch, and Scikit-learn to power our AI services.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
