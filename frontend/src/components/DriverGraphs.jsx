import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DriverGraphs = ({ driver }) => {
  const [pointsData, setPointsData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available years for the driver
  useEffect(() => {
    if (driver) {
      fetch(`/api/driveryears/${driver}`)
      // fetch(`http://localhost:5000/api/driveryears/${driver}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch available years');
          }
          return response.json();
        })
        .then((data) => {
          setAvailableYears(data.available_years);
          setSelectedYear(data.available_years[0]); // Set default to latest year
          setError(null);
        })
        .catch((error) => {
          console.error('Error fetching available years:', error);
          setError(error.message);
        });
    }
  }, [driver]);

  // Fetch points data for the selected year
  useEffect(() => {
    if (driver && selectedYear) {
      setLoading(true);
      fetch(`http://localhost:5000/api/driverpoints/${driver}/${selectedYear}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch points data');
          }
          return response.json();
        })
        .then((data) => {
          setPointsData(data.points_by_round);
          setError(null);
        })
        .catch((error) => {
          console.error('Error fetching points data:', error);
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [driver, selectedYear]);

  if (!driver) {
    return <div>Please select a driver from the sidebar.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!pointsData || pointsData.length === 0) {
    return <div>No data available for this driver.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Year Selection Dropdown */}
      <div>
        <label htmlFor="year-select" className="mr-2">Select Year:</label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="p-2 border border-gray-300 rounded"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Chart: Points Over Season */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Points Over Season ({selectedYear})
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={pointsData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            style={{ backgroundColor: '#f4f4f4', borderRadius: '8px' }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="round" stroke="#333" />
            <YAxis stroke="#333" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px',
                color: '#333',
              }}
            />
            <Legend
              wrapperStyle={{
                color: '#333',
              }}
            />
            <Line
              type="monotone"
              dataKey="points"
              stroke="#1f77b4"
              strokeWidth={2}
              dot={{ r: 5, fill: '#1f77b4' }}
              activeDot={{ r: 8, fill: '#1f77b4' }}
              name="Points"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DriverGraphs;