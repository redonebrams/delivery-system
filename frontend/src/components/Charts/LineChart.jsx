import React from "react";
import { Line } from "react-chartjs-2";
import "../../utils/chartSetup";

const LineChart = ({ data = [] }) => {
  const chartData = {
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

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
