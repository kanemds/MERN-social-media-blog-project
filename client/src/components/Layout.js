import { Outlet } from "react-router-dom"

import React from 'react'
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Container } from "@mui/material"

const Layout = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth='true'>
        <Outlet />
      </Container>

      <Footer />
    </>)
}

export default Layout