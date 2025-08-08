import { useEffect, useState, Fragment } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { isLoggedIn, getUserRole } from '../utils/auth';
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // e.g. ['admin', 'customer']
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps): React.ReactElement | null => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await isLoggedIn();
        const userRole = await getUserRole();
        
        if (!isAuthenticated || !userRole) {
          // Only navigate if we're not already on the home page
          if (window.location.pathname !== '/') {
            navigate('/');
          } else {
            setAuthorized(false);
          }
          return;
        }
        
        if (allowedRoles.includes(userRole)) {
          setAuthorized(true);
        } else {
          // Only navigate if we're not already on the home page
          if (window.location.pathname !== '/') {
            navigate('/');
          } else {
            setAuthorized(false);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Only navigate if we're not already on the home page
        if (window.location.pathname !== '/') {
          navigate('/');
        } else {
          setAuthorized(false);
        }
      } finally {
        setLoading(false);
      }
    };

    // ใส่ Delay เพื่อป้องกัน Infinity Loop check Auth
    // Add a small delay to prevent rapid auth checks
    const delayedCheckAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      checkAuth();
    };
    
    delayedCheckAuth();
  }, [allowedRoles, navigate]);

  if (loading) {
    return null;
  }

  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
