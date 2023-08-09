import React from 'react'
import ActiveCalender from './ActiveCalender'
import { Box, Button, Paper, Container, Typography, AppBar, Toolbar } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import Note from '../../components/Note'
import FrontPageSearchBar from '../../components/FrontPageSearchBar'

import { blue } from '@mui/material/colors'

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


const BodyElements = () => {
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }} maxWidth='true'>

      <Box sx={{ position: 'sticky', top: '70px', backgroundColor: 'white', zIndex: 10, width: '100%', pt: '10px', pb: '10px', display: 'flex', justifyContent: 'center', }}>
        {/* <ThemeProvider theme={theme}  >
          <Grid xs={12} sm={12} md={7.3} lg={8.5} xl={9} xxl={10} sx={{ width: '96%' }} >
            <Box >
              <SearchBarWidth >
                <SearchBar />
              </SearchBarWidth>
              <Box sx={{ mt: 1, mb: 1 }}>
                <Button variant='container'>All</Button>
                <PreView >All</PreView>
              </Box>
            </Box>
          </Grid>
        </ThemeProvider> */}
        <Box sx={{ width: '96%' }}>
          <FrontPageSearchBar />
        </Box>

      </Box>

      <Box sx={{ flexGrow: 1, width: '96%', mt: '20px' }}  >
        <ThemeProvider theme={theme}  >
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 12, xl: 15, xxl: 12 }}>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>





          </Grid>
        </ThemeProvider>

      </Box>
    </Container >
  )
}

export default BodyElements