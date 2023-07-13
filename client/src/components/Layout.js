import { Outlet } from "react-router-dom"
import React, { useEffect } from 'react'
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Container } from "@mui/material"
import { useSendLogOutMutation } from '../pages/auth/authApiSlice'
import LoadingSpinner from "./LoadingSpinner"


const Layout = () => {

  const [
    logOut, {
      isLoading,
      isSuccess,
      isError,
      error
    }
  ] = useSendLogOutMutation()



  const handleLogout = () => logOut()


  return (
    <>
      <Navbar handleLogout={handleLogout} isSuccess={isSuccess} />
      <Container maxWidth='true' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: '100px' }}>
        {isLoading ?
          <LoadingSpinner /> :
          <Outlet />
        }

      </Container>

      <Footer />
    </>)
}

export default Layout