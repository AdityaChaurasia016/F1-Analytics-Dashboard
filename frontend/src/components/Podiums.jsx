import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Podiums = ({ driver }) => {
  const [podiumsData, setPodiumsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch podium data by season for the given driver
  useEffect(() => {
    const fetchPodiumsData = async () => {
      try {
        // const response = await fetch(`/driverpodiumsbyseason/${driver}`);
        const response = await fetch(`/api/driverpodiumsbyseason/${driver}`);
        // const response = await fetch(`http://localhost:5000/api/driverpodiumsbyseason/${driver}`);
        if (!response.ok) {
          throw new Error('Failed to fetch podiums data');
        }
        const data = await response.json();
        // Transform data into Recharts-compatible format
        const formattedData = data.podiums_by_season.map(item => ({
          season: item.year.toString(),
          podiums: item.podiums,
        }));
        setPodiumsData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPodiumsData();
  }, [driver]);

  // Display loading state
  if (loading) {
    return <div>Loading podiums data...</div>;
  }

  // Display error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Podiums by Season for {driver}</h2>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={podiumsData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" label={{ value: 'Season', position: 'insideBottom', offset: -10 }} />
            <YAxis label={{ value: 'Number of Podiums', angle: -90, position: 'insideLeft', offset: 10 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="podiums" fill="#4bc0c0" name="Podiums" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Podiums;