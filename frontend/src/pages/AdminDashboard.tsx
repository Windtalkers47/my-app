import Navbar from '../components/Navbar';
import StatsOverview from '../components/StatsOverview';
import UserPermissionManager from '../components/UserPermissionManager';
import BookingReportTable from '../components/BookingReportTable';

export default function AdminDashboard() {
  return (
    <div className="pt-20">
      <Navbar />
      <div className="p-6 space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <StatsOverview />
        <UserPermissionManager />
        <BookingReportTable />
      </div>
    </div>
  );
}
