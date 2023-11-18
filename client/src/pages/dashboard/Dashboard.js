import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderDash from './HeaderDash'
import FooterDash from './FooterDash'

const Dashboard = () => {
  return (
    <>

      <Outlet />
    </>

  )

}

export default Dashboard