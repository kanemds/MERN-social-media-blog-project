import { Outlet } from "react-router-dom"

import React from 'react'
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Container } from "@mui/material"

const Layout = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth='true' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: '100px' }}>
        <Outlet />
      </Container>

      <Footer />
    </>)
}

export default Layout