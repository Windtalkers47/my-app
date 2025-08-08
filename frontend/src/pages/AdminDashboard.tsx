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
    <div className="pt-16 bg-cafe-background min-h-screen">
      <Navbar />
      <section className="cafe-section">
        <div className="cafe-container max-w-6xl">
          <h1 className="cafe-heading mb-8">แผงควบคุมผู้ดูแลระบบ</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="cafe-card p-6 fade-in">
              <h2 className="cafe-subheading mb-6">สถิติโดยรวม</h2>
              <StatsOverview stats={stats} />
            </div>
            {/* <div className="cafe-card p-6 fade-in"> */}
              {/* <h2 className="cafe-subheading mb-6">จัดการสิทธิ์ผู้ใช้</h2> */}
              <UserPermissionManager />
            {/* </div> */}
            <div className="cafe-card p-6 fade-in lg:col-span-2">
              <h2 className="cafe-subheading mb-6">รายงานการจอง</h2>
              <BookingReportTable />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
