import { Outlet, useLocation } from "react-router-dom"
import React, { useState } from 'react'
import Navbar from "./Navbar"
import { Box, Container } from "@mui/material"
import { useSendLogOutMutation } from '../pages/auth/authApiSlice'
import LoadingSpinner from "./LoadingSpinner"
import ErrorMessage from './ErrorMessage'
import VerticalSwiper from "./swiper/VerticalSwiper"
import MainContent from "../pages/blogs/MainContent"
import FrontPageSideBar from "./FrontPageSideBar"
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import FrontPageSearchBar from "./FrontPageSearchBar"
import useMediaQuery from '@mui/material/useMediaQuery'
import FrontPageSideBarMedium from "./FrontPageSideBarMedium"


const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 750,
      lg: 1200,
      ll: 1480,
      xl: 1760,
      xxl: 2060,

    },
  },
})




const Layout = () => {
  const largeBP = useMediaQuery('(min-width:1200px)')
  const mediumBP = useMediaQuery('(min-width:750px)')
  const [
    sendLogOut, {
      isLoading,
      isSuccess,
      isError,
      error
    }
  ] = useSendLogOutMutation()

  const { pathname } = useLocation()

  const [isShow, setIsShow] = useState(false)


  const handleMenu = () => {
    setIsShow(prev => !prev)
  }




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
            <Box sx={{ position: 'sticky', top: '70px', height: '80px', zIndex: 10, backgroundColor: 'white', }}>
              <FrontPageSearchBar handleMenu={handleMenu} setIsShow={setIsShow} />
            </Box>
            <Box sx={{ display: 'flex', mb: '50px', }}>
              <ThemeProvider theme={theme}  >
                {largeBP ?
                  <FrontPageSideBar isShow={isShow} />
                  :
                  mediumBP ?
                    <FrontPageSideBarMedium />
                    :
                    ''
                }
                <Container sx={{ minHeight: '100%', width: '100%' }} maxWidth='xxl'>
                  <MainContent />
                </Container>
              </ThemeProvider>
            </Box>
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
                <Container sx={{ minHeight: '100%', width: '100%' }} maxWidth='xxl'>
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
          <Container maxWidth='xxl' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 70px)', mt: '100px' }}>
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