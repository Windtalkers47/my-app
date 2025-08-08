import { useEffect, useState } from 'react';
import axios from 'axios';



const StatsOverview = ({ stats }: { stats: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl shadow p-4 shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">
        <h2 className="text-sm text-gray-500">จำนวนผู้ใช้</h2>
        <p className="text-2xl font-semibold">{stats.totalUsers}</p>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">
        <h2 className="text-sm text-gray-500">สินค้า</h2>
        <p className="text-2xl font-semibold">{stats.totalProducts}</p>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">
        <h2 className="text-sm text-gray-500">การจอง</h2>
        <p className="text-2xl font-semibold">{stats.totalBookings}</p>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">
        <h2 className="text-sm text-gray-500">รายได้</h2>
        <p className="text-2xl font-semibold">฿{stats.totalRevenue}</p>
      </div>
    </div>
  );
};

export default StatsOverview;
