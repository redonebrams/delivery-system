import React from "react";
import { Doughnut } from "react-chartjs-2";

const DonutChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: ["#3498db", "#27ae60", "#f39c12", "#e74c3c"],
      },
    ],
  };

  return <Doughnut data={chartData} />;
};

export default DonutChart;
