import { Outlet } from "react-router-dom"
import React from 'react'
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Container } from "@mui/material"
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


  const handleLogout = () => sendLogOut()

  let content

  if (isError) return content = <ErrorMessage error={error} />

  if (isLoading) return content = <LoadingSpinner />


  return (
    <>
      <Navbar handleLogout={handleLogout} isSuccess={isSuccess} />
      <Container maxWidth='true' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', mt: '100px', height: 'calc(100vh - 70px)', mt: 0 }}>
        {isLoading || isError ?
          { content }
          :
          <Outlet />
        }

      </Container>

      <Footer />
    </>)
}

export default Layout