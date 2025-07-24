import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const StartingPosition = ({ driver }) => {
  const [startingPositions, setStartingPositions] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [seasonYear, setSeasonYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableYears = async () => {
      if (!driver) return;

      try {
        const response = await fetch(`/api/driveryears/${driver}`);
        // const response = await fetch(`http://localhost:5000/api/driveryears/${driver}`);
        if (!response.ok) throw new Error('Failed to fetch available years');
        
        const data = await response.json();
        setAvailableYears(data.available_years);

        // Set the latest year as the default value
        if (data.available_years.length > 0) {
          setSeasonYear(data.available_years[0]);
        }
      } catch (err) {
        console.error('Error fetching available years:', err);
      }
    };

    fetchAvailableYears();
  }, [driver]);

  useEffect(() => {
    const fetchStartingPositions = async () => {
      if (!driver || !seasonYear) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/driverstartingpositions/${driver}/${seasonYear}`);
        // const response = await fetch(`http://localhost:5000/api/driverstartingpositions/${driver}/${seasonYear}`);
        if (!response.ok) throw new Error('Failed to fetch starting positions');
        
        const data = await response.json();
        setStartingPositions(data.starting_positions);
        setError(null);
      } catch (err) {
        console.error('Error fetching starting positions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStartingPositions();
  }, [driver, seasonYear]);

  if (!driver) {
    return <div>Please select a driver.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (startingPositions.length === 0) {
    return <div>No data available for this driver and season year.</div>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">{driver.toUpperCase()} - Starting Positions ({seasonYear})</h2>

      {availableYears.length > 0 && (
        <div className="mb-4">
          <label className="mr-2">Select Year:</label>
          <select
            className="p-2 border rounded"
            value={seasonYear}
            onChange={(e) => setSeasonYear(Number(e.target.value))}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={startingPositions}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="gp_name" />
          <YAxis reversed={true} /> {/* Lower starting position is better */}
          <Tooltip />
          <Line type="monotone" dataKey="grid" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StartingPosition;