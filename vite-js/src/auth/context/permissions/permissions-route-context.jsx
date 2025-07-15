import React, { useContext } from 'react'
import { Navigate } from 'react-router';
import { AuthContext } from 'src/auth/context/jwt';

const PermissionsRouteContext = ({ children, action, isList, mustAll }) => {
    const { user } = useContext(AuthContext);
    const actions = user?.roles?.flatMap(role => role?.permissions?.map(permission => permission?.key))
    console.log("actions : ", actions);
    return (
        <>
            {
                !action ||
                    (Array.isArray(action)
                        ? action.some(a => actions?.includes(a))
                        : actions?.includes(action))
                    ?
                    children
                    : 
                    <Navigate to="/403" replace />
            }

        </>
    )
}

export default PermissionsRouteContext