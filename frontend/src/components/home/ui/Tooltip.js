import React from 'react';

/**
 * Reusable Tooltip component
 * @param {boolean} visible - Whether tooltip is visible
 * @param {string} content - HTML content to display
 * @param {number} x - X position
 * @param {number} y - Y position
 */
const Tooltip = ({ visible, content, x, y }) => {
    return (
        <div 
            id="tooltip" 
            className={`tooltip ${visible ? 'visible' : ''}`} 
            style={{ left: x, top: y }} 
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default Tooltip;
