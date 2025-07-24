import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Sidebar({ onSelectDriver }) {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('/api/drivers');
        // const response = await axios.get('http://localhost:5000/api/drivers');
        console.log('Fetched drivers:', response.data);
        if (Array.isArray(response.data)) {
          setDrivers(response.data);
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchDrivers();
  }, []);

  console.log(drivers);

  return (
    <div className="w-1/4 bg-black text-white p-4 overflow-y-auto border-r border-gray-700">
      {/* Sidebar Header */}
      <h2 className="text-xl font-bold text-white mb-6">Drivers</h2>

      {/* Driver List */}
      <div className="space-y-3">
        {drivers.map(({ driver, full_name }) => (
          <button
            key={driver}
            onClick={() => onSelectDriver(driver)}
            className="block w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-200 text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            {full_name}
          </button>
        ))}
      </div>
    </div>
  );
}