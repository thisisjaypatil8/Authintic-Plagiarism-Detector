import React, { useState } from 'react';

const AnimatedName = ({ 
    className = '', 
    style = {}, 
    tag: Tag = 'strong', 
    name = 'Jay Patil', 
    animColor = '#0ABAB5', 
    flashColor = '#00f0ff',
    triggered,
}) => {
    const [selfHovered, setSelfHovered] = useState(false);
    const isActive = triggered !== undefined ? triggered : selfHovered;

    const keyframesId = `sideSlide_${animColor.replace(/[^a-zA-Z0-9]/g, '')}`;
    const keyframesCSS = `
        @keyframes ${keyframesId} {
            0% { transform: translate(-300px, 0) scale(0); opacity: 0; color: ${animColor}; }
            60% { transform: translate(20px, 0) scale(1); opacity: 1; color: ${animColor}; }
            80% { transform: translate(20px, 0) scale(1); color: ${animColor}; }
            99% { transform: translate(0) scale(1.2); color: ${flashColor}; }
            100% { transform: translate(0) scale(1); opacity: 1; color: ${animColor}; }
        }
    `;

    return (
        <Tag
            className={`animated-name-wrapper inline-block cursor-pointer ${className}`}
            style={style}
            onMouseEnter={triggered === undefined ? () => setSelfHovered(true) : undefined}
            onMouseLeave={triggered === undefined ? () => setSelfHovered(false) : undefined}
        >
            <style>{keyframesCSS}</style>
            {name.split('').map((char, i) => (
                <span
                    key={`${char}-${i}-${isActive}`}
                    className="inline-block"
                    style={
                        isActive
                            ? {
                                animation: `${keyframesId} 0.5s ${i * 0.05}s forwards`,
                                opacity: 0,
                                transform: 'translate(-300px, 0) scale(0)',
                            }
                            : { opacity: 1, transform: 'none' }
                    }
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </Tag>
    );
};

export default AnimatedName;
