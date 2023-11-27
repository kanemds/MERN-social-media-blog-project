import { Outlet, useLocation, useNavigate } from "react-router-dom"
import React, { useState, useEffect } from 'react'
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
import { useDispatch, useSelector } from "react-redux"
import { increment, resetCache, userLogout } from "../pages/blogs/blogSlice"
import { apiSlice } from "../app/api/apiSlice"
import { onLoggingOut } from "../pages/auth/authSlice"


const theme = createTheme({
  breakpoints: {
    values: {
      xs: 320,
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

  // const largeBP = useMediaQuery('(min-width:1200px)')
  // const mediumBP = useMediaQuery('(min-width:750px)')
  const small = useMediaQuery('(max-width:791px)')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()


  const [
    sendLogOut, {
      isLoading,
      isSuccess,
      isError,
      error
    }
  ] = useSendLogOutMutation()


  const [state, setState] = useState({
    left: false,
  })
  const [loggingOut, setLoggingOut] = useState(false)



  const handleLogout = () => {
    // dispatch(resetCache()) // blogSLice set page back to 1
    // dispatch(apiSlice.util.resetApiState())
    // dispatch(api.util.invalidateTags(['CompanySettings'])
    dispatch(onLoggingOut(true))
    navigate('/logout')
    // dispatch(userLogout(true))
    // setLoggingOut(true)

    sendLogOut()
  }


  // useEffect(() => {
  //   if (isSuccess) {
  //     // navigate('/')
  //     setTimeout(() => {
  //       navigate('/')
  //     }, 1000)
  //   }
  // }, [isSuccess, navigate])

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
          <Box>
            <Box sx={{ height: '70px' }}>
              <Navbar handleLogout={handleLogout} isSuccess={isSuccess} loggingOut={loggingOut} />
            </Box>

            <Box sx={{ width: '100%', height: 'calc(100vh - 70px)', mt: '70px' }}  >
              <VerticalSwiper />
            </Box>

            <Box sx={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'flex-start', mt: '20px' }}>
              <FrontPageSideBar />
              <ThemeProvider theme={theme}  >
                <Container maxWidth='xxl'>
                  <Outlet />
                </Container>
              </ThemeProvider>
            </Box>


          </Box>

        }
      </Box >
    )
  }

  // startWith /blogs pages with slider,sidebar and searchbar 
  if (pathname.includes('/blogs') || pathname.includes('/setting') || pathname.includes('/dash')) {
    return main = (

      <Box >
        {isLoading || isError ?
          { content }
          :
          <>
            <Navbar handleLogout={handleLogout} isSuccess={isSuccess} loggingOut={loggingOut} />
            <Box sx={{ display: 'flex', position: 'relative', minHeight: 'calc(100vh - 70px)', mt: '70px', width: '100%' }}>
              <FrontPageSideBar />
              <ThemeProvider theme={theme}  >
                <Container maxWidth='xxl'>
                  <Outlet />
                </Container>
              </ThemeProvider>
            </Box>
          </>
        }
      </Box >

    )
  }


  // other pages no slider, sidebar and searchbar
  if (pathname !== '/blogs' && pathname !== '/' && !pathname.includes('/dash')) {
    return main = (
      <>
        <Navbar handleLogout={handleLogout} isSuccess={isSuccess} loggingOut={loggingOut} setLoggingOut={setLoggingOut} />
        <ThemeProvider theme={theme}  >
          <Container maxWidth='xxl' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)', mt: '70px', width: '100%' }}>
            {isLoading || isError ?
              { content }
              :
              <Outlet />
            }
          </Container>
        </ThemeProvider >
      </>)
  }
  return { main }
}

export default Layout