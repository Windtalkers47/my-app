import { useEffect, useState } from 'react';
import axios from 'axios';



const StatsOverview = ({ stats }: { stats: any }) => {
  const statItems = [
    { label: 'จำนวนผู้ใช้', value: stats.totalUsers, icon: '👥' },
    { label: 'สินค้า', value: stats.totalProducts, icon: '☕' },
    { label: 'การจอง', value: stats.totalBookings, icon: '📅' },
    { label: 'รายได้', value: `฿${stats.totalRevenue}`, icon: '💰' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <div 
          key={index}
          className="cafe-card p-6 text-center fade-in transform transition-all duration-300 hover:scale-105"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="text-4xl mb-4">{item.icon}</div>
          <h3 className="cafe-label mb-2">{item.label}</h3>
          <p className="text-3xl font-bold text-cafe-primary">{item.value || 0}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
