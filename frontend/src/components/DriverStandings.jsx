import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const DriverStandings = ({ driverName }) => {
  const [standingsData, setStandingsData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available years for the driver
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await axios.get(
          `api/driveryears/${driverName}`
        );
        // const response = await axios.get(
        //   `http://localhost:5000/api/driveryears/${driverName}`
        // );
        console.log('Available Years Response:', response.data); // Debugging
        setAvailableYears(response.data.available_years);
        if (response.data.available_years.length > 0) {
          setSelectedYear(response.data.available_years[0]); // Set the first year as default
        }
      } catch (error) {
        console.error('Error fetching available years:', error);
        setError('Failed to fetch available years');
      }
    };

    fetchAvailableYears();
  }, [driverName]);

  // Fetch standings data for the selected year
  useEffect(() => {
    if (selectedYear) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        setStandingsData([]); // Reset standings data when a new year is selected
        try {
          const response = await axios.get(
            `/api/driverstandings/${driverName}/${selectedYear}`
          );
          // const response = await axios.get(
          //   `http://localhost:5000/api/driverstandings/${driverName}/${selectedYear}`
          // );
          console.log('Standings Data Response:', response.data); // Debugging
          setStandingsData(response.data.standings_data || []); // Ensure it's an array
        } catch (error) {
          console.error('Error fetching driver standings:', error);
          setError('Failed to fetch driver standings');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [driverName, selectedYear]);


const processData = () => {
    if (!standingsData || standingsData.length === 0) {
      console.log('No standings data available'); // Debugging
      return [];
    }
  
    console.log('Processing standings data:', standingsData); // Debugging
  
    const rounds = [...new Set(standingsData.map((item) => item.round))]; // Unique rounds
    const drivers = [...new Set(standingsData.map((item) => item.driver))]; // Unique drivers
  
    const dataByRound = rounds.map((round) => {
      const roundData = { round };
      drivers.forEach((driver) => {
        const driverEntry = standingsData.find(
          (item) => item.driver === driver && item.round === round
        );
        // Replace NaN with 0 or null
        roundData[driver] = driverEntry ? (isNaN(driverEntry.points_standings) ? 0 : driverEntry.points_standings) : null;
      });
      return roundData;
    });
  
    console.log('Processed chart data:', dataByRound); // Debugging
    return dataByRound;
  };

  const chartData = processData();

  // Generate unique colors for each driver
  const getLineColor = (driver) => (driver === driverName ? '#FF6384' : '#CCCCCC');

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {driverName}'s Standings ({selectedYear})
      </h2>
      <div className="mb-4">
        <label htmlFor="year-select" className="mr-2">Select Season:</label>
        <select
          id="year-select"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="round"
            name="Round"
            label={{ value: 'Round', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            name="Points"
            label={{ value: 'Points', angle: -90, position: 'insideLeft', offset: 10 }}
          />
          <Tooltip />
          <Legend />
          {[...new Set(standingsData.map((item) => item.driver))].map((driver) => (
            <Line
              key={driver}
              type="monotone"
              dataKey={driver}
              stroke={getLineColor(driver)}
              strokeWidth={driver === driverName ? 3 : 2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DriverStandings; 