"use client";
import { ChangeEvent, useEffect, useState } from "react";
import PieChart from "./components/PieChart";

export default function Home() {
  type FinancialItem = {
    name: string;
    value: string;
  };

  type FinancialCategory = {
    category: "Assets" | "Liabilities";
    items: FinancialItem[];
  };

  const financialData: FinancialCategory[] = [
    {
      category: "Assets",
      items: [
        { name: "Cash", value: "" },
        { name: "Stocks", value: "" },
        { name: "Mutual Funds", value: "" },
        { name: "Gold/Silver", value: "" },
        { name: "Real Estate", value: "" },
      ],
    },
    {
      category: "Liabilities",
      items: [
        { name: "Credit Card", value: "" },
        { name: "Home Loan", value: "" },
        { name: "Vehicle Loan", value: "" },
      ],
    },
  ];

  const [netWorth, setNetWorth] = useState(0);
  const [assets, setAssets] = useState(financialData[0].items);
  const [liabilities, setLiabilities] = useState(financialData[1].items);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // mark client mount
  }, []);

  const formatNumber = (value: string) => {
    const raw = value.replace(/,/g, "");
    if (raw === "" || isNaN(Number(raw))) return "";
    return Number(raw).toLocaleString("en-IN"); // Indian format (1,00,000)
  };

  const handleAssetChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatNumber(event.target.value);
    const updated = [...assets];
    updated[index].value = formatted;
    setAssets(updated);
    calculateWealth();
  };

  function handleLiabilityChange(
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ): void {
    const formatted = formatNumber(event.target.value);
    const updated = [...liabilities];
    updated[index].value = formatted;
    setLiabilities(updated);
    calculateWealth();
  }

  const calculateWealth = () => {
    const totalAssets = assets.reduce((acc, sum) => {
      const total = acc + Number(sum.value.replaceAll(",", ""));
      return total;
    }, 0);
    setTotalAssets(totalAssets);

    const totalLiabilities = liabilities.reduce((acc, sum) => {
      const total = acc + Number(sum.value.replaceAll(",", ""));
      return total;
    }, 0);

    setTotalLiabilities(totalLiabilities);
    const yourNetWorth = totalAssets - totalLiabilities;
    setNetWorth(yourNetWorth);
  };

  if (!mounted) return null;

  return (
    <main className="flex flex-col items-center justify-center my-4">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-semibold">Your Wealth</h1>
      </div>
      <div className="flex flex-col">
        <div className="p-2">
          <PieChart
            totalAssets={totalAssets}
            totalLiabilities={totalLiabilities}
            netWorth={netWorth}
          />
        </div>
      </div>
      <div className="flex m-4">
        <div className="flex mr-2 flex-col bg-white dark:bg-gray-800 p-6 border border-green-600 rounded-2xl shadow-lg w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Assets 💰</h1>

          {assets.map((asset, index) => (
            <div
              key={index}
              className="pt-4 text-lg flex flex-col gap-2 border-b border-gray-200 dark:border-gray-700 pb-4"
            >
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                {asset.name}
              </label>
              <input
                type="text"
                value={asset.value}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none bg-gray-50 dark:bg-gray-700 dark:text-white"
                onChange={(event) => handleAssetChange(index, event)}
                maxLength={12}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col border border-red-600 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Liabilities 💳
          </h1>

          {liabilities.map((liability, index) => (
            <div
              key={index}
              className="pt-4 text-lg flex flex-col gap-2 border-b border-gray-200 dark:border-gray-700 pb-4"
            >
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                {liability.name}
              </label>
              <input
                type="text"
                value={liability.value}
                onChange={(event) => handleLiabilityChange(index, event)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Enter amount"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
