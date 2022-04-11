/*
The RequireAuth component can be wrapped around protected routes to stop 
unauthorized users from accessing them
The plan here is to send user to a page they attempted to access after logging in
*/

import { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from './hooks/useAuth';

export const RequireAuth = () => {
    const { auth, setAuth } = useAuth();
    console.log("Require auth called");

    const location = useLocation();

    const token = localStorage.getItem("accessToken");

    console.log(token);

    useEffect(() => {
        setAuth({
            accessToken: token
        })
    }, [])

    console.log(auth?.accessToken);

    // auth?.accessToken ? console.log("Token there!") : console.log("token not there");

    return (
        token ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}
