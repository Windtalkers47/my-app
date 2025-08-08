import { useEffect, useState } from 'react';
import axios from 'axios';

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
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const updateRole = async (userId: number, newRole: string) => {
    try {
      const token = localStorage.getItem('token');

      // Role
      // admin = role_id 1
      // customer = role_id 2
      const roleId = newRole === 'admin' ? 1 : 2;

      await axios.put(`/api/user/${userId}/role`, { roleId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers(); // รีเอาข้อมูลใหม่หลัง Update เสร็จ
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-bold mb-4">User Permission Manager</h2>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Username</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id} className="border-b">
                <td className="py-2">{user.user_name || '(empty)'}</td>
                <td>{user.user_email}</td>
                <td>{user.role}</td>
                <td className="text-center">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.user_id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserPermissionManager;
