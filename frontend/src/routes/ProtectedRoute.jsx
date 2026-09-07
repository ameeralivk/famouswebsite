import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// requireAdmin=true restricts the route to admins; otherwise any authenticated user may pass.
const ProtectedRoute = ({ children, requireAdmin = false, message = 'Please sign in to continue.' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center py-20 text-ink-400">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location, message }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
