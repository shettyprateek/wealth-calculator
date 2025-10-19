"use client";
import { ChangeEvent, useEffect, useState } from "react";
import PieChart from "./components/PieChart";
import Image from "next/image";

export default function Home() {
  type FinancialItem = { name: string; value: string };
  type FinancialCategory = {
    category: "Assets" | "Liabilities";
    items: FinancialItem[];
  };

  const financialData: FinancialCategory[] = [
    {
      category: "Assets",
      items: [
        { name: "Bank", value: "" },
        { name: "Stocks/Mutual Funds", value: "" },
        { name: "PF", value: "" },
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

  // Client-side state
  const [assets, setAssets] = useState<FinancialItem[]>([]);
  const [liabilities, setLiabilities] = useState<FinancialItem[]>([]);
  const [netWorth, setNetWorth] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage only on client
  useEffect(() => {
    const storedAssets = localStorage.getItem("assets");
    const storedLiabilities = localStorage.getItem("liabilities");
    const storedNetWorth = localStorage.getItem("netWorth");

    setAssets(storedAssets ? JSON.parse(storedAssets) : financialData[0].items);
    setLiabilities(
      storedLiabilities ? JSON.parse(storedLiabilities) : financialData[1].items
    );
    setNetWorth(storedNetWorth ? Number(storedNetWorth.replace(/,/g, "")) : 0);

    setMounted(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("assets", JSON.stringify(assets));
    localStorage.setItem("liabilities", JSON.stringify(liabilities));
    localStorage.setItem("netWorth", netWorth.toLocaleString("en-IN"));
  }, [assets, liabilities, netWorth, mounted]);

  const formatNumber = (value: string) => {
    const raw = value.replace(/,/g, "");
    if (raw === "" || isNaN(Number(raw))) return "";
    return Number(raw).toLocaleString("en-IN");
  };

  const calculateWealth = (
    updatedAssets = assets,
    updatedLiabilities = liabilities
  ) => {
    const totalAssets = updatedAssets.reduce(
      (acc, item) => acc + Number(item.value.replace(/,/g, "") || 0),
      0
    );
    const totalLiabilities = updatedLiabilities.reduce(
      (acc, item) => acc + Number(item.value.replace(/,/g, "") || 0),
      0
    );
    setNetWorth(totalAssets - totalLiabilities);
  };

  const handleAssetChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const updated = [...assets];
    updated[index].value = formatNumber(e.target.value);
    setAssets(updated);
    calculateWealth(updated, liabilities);
  };

  const handleLiabilityChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const updated = [...liabilities];
    updated[index].value = formatNumber(e.target.value);
    setLiabilities(updated);
    calculateWealth(assets, updated);
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    setAssets(financialData[0].items);
    setLiabilities(financialData[1].items);
    setNetWorth(0);
  };

  if (!mounted) return null;

  return (
    <main className="flex flex-col items-center justify-center mt-4 mb-8 space-y-8 px-2">
      {/* Forms first */}
      <div className="flex items-center justify-center">
        <Image
          className="dark:invert"
          src="/rupee.png"
          alt="Rupee logo"
          width={32}
          height={32}
          priority
        />
        <h1 className="ml-4 text-4xl font-bold text-green-600">
          Wealth Calculator
        </h1>
      </div>

      <div className="flex flex-row gap-2 justify-center w-full flex-wrap">
        {/* Assets Form */}
        <div className="flex flex-col w-40 sm:w-64 md:w-[336px] gap-4">
          <div className="flex flex-col border border-green-600 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h1 className="text-xl font-bold text-green-600 mb-4">Assets 💰</h1>
            {assets.map((asset, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-1 border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  {asset.name}
                </label>
                <input
                  type="text"
                  value={asset.value}
                  onChange={(e) => handleAssetChange(idx, e)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 focus:ring-2 focus:ring-green-400 focus:outline-none bg-gray-50 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter amount"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Liabilities Form */}
        <div className="flex flex-col w-40 sm:w-64 md:w-[336px] gap-4">
          <div className="flex flex-col border border-red-600 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h1 className="text-xl font-bold text-red-600 mb-4">
              Liabilities 💳
            </h1>
            {liabilities.map((liability, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-1 border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  {liability.name}
                </label>
                <input
                  type="text"
                  value={liability.value}
                  onChange={(e) => handleLiabilityChange(idx, e)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 focus:ring-2 focus:ring-red-400 focus:outline-none bg-gray-50 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter amount"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts side by side */}
      <div className="flex flex-row gap-2 w-full justify-center flex-wrap">
        <PieChart title="Assets 💰" data={assets} colorScheme="green" />
        <PieChart title="Liabilities 💳" data={liabilities} colorScheme="red" />
      </div>

      {/* Net Worth and Reset Button */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-green-600">Your Wealth</h1>
        <h1 className="text-4xl pt-4 font-bold text-green-600">
          ₹{netWorth.toLocaleString("en-IN")}
        </h1>
        <button
          onClick={clearLocalStorage}
          className="mt-6 px-6 py-2 rounded-xl border-2 border-green-600 text-green-700 dark:text-green-300 font-medium bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all shadow-sm"
        >
          🔄 Reset Data
        </button>
      </div>
    </main>
  );
}
