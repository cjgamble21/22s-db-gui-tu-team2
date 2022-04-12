/*
The RequireAuth component can be wrapped around protected routes to stop 
unauthorized users from accessing them
The plan here is to send user to a page they attempted to access after logging in
*/

import { useLocation, Navigate, Outlet } from "react-router-dom";

export const RequireAuth = () => {
    const location = useLocation();

    const token = localStorage.getItem("accessToken");

    return (
        token ? < Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}
