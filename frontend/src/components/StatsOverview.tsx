// src/components/StatsOverview.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';

const StatsOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl shadow p-4 shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">
        <h2 className="text-sm text-gray-500">Users</h2>
        <p className="text-2xl font-semibold">{stats.totalUsers}</p>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">
        <h2 className="text-sm text-gray-500">Products</h2>
        <p className="text-2xl font-semibold">{stats.totalProducts}</p>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">
        <h2 className="text-sm text-gray-500">Bookings</h2>
        <p className="text-2xl font-semibold">{stats.totalBookings}</p>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">
        <h2 className="text-sm text-gray-500">Revenue</h2>
        <p className="text-2xl font-semibold">฿{stats.totalRevenue}</p>
      </div>
    </div>
  );
};

export default StatsOverview;
