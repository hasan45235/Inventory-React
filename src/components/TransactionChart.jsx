import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { format, subDays } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Canvas gradient factory
const createGradient = (ctx, area, color1, color2) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
};

const TransactionChart = (props) => {
  const { transactions } = props;

  const labels = [...Array(7)].map((_, i) =>
    format(subDays(new Date(), 6 - i), "MMM d")
  );

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
        label: "Stock-Out",
        data: dataOut,
        backgroundColor: (ctx) => {
          const area = ctx.chart.chartArea;
          if (!area) return "rgba(245,158,11,0.6)";
          return createGradient(
            ctx.chart.ctx,
            area,
            "rgba(245,158,11,0.3)",
            "rgba(239,68,68,0.7)"
          );
        },
        borderColor: "rgba(245,158,11,0.9)",
        borderWidth: 1.5,
        borderRadius: 6,
        maxBarThickness: 32,
        hoverBackgroundColor: "rgba(239,68,68,0.9)",
      },
      {
        label: "Stock-In",
        data: dataIn,
        backgroundColor: (ctx) => {
          const area = ctx.chart.chartArea;
          if (!area) return "rgba(20,184,166,0.6)";
          return createGradient(
            ctx.chart.ctx,
            area,
            "rgba(20,184,166,0.3)",
            "rgba(20,184,166,0.7)"
          );
        },
        borderColor: "rgba(20,184,166,0.9)",
        borderWidth: 1.5,
        borderRadius: 6,
        maxBarThickness: 32,
        hoverBackgroundColor: "rgba(20,184,166,0.9)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: "rgba(255,255,255,0.7)",
          font: { size: 13, weight: "600", family: "'Inter', sans-serif" },
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "rgba(255,255,255,0.8)",
        borderColor: "rgba(245,158,11,0.3)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { weight: "700", size: 14 },
        bodyFont: { size: 13 },
        displayColors: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgba(255,255,255,0.45)",
          font: { size: 12, weight: "500" },
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
        },
        grid: { color: "rgba(255,255,255,0.04)" },
        border: { color: "rgba(255,255,255,0.08)" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgba(255,255,255,0.45)",
          font: { size: 12, weight: "500" },
          stepSize: 1,
          callback: (val) => (Number.isInteger(val) ? val : ""),
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
          drawBorder: false,
        },
        border: { display: false },
      },
    },
  };

  return (
    <Card
      sx={{
        background:
          "linear-gradient(145deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 4,
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
        width: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "rgba(245,158,11,0.15)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#f1f5f9",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            Transaction Activity
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.35)",
              bgcolor: "rgba(255,255,255,0.04)",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Last 7 days
          </Typography>
        </Box>
        <Box sx={{ height: 340, width: "100%" }}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
