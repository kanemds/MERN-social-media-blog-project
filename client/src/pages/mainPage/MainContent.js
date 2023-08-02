import React from 'react'
import ActiveCalender from './ActiveCalender'
import { Box, Button, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import BodyElements from './BodyElements'



const Root = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center'
  },
}))




const MainContent = () => {

  const date = new Date()

  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour24: true }
  const currentDay = new Intl.DateTimeFormat('en-US', options).format(date)

  // const currentDay = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

  return (
    <Box sx={{ flexGrow: 1 }}>

      <Grid container  >
        <Grid xs={12} sm={9} md={9}>
          <Button>abc</Button>
        </Grid>

        <Root xs={12} sm={3} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ActiveCalender />
        </Root >
      </Grid>
    </Box>
  )
}

export default MainContent