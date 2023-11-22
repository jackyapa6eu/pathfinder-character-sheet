import { Navigate } from 'react-router-dom';
import { memo } from 'react';

const ProtectedRoute = ({ condition, to, component }) => {
  return condition ? <>{component}</> : <Navigate to={to} replace />;
};

export default memo(ProtectedRoute);
