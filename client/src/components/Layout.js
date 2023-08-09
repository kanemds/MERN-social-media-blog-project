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

  if (pathname === '/blogs') {
    return main = (

      <Box >
        {isLoading || isError ?
          { content }
          :
          <>
            <Navbar handleLogout={handleLogout} isSuccess={isSuccess} />
            <Box sx={{ display: 'flex', mt: '50px', mb: '50px', }}>
              <ClientSideBar />

              <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', ml: '280px' }} maxWidth='true'>
                <Box sx={{ position: 'sticky', top: '90px', backgroundColor: 'white', zIndex: 10, width: '100%', pt: '10px', pb: '10px', display: 'flex', justifyContent: 'center', }}>
                  <Box sx={{ width: '96%' }}>
                    <ClientSearchBar />
                  </Box>
                </Box>
                <Outlet />
              </Container >
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
        <Container maxWidth={true} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 'calc(100vh - 70px)', mt: '100px' }}>
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