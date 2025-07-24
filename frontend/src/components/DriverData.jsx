import React, { useEffect, useState } from 'react';

const DriverData = ({ driver }) => {
  const [driverStats, setDriverStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (driver) {
      // Fetch driver stats from the backend
      setLoading(true);
      fetch(`/api/driverstats/${driver}`)
      // fetch(`http://localhost:5000/api/driverstats/${driver}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch driver stats');
          }
          return response.json();
        })
        .then((data) => {
          setDriverStats(data);
          setError(null);
        })
        .catch((error) => {
          console.error('Error fetching driver stats:', error);
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [driver]);

  if (!driver) {
    return (
      <div className="p-4 bg-gray-800 text-gray-300 rounded-lg">
        Please select a driver from the sidebar.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 bg-gray-800 text-gray-300 rounded-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-800 text-red-200 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (!driverStats) {
    return (
      <div className="p-4 bg-gray-800 text-gray-300 rounded-lg">
        No data available for this driver.
      </div>
    );
  }

  return (
    <div className="mt-4 p-6 bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <h2 className="text-2xl font-bold text-red-600 mb-6">
        {driver.toUpperCase()}'s Stats
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Laps */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Laps</p>
          <p className="text-xl font-semibold text-white">
            {driverStats.total_laps}
          </p>
        </div>

        {/* Total Wins */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Wins</p>
          <p className="text-xl font-semibold text-white">
            {driverStats.total_wins}
          </p>
        </div>

        {/* Total Podiums */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Podiums</p>
          <p className="text-xl font-semibold text-white">
            {driverStats.total_podiums}
          </p>
        </div>

        {/* Total Fastest Laps */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Fastest Laps</p>
          <p className="text-xl font-semibold text-white">
            {driverStats.total_fastest_laps}
          </p>
        </div>

        {/* Total Pole Positions */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Pole Positions</p>
          <p className="text-xl font-semibold text-white">
            {driverStats.total_pole_positions}
          </p>
        </div>

        {/* Average Qualifying Position */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Avg Qualifying Position</p>
          <p className="text-xl font-semibold text-white">
            {driverStats.avg_qualifying_pos}
          </p>
        </div>

        {/* Best Position */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Best Position</p>
          <p className="text-xl font-semibold text-white">
            {driverStats.best_position}
          </p>
        </div>

        {/* Most Successful Track */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Most Successful Track</p>
          <p className="text-xl font-semibold text-white">
            {driverStats.most_successful_track}
          </p>
        </div>

        {/* Total Races */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Races</p>
          <p className="text-xl font-semibold text-white">
            {driverStats.total_races}
          </p>
        </div>

        {/* Total Points */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Points</p>
          <p className="text-xl font-semibold text-white">
            {driverStats.total_points}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverData;