import { Navigate } from 'react-router-dom';
import { JSX } from 'react';


interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[]; // e.g. ['admin', 'customer']
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
