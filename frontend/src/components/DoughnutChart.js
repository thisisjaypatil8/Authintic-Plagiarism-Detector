import React, { forwardRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the components Chart.js needs
ChartJS.register(ArcElement, Tooltip, Legend);

// We wrap the component in React.forwardRef
const DoughnutChart = forwardRef(({ direct, paraphrased, original }, ref) => {
  const data = {
    labels: ['Direct Match', 'Paraphrased', 'Original'],
    datasets: [
      {
        label: 'Content Analysis',
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
        spacing: 0, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%', 
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  // The 'ref' is passed to the Doughnut component
  return <Doughnut ref={ref} data={data} options={options} />;
});

export default DoughnutChart;