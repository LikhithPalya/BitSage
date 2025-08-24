import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PriceDeviationChart({ coin }) {
  const [deviation, setDeviation] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/api/deviation`, {
          params: { coin, limit: 30 }
        });
        setDeviation(res.data || []);
      } catch (err) {
        console.error('Failed to fetch deviation', err);
        setDeviation([]);
      }
    }
    load();
  }, [coin]);

  if (!Array.isArray(deviation)) {
    return <div style={{ padding: 12, background: '#fff', borderRadius: 8 }}>No deviation data</div>;
  }

  const labels = deviation.map(entry => new Date(entry.timestamp).toLocaleTimeString());
  const deviations = deviation.map(entry => entry.deviation);

  const data = {
    labels,
    datasets: [
      {
        label: `${coin} Price Deviation`,
        data: deviations,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: `${coin} Price Deviation` }
    }
  };

  return (
    <div style={{ background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
