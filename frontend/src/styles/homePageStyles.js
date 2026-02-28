
const homePageStyles = `
    .highlight-tooltip {
        position: relative;
        cursor: help;
    }

    .highlight-tooltip::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 100;
    }

    .highlight-tooltip:hover::after {
        opacity: 1;
    }

    /* 4-color highlight system */
    .highlight-direct {
        background: linear-gradient(120deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.25) 100%);
        border-bottom: 3px solid rgba(239, 68, 68, 0.8);
        padding: 2px 4px;
        border-radius: 4px;
    }

    .highlight-paraphrased {
        background: linear-gradient(120deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.25) 100%);
        border-bottom: 3px solid rgba(251, 191, 36, 0.8);
        padding: 2px 4px;
        border-radius: 4px;
    }

    .highlight-ai-paraphrased {
        background: linear-gradient(120deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.25) 100%);
        border-bottom: 3px solid rgba(139, 92, 246, 0.8);
        padding: 2px 4px;
        border-radius: 4px;
    }

    .highlight-original {
        background: rgba(16, 185, 129, 0.08);
        padding: 2px 4px;
        border-radius: 4px;
    }

    /* Smooth transitions for highlights */
    .highlight-direct, .highlight-paraphrased, .highlight-ai-paraphrased {
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .highlight-direct:hover, .highlight-paraphrased:hover, .highlight-ai-paraphrased:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
`;

export default homePageStyles;
