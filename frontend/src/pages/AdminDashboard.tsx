import { useState, useEffect } from 'react';
import apiClient from '../utils/axiosConfig';

import Navbar from '../components/Navbar';
import StatsOverview from '../components/StatsOverview';
import UserPermissionManager from '../components/UserPermissionManager';
import BookingReportTable from '../components/BookingReportTable';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    apiClient.get('/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          alert('กรุณาเข้าสู่ระบบ');
          window.location.href = '/';
        } else if (err.response?.status === 403) {
          alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
          window.location.href = '/';
        } else {
          console.error(err);
          const errorMessage = err.response?.data?.message || 'ไม่สามารถดึงข้อมูลสถิติได้';
          alert(errorMessage);
        }
      });
  }, []);

  return (
    <div className="pt-20">
      <Navbar />
      <div className="p-6 space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <StatsOverview stats={stats} />
        <UserPermissionManager />
        <BookingReportTable />
      </div>
    </div>
  );
}
