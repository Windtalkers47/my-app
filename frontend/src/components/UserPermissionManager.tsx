import { useState, useEffect } from 'react';
import apiClient from '../utils/axiosConfig';

type User = {
  user_id: number;
  user_name: string;
  user_email: string;
  role: string;
};

const roles = ['admin', 'customer'];

const UserPermissionManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/api/admin/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'ไม่สามารถดึงข้อมูลผู้ใช้ได้';
      alert(errorMessage);
    }
  };

  const updateRole = async (userId: number, newRole: string) => {
    try {
      // Role
      // admin = role_id 1
      // customer = role_id 2
      const roleId = newRole === 'admin' ? 1 : 2;

      await apiClient.put(`/api/user/${userId}/role`, { roleId });
      fetchUsers(); // รีเอาข้อมูลใหม่หลัง Update เสร็จ
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'ไม่สามารถอัปเดตสิทธิ์ผู้ใช้ได้';
      alert(errorMessage);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="cafe-card p-6 fade-in">
      <h2 className="cafe-subheading mb-6">จัดการสิทธิ์ผู้ใช้</h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cafe-primary"></div>
          <span className="ml-3 cafe-text">กำลังโหลดข้อมูลผู้ใช้...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full table-auto border-collapse border border-cafe-secondary">
            <thead>
              <tr className="text-left bg-cafe-primary text-cafe-light">
                <th className="p-3 font-semibold">ชื่อผู้ใช้</th>
                <th className="p-3 font-semibold">อีเมล</th>
                <th className="p-3 font-semibold">บทบาท</th>
                <th className="p-3 font-semibold text-center">เปลี่ยนบทบาท</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.user_id} className="border-b border-cafe-secondary hover:bg-cafe-light">
                    <td className="p-3 cafe-text">{user.user_name || '(ไม่มีชื่อ)'}</td>
                    <td className="p-3 cafe-text">{user.user_email}</td>
                    <td className="p-3 cafe-text">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.user_id, e.target.value)}
                        className="cafe-input bg-white"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>{r === 'admin' ? 'ผู้ดูแลระบบ' : 'ลูกค้า'}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center cafe-text-light">
                    ไม่พบข้อมูลผู้ใช้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserPermissionManager;
