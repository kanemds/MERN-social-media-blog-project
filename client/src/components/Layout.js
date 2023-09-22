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
import { useDispatch, useSelector } from "react-redux"
import { increment, resetCache } from "../pages/blogs/blogSlice"
import { apiSlice } from "../app/api/apiSlice"

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

  // const largeBP = useMediaQuery('(min-width:1200px)')
  // const mediumBP = useMediaQuery('(min-width:750px)')
  const small = useMediaQuery('(max-width:791px)')
  const dispatch = useDispatch()

  const [
    sendLogOut, {
      isLoading,
      isSuccess,
      isError,
      error
    }
  ] = useSendLogOutMutation()

  const { pathname } = useLocation()
  const [state, setState] = React.useState({
    left: false,
  })




  const handleLogout = () => {
    dispatch(resetCache())
    dispatch(apiSlice.util.resetApiState())
    // dispatch(api.util.invalidateTags(['CompanySettings'])
    sendLogOut()
  }

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
          <>
            <Navbar handleLogout={handleLogout} isSuccess={isSuccess} />

            <Box sx={{ width: '100%', height: 'calc(100vh - 70px)', mt: '70px' }}  >
              <VerticalSwiper />
            </Box>
            <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 80px)', position: 'relative', mt: '80px', width: '100%' }}>
              <FrontPageSideBar state={state} setState={setState} drawerDirection={drawerDirection} toggleDrawer={toggleDrawer} />
              <ThemeProvider theme={theme}  >
                <Container maxWidth='xxl'>
                  <MainContent state={state} setState={setState} toggleDrawer={toggleDrawer} drawerDirection={drawerDirection} />
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
            <Box sx={{ display: 'flex', position: 'relative', minHeight: 'calc(100vh - 80px)', mt: '80px', width: '100%' }}>
              <FrontPageSideBar state={state} setState={setState} drawerDirection={drawerDirection} toggleDrawer={toggleDrawer} />
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
  if (pathname !== '/blogs' && pathname !== '/') {
    return main = (
      <>
        <Navbar handleLogout={handleLogout} isSuccess={isSuccess} />
        <ThemeProvider theme={theme}  >
          <Container maxWidth='xxl' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)', pt: '100px', pb: '100px' }}>
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