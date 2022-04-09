/*
The RequireAuth component can be wrapped around protected routes to stop 
unauthorized users from accessing them
The plan here is to send user to a page they attempted to access after logging in
*/

import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from './hooks/useAuth';

export const RequireAuth = () => {
    const { auth } = useAuth();

    const location = useLocation();

    console.log(localStorage.getItem("accessToken"));

    return (
        auth?.accessToken ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}
