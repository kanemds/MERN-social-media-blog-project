import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'



const RequireAuth = ({ allowedRoles }) => {


  const location = useLocation()
  const { role } = useAuth()
  const [state, setState] = React.useState({
    left: false,
  })


  const drawerDirection = ['left']
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
  }


  const content = (

    allowedRoles.includes(role) ? <Outlet />
      :
      <Navigate to='login' state={{ from: location }} replace />
  )

  return content
}

export default RequireAuth

