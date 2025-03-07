import { Navigate, Outlet } from "react-router-dom"


/* eslint-disable react/prop-types */
const ProtectedRoute = ({children,isAuthenticated,redirectTo}) => {
  
    if(!isAuthenticated) return <Navigate to={`${redirectTo}`} />

    return children ? children : <Outlet />
}

export default ProtectedRoute