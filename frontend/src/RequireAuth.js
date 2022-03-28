/*
The RequireAuth component can be wrapped around protected routes to stop 
unauthorized users from accessing them
The plan here is to send user to a page they attempted to access after logging in
*/

import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export const RequireAuth = () => {
    const { auth } = useContext(AuthContext);

    const location = useLocation();

    return (
        auth?.username ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}
