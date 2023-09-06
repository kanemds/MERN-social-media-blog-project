import { Outlet, useLocation } from "react-router-dom"
import React, { useState } from 'react'
import Navbar from "./Navbar"
import { Box, Container } from "@mui/material"
import { useSendLogOutMutation } from '../pages/auth/authApiSlice'
import LoadingSpinner from "./LoadingSpinner"
import ErrorMessage from './ErrorMessage'
import VerticalSwiper from "./swiper/VerticalSwiper"
import MainContent from "../pages/mainPage/MainContent"
import FrontPageSideBar from "./FrontPageSideBar"
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import FrontPageSearchBar from "./FrontPageSearchBar"
import useMediaQuery from '@mui/material/useMediaQuery'
import FrontPageSideBarMedium from "./FrontPageSideBarMedium"
import BlogsList from "../pages/blogs/BlogsList"
import './scrollbar.css'

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

  // home page with slider,sidebar and searchbar 
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


            <Box sx={{ display: 'flex', position: 'relative' }}>
              <Box sx={{
                position: 'sticky', top: '150px', zIndex: 10, backgroundColor: 'white', overflow: 'hidden', scrollbarGutter: 'stable', height: 'calc(100vh - 150px)', '&:hover': { overflowY: 'scroll' }
              }}>
                {largeBP ?
                  <FrontPageSideBar isShow={isShow} />
                  :
                  mediumBP ?
                    <FrontPageSideBarMedium />
                    :
                    ''
                }
              </Box>

              <ThemeProvider theme={theme}  >
                <Container sx={{ minHeight: '100vh', width: '100%' }} maxWidth='xxl'>
                  <MainContent />
                </Container>
              </ThemeProvider>
            </Box>
          </>
        }
      </Box >

    )
  }

  // startWith /blogs pages with slider,sidebar and searchbar 
  if (pathname.includes('/blogs')) {
    return main = (

      <Box >
        {isLoading || isError ?
          { content }
          :
          <>
            <Navbar handleLogout={handleLogout} isSuccess={isSuccess} />
            <Box sx={{ position: 'sticky', top: '70px', height: '80px', zIndex: 10, backgroundColor: 'white', }}>
              <FrontPageSearchBar handleMenu={handleMenu} setIsShow={setIsShow} />
            </Box>


            <Box sx={{ display: 'flex', position: 'relative' }}>
              <Box sx={{
                position: 'sticky', top: '150px', zIndex: 10, backgroundColor: 'white', overflow: 'hidden', scrollbarGutter: 'stable', height: 'calc(100vh - 150px)', '&:hover': { overflowY: 'scroll' }
              }}>
                {largeBP ?
                  <FrontPageSideBar isShow={isShow} />
                  :
                  mediumBP ?
                    <FrontPageSideBarMedium />
                    :
                    ''
                }
              </Box>

              <ThemeProvider theme={theme}  >
                <Container sx={{ minHeight: '100vh', width: '100%' }} maxWidth='xxl'>
                  <BlogsList />
                </Container>
              </ThemeProvider>
            </Box>
          </>
        }
      </Box>

    )
  }

  // other pages no slider, sidebar and searchbar
  if (!pathname.includes('/blogs')) {
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