import { Outlet, useLocation } from "react-router-dom"
import React from 'react'
import Navbar from "./Navbar"
import { Box, Container } from "@mui/material"
import { useSendLogOutMutation } from '../pages/auth/authApiSlice'
import LoadingSpinner from "./LoadingSpinner"
import ErrorMessage from './ErrorMessage'
import VerticalSwiper from "./swiper/VerticalSwiper"
import MainContent from "../pages/blogs/MainContent"
import FrontPageSideBar from "./FrontPageSideBar"
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      ll: 1460,
      xl: 1670,
      xxl: 1950,
      xxxl: 2560,
    },
  },
})
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

      <Box >
        {isLoading || isError ?
          { content }
          :
          <>
            <Navbar handleLogout={handleLogout} isSuccess={isSuccess} />
            <Box sx={{ width: '100%', height: 'calc(100vh - 70px)', mt: '70px' }}  >
              <VerticalSwiper />
            </Box>
            <MainContent />
          </>
        }
      </Box>

    )
  }

  if (pathname.includes('/blogs')) {
    return main = (

      <Box >
        {isLoading || isError ?
          { content }
          :
          <>
            <Navbar handleLogout={handleLogout} isSuccess={isSuccess} />
            <Box sx={{ display: 'flex', mt: '70px', width: '100%', minHeight: 'calc(100vh - 70px)' }}>
              <FrontPageSideBar />
              <ThemeProvider theme={theme}  >
                <Container sx={{ minHeight: '100%', width: '100%' }} maxWidth='xxxl'>
                  <Outlet />
                </Container>
              </ThemeProvider>
            </Box>
          </>
        }
      </Box>

    )
  }

  if (pathname !== '/') {
    return main = (
      <>
        <Navbar handleLogout={handleLogout} isSuccess={isSuccess} />
        <ThemeProvider theme={theme}  >
          <Container maxWidth='xxxl' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 70px)', mt: '100px' }}>
            {isLoading || isError ?
              { content }
              :
              <Outlet />
            }
          </Container>
        </ThemeProvider>
      </>)

  }



  return { main }


}

export default Layout