import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

interface ProtectedRouteProps {
    accessLevel?: 'Admin' | 'Lender' | 'Borrower' | 'Both' | 'Guest'
    redirectPath?: string
    children?: JSX.Element
}

export const ProtectedRoute = ({
    accessLevel = 'Both',
    redirectPath = '/login',
    children,
}: ProtectedRouteProps): JSX.Element => {
    const { user } = useAuth()

    const hasAccess = user.roles.includes(accessLevel)

    const isAllowed = user.token && hasAccess

    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />
    }

    return children ? children : <Outlet />
}
