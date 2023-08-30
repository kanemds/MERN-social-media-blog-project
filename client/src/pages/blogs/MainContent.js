import React from 'react'
import ActiveCalender from './ActiveCalender'
import { Box, Button, Paper, Container, Typography, AppBar, Toolbar } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import Note from '../../components/Note'
import FrontPageSearchBar from '../../components/FrontPageSearchBar'
import { blue } from '@mui/material/colors'
import FrontPageSideBar from '../../components/FrontPageSideBar'
import { useGetBlogsQuery } from './blogsApiSlice'
import LoadingSpinner from '../../components/LoadingSpinner'


const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      ll: 1460,
      xl: 1670,
      xxl: 1950,
      xxxl: 2560,
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


const MainContent = () => {

  const {
    data: blogs,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetBlogsQuery()

  let content

  if (!isLoading) {
    content = <LoadingSpinner />
  }

  if (isSuccess) {
    content = (
      <Box sx={{ flexGrow: 1, width: '96%', mt: '20px' }}  >

        <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 12, xl: 15, xxl: 12 }}>
          {/* <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
        <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
        <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid>
        <Grid xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}><Note /></Grid> */}
        </Grid>

      </Box>
    )
  }


  return (
    <Box sx={{ display: 'flex', mt: '50px', mb: '50px', height: '100%' }}>

      <FrontPageSideBar blogs={blogs} />
      <ThemeProvider theme={theme}  >
        <Container sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} maxWidth='xxxl'>

          <Box sx={{ position: 'sticky', top: '70px', backgroundColor: 'white', zIndex: 10, width: '100%', pt: '10px', pb: '10px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Box sx={{ width: '96%' }}>
              <FrontPageSearchBar />
            </Box>
          </Box>
        </Container >
      </ThemeProvider>
    </Box>
  )
}

export default MainContent