import React from "react";
import {  Chart as ChartJS,  CategoryScale,  LinearScale,  BarElement,  Title,  Tooltip,  Legend,} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent } from "@mui/material";
import { format, subDays } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransactionChart = (props) => {
  const { transactions } = props;

  // Last 7 days labels
  const labels = [...Array(7)]
    .map((_, i) => format(subDays(new Date(), 6 - i), "MMM d"));

  // Count transactions per day
  const dataOut = labels.map(
    (day) =>
      transactions.filter(
        (t) => format(new Date(t.date), "MMM d") === day && t.type === "out"
      ).length
  );
  const dataIn = labels.map(
    (day) =>
      transactions.filter(
        (t) => format(new Date(t.date), "MMM d") === day && t.type === "in"
      ).length
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Stock-Out (out)",
        data: dataOut,
        backgroundColor: "rgba(25, 118, 210, 0.7)", // MUI primary
        borderRadius: 8,
        maxBarThickness: 30,
      },
      {
        label: "Stock-In (in)",
        data: dataIn,
        backgroundColor: "rgba(76, 175, 80, 0.7)", // MUI success
        borderRadius: 8,
        maxBarThickness: 30,        
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
          font: { size: 14, weight: "bold" },
        },
      },
      title: {
        display: true,
        text: "Transactions (Last 7 Days)",
        color: "#1976d2",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      x: {
        ticks: { 
          color: "#555",
          autoSkip: false, 
          maxRotation: 45, 
          minRotation: 30,  },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#555" },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, width: "100%",  }}>
      <CardContent style={{
            height: 350,
            width: "100%",
        }}>
        <Bar data={data} options={options} />
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
