import React from 'react';
import { IconTarget, IconBrain, IconBolt, IconChart } from '../components/Icons';

/**
 * Features Data for About Page
 * Central location for feature highlights
 */
export const features = [
    { icon: <IconTarget className="w-6 h-6" />, title: "Precision Detection", desc: "Advanced algorithms catch even subtle similarities" },
    { icon: <IconBrain className="w-6 h-6" />, title: "AI-Powered Analysis", desc: "Deep learning models understand context and meaning" },
    { icon: <IconBolt className="w-6 h-6" />, title: "Real-time Results", desc: "Get instant feedback on your submissions" },
    { icon: <IconChart className="w-6 h-6" />, title: "Detailed Reports", desc: "Comprehensive breakdown of flagged content" }
];

export default features;
