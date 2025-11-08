import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the components Chart.js needs
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ direct, paraphrased, original }) => {
  const data = {
    labels: ['Direct Match', 'Paraphrased', 'Original'],
    datasets: [
      {
        label: 'Content Analysis',
        // Data order must match labels
        data: [direct, paraphrased, original],
        backgroundColor: [
          '#EF4444', // Red-500 for Direct
          '#F59E0B', // Yellow-500 for Paraphrased
          '#10B981', // Green-500 for Original
        ],
        borderColor: [
          '#EF4444',
          '#F59E0B',
          '#10B981',
        ],
        borderWidth: 1,
        // This removes the small white lines between segments
        spacing: 0, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // This makes it a doughnut chart
    cutout: '80%', 
    plugins: {
      // Hide the default legend and tooltips
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;