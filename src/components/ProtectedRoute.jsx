import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/signup" replace />;
    }

    return <Outlet/>;
};

export default ProtectedRoute;