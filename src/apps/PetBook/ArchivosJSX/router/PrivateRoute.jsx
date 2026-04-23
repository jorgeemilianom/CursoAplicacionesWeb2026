import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../../ArchivosJS/hooks/useUser'
import { PETBOOK_BASE_PATH } from '../../ArchivosJS/utils/constants'

function PrivateRoute() {
  const { isAuthenticated } = useUser()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={`${PETBOOK_BASE_PATH}/login`} replace state={{ from: location }} />
  }

  return <Outlet />
}

export default PrivateRoute
