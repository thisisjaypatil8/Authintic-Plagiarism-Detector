import React, { forwardRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the components Chart.js needs
ChartJS.register(ArcElement, Tooltip, Legend);

// 4-segment doughnut: Direct Match, Paraphrased, AI-Paraphrased, Original
const DoughnutChart = forwardRef(({ direct, paraphrased, aiParaphrased = 0, original }, ref) => {
  const data = {
    labels: ['Direct Match', 'Paraphrased', 'AI-Paraphrased', 'Original'],
    datasets: [
      {
        label: 'Content Analysis',
        data: [direct, paraphrased, aiParaphrased, original],
        backgroundColor: [
          '#EF4444', // Red-500 for Direct Match
          '#F59E0B', // Yellow-500 for Paraphrased
          '#8B5CF6', // Purple-500 for AI-Paraphrased (BERT Layer 3)
          '#10B981', // Green-500 for Original
        ],
        borderColor: [
          '#DC2626',
          '#D97706',
          '#7C3AED',
          '#059669',
        ],
        borderWidth: 2,
        spacing: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          label: (context) => ` ${context.label}: ${context.parsed.toFixed(1)}%`,
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: 'easeOutQuart',
    },
  };

  return <Doughnut ref={ref} data={data} options={options} />;
});

export default DoughnutChart;