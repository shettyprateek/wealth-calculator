"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Plugin,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
};

export default function PieChart({
  totalAssets,
  totalLiabilities,
  netWorth,
}: PieChartProps) {
  const data = {
    labels: ["Assets", "Liabilities"],
    datasets: [
      {
        data: netWorth ? [totalAssets, totalLiabilities] : [1, 1],
        backgroundColor: netWorth
          ? ["#16a34a", "#dc2626"]
          : ["#e5e7eb", "#e5e7eb"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  // Plugin to draw text in center
  const centerTextPlugin: Plugin = {
    id: "centerText",
    beforeDraw(chart) {
      const { width, height, ctx } = chart;
      ctx.save();
      const text = netWorth ? `₹${netWorth}` : "₹0";
      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "#111827"; // dark gray
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);
    },
  };

  const options = {
    responsive: true,
    cutout: "70%", // donut thickness
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label;
            const value = context.raw;
            if (!netWorth) return `${label}: ₹0`;
            return `${label}: ₹${value.toLocaleString("en-IN")}`;
          },
        },
      },
    },
  };

  return (
    <Doughnut
      key={netWorth}
      data={data}
      options={options}
      plugins={[centerTextPlugin]}
    />
  );
}
