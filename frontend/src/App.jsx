import React, { useEffect, useState } from 'react';
import PriceHistoryChart from './components/PriceHistoryChart';
import PriceDeviationChart from './components/PriceDeviationChart';

export default function App() {
  const [coins] = useState(["bitcoin", "ethereum", "matic-network"]);
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [_data, setData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/api/history?coin=${selectedCoin}&limit=30`);
        if (!res.ok) throw new Error("Network response was not ok");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching data:", err);
        setData(null);
      }
    }
    fetchData();
  }, [selectedCoin]);

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h1 style={{ marginBottom: 20 }}>Crypto Dashboard</h1>
      
      {/* Coin Selector */}
      <select value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)} style={{ padding: 8, fontSize: 16, marginBottom: 20 }}>
        {coins.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Charts */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
        <div style={{ width: 500 }}>
          <PriceHistoryChart coin={selectedCoin} />
        </div>
        <div style={{ width: 500 }}>
          <PriceDeviationChart coin={selectedCoin} />
        </div>
      </div>
    </div>
  );
}
