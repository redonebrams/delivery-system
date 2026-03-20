import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Commandes par type",
        data: Object.values(data),
        backgroundColor: "#3498db",
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default BarChart;
