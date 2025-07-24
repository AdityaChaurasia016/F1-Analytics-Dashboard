import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CompareDriver = () => {
  const [data, setData] = useState([]);
  const [driver1, setDriver1] = useState('hamilton');
  const [driver2, setDriver2] = useState('vettel');
  const [year, setYear] = useState(2018);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/compare_drivers/${driver1}/${driver2}/${year}`);
      // const response = await axios.get(`http://localhost:5000/api/compare_drivers/${driver1}/${driver2}/${year}`);
      if (Array.isArray(response.data.combined_standings)) {
        setData(response.data.combined_standings);
      } else {
        setError('Invalid data format received from the server.');
        setData([]);
      }
    } catch (err) {
      setError('Failed to fetch data. Please check the driver names and year.');
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Compare Drivers</h2>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Driver 1:</label>
          <input
            type="text"
            value={driver1}
            onChange={(e) => setDriver1(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Driver 2:</label>
          <input
            type="text"
            value={driver2}
            onChange={(e) => setDriver2(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={fetchData}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-md transition duration-200"
        >
          Compare
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && Array.isArray(data) && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -10 }} />
            <YAxis label={{ value: 'Standings', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="driver1_standings"
              stroke="#8884d8"
              name={driver1.toUpperCase()}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="driver2_standings"
              stroke="#82ca9d"
              name={driver2.toUpperCase()}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        !loading && !error && <p className="text-gray-500">No data available for the selected drivers and year.</p>
      )}
    </div>
  );
};

export default CompareDriver;
