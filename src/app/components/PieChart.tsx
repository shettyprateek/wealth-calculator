"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type FinancialItem = {
  name: string;
  value: string;
};

type PieChartProps = {
  title: string;
  data: FinancialItem[];
  colorScheme: "green" | "red";
};

export default function PieChart({ title, data, colorScheme }: PieChartProps) {
  const total = data.reduce(
    (acc, item) => acc + Number(item.value.replace(/,/g, "") || 0),
    0
  );

  const colors =
    colorScheme === "green"
      ? ["#15803d", "#22c55e", "#86efac", "#00e7fc", "#00a9ff"]
      : ["#b91c1c", "#f97316", "#facc15"];

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: total
          ? data.map((item) => Number(item.value.replace(/,/g, "")) || 0)
          : [1],
        backgroundColor: total ? colors : ["#e5e7eb"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"doughnut">) => {
            const label = context.label;
            const value = context.raw as number;
            if (!total) return `${label}: ₹0`;
            return `${label}: ₹${value.toLocaleString("en-IN")}`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <h2
        className={`text-xl font-bold mb-4 ${
          colorScheme === "green" ? "text-green-600" : "text-red-600"
        }`}
      >
        {title}
      </h2>

      {/* Responsive chart size */}
      <div className="sm:w-64 sm:h-64 md:w-72 md:h-72">
        <Doughnut data={chartData} options={options} />
      </div>

      <p className="mt-4 text-gray-700 dark:text-gray-300 font-semibold">
        Total: ₹{total.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
