import React from "react";
import PriceHistoryChart from "./PriceHistoryChart";
import PriceDeviationChart from "./PriceDeviationChart";

const Dashboard = ({ coin, history, deviation }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">Crypto Dashboard</h1>

      {/* Grid for Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Price History */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md flex justify-center">
          <PriceHistoryChart coin={coin} history={history} />
        </div>

        {/* Price Deviation */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md flex justify-center">
          <PriceDeviationChart coin={coin} deviation={deviation} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
