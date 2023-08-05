import React from 'react'
import ActiveCalender from './ActiveCalender'
import { Box, Button, Paper, Container, Typography } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import BodyElements from './BodyElements'
import Note from './Note'
import SearchBar from '../../components/SearchBar'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      ll: 1400,
      xl: 1536,
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




const MainContent = () => {

  const date = new Date()

  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour24: true }
  const currentDay = new Intl.DateTimeFormat('en-US', options).format(date)

  // const currentDay = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

  return (
    <Container sx={{ flexGrow: 1 }} maxWidth='true'>
      <Grid container  >


        <ThemeProvider theme={theme}  >
          <Grid xs={12} sm={12} md={7.3} lg={8.5} xl={9} xxl={10}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
              <SearchBarWidth >
                <SearchBar />
              </SearchBarWidth>

              <Box>
                <Button>Your Posts</Button>
                <Button>From Friend List</Button>
                <Button>Others</Button>
              </Box>
            </Box>
          </Grid>

          <Root xs={12} sm={12} md={4.7} lg={3.5} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ActiveCalender />
          </Root >
        </ThemeProvider>

      </Grid>

      <Box sx={{ flexGrow: 1 }}  >



        <ThemeProvider theme={theme}  >
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 15, xxl: 12 }}>

            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
          </Grid>


        </ThemeProvider>
        <Typography>Others</Typography>
        <ThemeProvider theme={theme}  >
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 15, xxl: 12 }}>

            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
            <Grid xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
          </Grid>


        </ThemeProvider>
      </Box>
    </Container >
  )
}

export default MainContent