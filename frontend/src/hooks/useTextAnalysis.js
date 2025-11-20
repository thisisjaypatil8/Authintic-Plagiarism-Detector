import { useState } from 'react';

// Source documents for similarity comparison
const sourceDocuments = {
    "source-doc-01.txt": "Artificial Intelligence has great capacities that are cutting edge and exceptional for plagiarism detection.",
    "source-doc-02.txt": "The GPT-3 model covers not only natural language but also coding language.",
    "source-doc-03.txt": "Recent developments in extensive auto-code completion could fill in the actual code with a few comments or a function name."
};

/**
 * Custom hook for text plagiarism analysis
 * @returns {Object} - { analyze, isAnalyzing, results }
 */
const useTextAnalysis = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);

    /**
     * Calculate simple text similarity using Jaccard coefficient
     */
    const simpleTextSimilarity = (text1, text2) => {
        const words1 = new Set(text1.toLowerCase().split(/\s+/));
        const words2 = new Set(text2.toLowerCase().split(/\s+/));
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        return union.size === 0 ? 0 : intersection.size / union.size;
    };

    /**
     * Analyze text for plagiarism
     * @param {string} text - Text to analyze
     * @returns {Promise} - Resolves with analysis results
     */
    const analyze = (text) => {
        return new Promise((resolve) => {
            if (!text.trim()) {
                setResults({ error: 'Please enter some text to analyze.' });
                resolve({ error: 'Please enter some text to analyze.' });
                return;
            }

            setIsAnalyzing(true);

            // Simulate async processing
            setTimeout(() => {
                const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
                let directMatches = 0;
                let paraphrasedMatches = 0;
                const analyzedSentences = [];

                sentences.forEach(sentence => {
                    let bestMatch = { score: 0, source: null, type: 'original' };

                    // Check for direct matches first
                    const isDirectMatch = Object.values(sourceDocuments).some(
                        src => src.trim() === sentence.trim()
                    );

                    if (isDirectMatch) {
                        const sourceName = Object.keys(sourceDocuments).find(
                            key => sourceDocuments[key].trim() === sentence.trim()
                        );
                        bestMatch = { score: 1.0, source: sourceName, type: 'direct' };
                        directMatches++;
                    } else {
                        // Check for paraphrased matches
                        for (const [sourceName, sourceText] of Object.entries(sourceDocuments)) {
                            const score = simpleTextSimilarity(sentence, sourceText);
                            if (score > bestMatch.score) {
                                bestMatch = { score, source: sourceName, type: 'paraphrased' };
                            }
                        }

                        // Categorize based on similarity score
                        if (bestMatch.score > 0.95) {
                            bestMatch.type = 'direct';
                            directMatches++;
                        } else if (bestMatch.score > 0.4) {
                            bestMatch.type = 'paraphrased';
                            paraphrasedMatches++;
                        } else {
                            bestMatch.type = 'original';
                        }
                    }

                    analyzedSentences.push({ text: sentence, match: bestMatch });
                });

                const totalSentences = sentences.length;
                const originalCount = totalSentences - directMatches - paraphrasedMatches;

                const analysisResults = {
                    sentences: analyzedSentences,
                    stats: {
                        total: totalSentences,
                        original: originalCount,
                        paraphrased: paraphrasedMatches,
                        direct: directMatches
                    }
                };

                setResults(analysisResults);
                setIsAnalyzing(false);
                resolve(analysisResults);
            }, 1000);
        });
    };

    return {
        analyze,
        isAnalyzing,
        results
    };
};

export default useTextAnalysis;
