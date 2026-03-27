import React from "react";
import { Line } from "react-chartjs-2";
import "../../utils/chartSetup";

const LineChart = ({ data = [] }) => {
  // Handle both array format and Chart.js object format
  let chartData;
  
  if (Array.isArray(data) && data.length > 0 && data[0].date) {
    // Array format: [{date: '...', count: ...}, ...]
    chartData = {
      labels: data.map((d) => d.date),
      datasets: [
        {
          label: "Commandes",
          data: data.map((d) => d.count),
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  } else if (data && typeof data === 'object' && data.labels && data.datasets) {
    // Chart.js object format: {labels: [...], datasets: [...]}
    chartData = data;
  } else {
    // Fallback for empty or invalid data
    chartData = {
      labels: [],
      datasets: [
        {
          label: "Commandes",
          data: [],
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
