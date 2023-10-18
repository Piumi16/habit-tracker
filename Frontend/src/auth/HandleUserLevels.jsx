/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router'

const HandleUserLevels = ({ userType, isAdmin }) => {
  return userType ? (
    <Outlet />
  ) : (
    <Navigate to={isAdmin ? '/admin' : '/'} replace={true} />
  )
}
export default HandleUserLevels
