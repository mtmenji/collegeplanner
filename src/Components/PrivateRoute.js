import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext'

const PrivateRoute = ({children}) => {
    const {currentUser} = useAuth();
    return currentUser !== undefined ? (currentUser ? children : <Navigate to='/login'/>) : null;
}

export default PrivateRoute