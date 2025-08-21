import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function PriceHistoryChart({ coin }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/api/history`, {
          params: { coin, limit: 30 }
        });
        setHistory(res.data || []);
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    }
    load();
  }, [coin]);

  const labels = history.map(entry => new Date(entry.timestamp).toLocaleTimeString());
  const prices = history.map(entry => entry.price);

  const data = {
    labels,
    datasets: [
      {
        label: `${coin} Price`,
        data: prices,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: `${coin} Price History` }
    }
  };

  return (
    <div style={{ background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Line data={data} options={options} />
    </div>
  );
}
