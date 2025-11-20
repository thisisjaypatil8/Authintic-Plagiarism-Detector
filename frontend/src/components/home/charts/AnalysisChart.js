import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

/**
 * Analysis Chart component using Chart.js
 * Displays a doughnut chart with analysis results
 * 
 * @param {Array} data - Array of [original, paraphrased, direct] counts
 * @param {string} legendText - Override text for legend
 */
const AnalysisChart = ({ data = [1, 0, 0], legendText = null }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const chartLegend = document.getElementById('chart-legend');
        
        // Destroy existing chart instance
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const [original, paraphrased, direct] = data;
        const total = original + paraphrased + direct;

        // If no data or override text provided, show message
        if (total === 0 || legendText) {
            if (chartLegend) {
                chartLegend.textContent = legendText || 'No data to display.';
            }
            return;
        }

        // Create new chart
        chartInstanceRef.current = new Chart(chartRef.current, {
            type: 'doughnut',
            data: {
                labels: ['Original', 'Paraphrased', 'Direct Match'],
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(79, 70, 229, 0.8)',
                        'rgba(251, 191, 36, 0.85)',
                        'rgba(239, 68, 68, 0.85)'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 800
                }
            }
        });

        // Calculate percentages
        const originalPercent = ((original / total) * 100).toFixed(1);
        const paraphrasedPercent = ((paraphrased / total) * 100).toFixed(1);
        const directPercent = ((direct / total) * 100).toFixed(1);

        // Update legend
        if (chartLegend) {
            chartLegend.innerHTML = `
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                        <div class="flex items-center gap-2">
                            <span class="w-4 h-4 rounded-full bg-indigo-600"></span>
                            <span class="font-semibold text-gray-700">Original</span>
                        </div>
                        <span class="text-xl font-bold text-indigo-600">${originalPercent}%</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                        <div class="flex items-center gap-2">
                            <span class="w-4 h-4 rounded-full bg-amber-400"></span>
                            <span class="font-semibold text-gray-700">Paraphrased</span>
                        </div>
                        <span class="text-xl font-bold text-amber-500">${paraphrasedPercent}%</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div class="flex items-center gap-2">
                            <span class="w-4 h-4 rounded-full bg-red-500"></span>
                            <span class="font-semibold text-gray-700">Direct Match</span>
                        </div>
                        <span class="text-xl font-bold text-red-500">${directPercent}%</span>
                    </div>
                </div>
            `;
        }

        // Cleanup on unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data, legendText]);

    return (
        <div className="chart-container mb-8" style={{ height: '280px' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default AnalysisChart;
