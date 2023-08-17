import React from 'react'

import { Box, Button, Paper, Container, Typography, AppBar, Toolbar } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import Note from '../../components/Note'
import FrontPageSearchBar from '../../components/FrontPageSearchBar'
import { useLocation } from 'react-router-dom'

import { blue } from '@mui/material/colors'
import ClientSearchBar from '../../components/ClientSearchBar'
import BlogsList from './BlogsList'
import { Outlet } from 'react-router-dom'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      ll: 1460,
      xl: 1670,
      xxl: 1950
    },
  },
})



const Root = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center'
  },
}))


const SearchBarWidth = styled(Box)(({ theme }) => ({

  [theme.breakpoints.up('md')]: {
    width: '80%'
  },
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    justifyContent: 'center',
    width: '80%'
  },
}))

const PreView = styled(Button)({
  textTransform: 'none',
  background: blue[300]
})


const BlogLayout = () => {

  const { pathname } = useLocation()

  let content

  if (pathname === '/blogs/new') {
    content = (
      <Container sx={{ width: '100%', height: '100%' }} maxWidth='true'>
        <Box sx={{ flexGrow: 1, width: '96%', height: '100%' }}  >
          <Outlet />
        </Box >
      </Container >
    )
  } else {
    content = (
      <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }} maxWidth='true'>

        <Box sx={{ position: 'sticky', top: '70px', backgroundColor: 'white', zIndex: 10, width: '100%', pt: '10px', pb: '10px', display: 'flex', justifyContent: 'center', }}>
          <Box sx={{ width: '96%' }}>
            <ClientSearchBar />
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, width: '96%', mt: '20px' }}  >
          <Outlet />
        </Box >
      </Container >
    )
  }

  return content
}

export default BlogLayout