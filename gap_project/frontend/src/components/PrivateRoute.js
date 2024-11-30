import { Navigate } from "react-router-dom";
import React from 'react';


const PrivateRoute = ({ element: Component }) => {
 
    const isAuthenticated = !!localStorage.getItem("authToken");

    // Your authentication logic goes here...

 
 
    return isAuthenticated ? <Component /> : <Navigate to="/" />;
};
export default PrivateRoute;