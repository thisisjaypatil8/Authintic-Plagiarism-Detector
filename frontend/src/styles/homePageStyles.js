/**
 * Centralized styles for Home page components
 * Extracted from inline styles in Home.js
 */

export const homePageStyles = `
    .highlight {
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 3px 6px;
        border-radius: 4px;
        margin: 0 2px;
        display: inline-block;
    }
    .highlight-direct {
        background: linear-gradient(120deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.25) 100%);
        border-bottom: 3px solid rgba(239, 68, 68, 0.8);
        box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);
    }
    .highlight-paraphrased {
        background: linear-gradient(120deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.25) 100%);
        border-bottom: 3px solid rgba(251, 191, 36, 0.8);
        box-shadow: 0 2px 4px rgba(251, 191, 36, 0.1);
    }
    .highlight:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .highlight-direct:hover {
        background: linear-gradient(120deg, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.35) 100%);
    }
    .highlight-paraphrased:hover {
        background: linear-gradient(120deg, rgba(251, 191, 36, 0.25) 0%, rgba(251, 191, 36, 0.35) 100%);
    }
    .tooltip {
        position: absolute;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%);
        color: white;
        padding: 14px 18px;
        border-radius: 10px;
        font-size: 13px;
        pointer-events: none;
        transform: translate(-50%, -120%);
        opacity: 0;
        transition: opacity 0.25s ease;
        z-index: 1000;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        backdrop-filter: blur(10px);
        max-width: 280px;
    }
    .tooltip.visible {
        opacity: 1;
    }
    .tooltip::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid rgba(0, 0, 0, 0.95);
    }
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    .float-animation {
        animation: float 3s ease-in-out infinite;
    }
    @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
    .animated-gradient {
        background-size: 200% 200%;
        animation: gradient-shift 8s ease infinite;
    }
`;

export default homePageStyles;
