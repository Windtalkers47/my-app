import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageProducts() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  return (
    <div className="pt-20">
      <h2>Admin: Manage Products</h2>
    </div>
  );
}
