import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        return <Navigate to="/signup" replace />;
    }

    return <Outlet/>;
};

export default ProtectedRoute;