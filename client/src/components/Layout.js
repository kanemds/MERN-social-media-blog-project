import { Outlet, useLocation } from "react-router-dom"
import React from 'react'
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Box, Container } from "@mui/material"
import { useSendLogOutMutation } from '../pages/auth/authApiSlice'
import LoadingSpinner from "./LoadingSpinner"
import ErrorMessage from './ErrorMessage'
import VerticalSwiper from "./swiper/VerticalSwiper"
import MainContent from "../pages/mainPage/MainContent"
import SideBar from "./FrontPageSideBar"
import BodyElements from "../pages/mainPage/BodyElements"
import ClientSideBar from "./ClientSideBar"
import ClientSearchBar from "./ClientSearchBar"
import BlogLayout from "../pages/blogs/BlogLayout"

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

        <Footer />
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
            <Box sx={{ display: 'flex', mt: '70px', mb: '70px', }}>
              <ClientSideBar />
              <BlogLayout />
            </Box>
          </>
        }
        <Footer />
      </Box>

    )
  }

  if (pathname !== '/') {
    return main = (
      <>
        <Navbar handleLogout={handleLogout} isSuccess={isSuccess} />
        <Container maxWidth={true} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 70px)', mt: '100px' }}>
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