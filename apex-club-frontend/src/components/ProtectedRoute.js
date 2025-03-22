import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
    const location = useLocation();
    
    // Check if user is authenticated
    // This should be replaced with your actual authentication check
    const isAuthenticated = () => {
        const token = localStorage.getItem('apexToken');
        return !!token; // Returns true if token exists
    };

    if (!isAuthenticated()) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render child routes if authenticated
    return (
        <div className="protected-content">
            <Outlet />
        </div>
    );
};

export default ProtectedRoute;