import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement
);

export default function App() {
  const [stats, setStats] = useState([]);
  const [history, setHistory] = useState([]);
  const [deviation, setDeviation] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/stats")
      .then((res) => res.json())
      .then(setStats);

    fetch("http://localhost:3000/history")
      .then((res) => res.json())
      .then(setHistory);

    fetch("http://localhost:3000/deviation")
      .then((res) => res.json())
      .then(setDeviation);
  }, []);

  const historyData = {
    labels: history.map((h) =>
      new Date(h.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Price",
        data: history.map((h) => h.price),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.2,
      },
    ],
  };

  const deviationData = {
    labels: deviation.map((d) => d.coinId),
    datasets: [
      {
        label: "Deviation (%)",
        data: deviation.map((d) => d.deviation),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Crypto Dashboard</h1>

      <h2>Latest Stats</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        {stats.map((coin) => (
          <div
            key={coin.coinId}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h3>{coin.coinId}</h3>
            <p>Price: ${coin.price}</p>
            <p>Market Cap: ${coin.marketCap}</p>
            <p>24h Change: {coin.priceChange24h}%</p>
          </div>
        ))}
      </div>

      <h2>Price History</h2>
      <Line data={historyData} />

      <h2>Price Deviation</h2>
      <Bar data={deviationData} />
    </div>
  );
}
