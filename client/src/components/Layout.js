import { Outlet, useLocation } from "react-router-dom"
import React from 'react'
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Box, Container } from "@mui/material"
import { useSendLogOutMutation } from '../pages/auth/authApiSlice'
import LoadingSpinner from "./LoadingSpinner"
import ErrorMessage from './ErrorMessage'


const Layout = () => {

  const [
    sendLogOut, {
      isLoading,
      isSuccess,
      isError,
      error
    }
  ] = useSendLogOutMutation()

  const { pathname } = useLocation()

  const handleLogout = () => sendLogOut()

  let content

  if (isError) return content = <ErrorMessage error={error} />

  if (isLoading) return content = <LoadingSpinner />

  let main

  if (pathname === '/') {
    return main = (
      <>
        <Navbar handleLogout={handleLogout} isSuccess={isSuccess} />
        <Box>
          {isLoading || isError ?
            { content }
            :
            <Outlet />
          }
        </Box>
        <Footer />
      </>
    )
  }

  if (pathname !== '/') {
    return main = (
      <>
        <Navbar handleLogout={handleLogout} isSuccess={isSuccess} />
        <Container maxWidth='true' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 'calc(100vh - 70px)', mt: '100px' }}>
          {isLoading || isError ?
            { content }
            :
            <Outlet />
          }

        </Container>
        <Footer />
      </>)

  }



  return { main }


}

export default Layout