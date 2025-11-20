import React, { lazy, Suspense } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import HeroSection from '../components/home/sections/HeroSection';
import ProblemSection from '../components/home/sections/ProblemSection';
import SolutionSection from '../components/home/sections/SolutionSection';
import homePageStyles from '../styles/homePageStyles';

// Lazy load the heavy DemoSection component (contains Chart.js and analysis logic)
const DemoSection = lazy(() => import('../components/home/sections/DemoSection'));

/**
 * Home Page - Refactored to use modular components
 * Uses lazy loading for performance optimization
 */
const Home = () => {
    return (
        <ErrorBoundary>
            {/* Inject styles */}
            <style>{homePageStyles}</style>

            {/* Hero Section */}
            <HeroSection />

            {/* Problem Section */}
            <ProblemSection />

            {/* Solution/Process Section */}
            <SolutionSection />

            {/* Demo Section - Lazy Loaded */}
            <Suspense 
                fallback={
                    <div className="py-20 bg-white flex items-center justify-center">
                        <div className="text-center">
                            <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-gray-600 font-semibold">Loading interactive demo...</p>
                        </div>
                    </div>
                }
            >
                <DemoSection />
            </Suspense>
        </ErrorBoundary>
    );
};

export default Home;
