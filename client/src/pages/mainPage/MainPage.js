import React from 'react'
import ActiveCalender from './ActiveCalender'
import BasicCalendar from './BasicCalender'
import { Box, Paper } from '@mui/material'
import ViewYourOwn from './ViewYourOwn'
import { ViewOthers } from './ViewOthers'
import Grid from '@mui/material/Unstable_Grid2'
import BodyElements from './BodyElements'

const MainPage = () => {

  const date = new Date()

  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour24: true }
  const currentDay = new Intl.DateTimeFormat('en-US', options).format(date)

  // const currentDay = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid xs={7}>
          <ViewYourOwn />
          <ViewOthers />
        </Grid>
        <Grid xs={5}>
          <Paper>
            {/* <ActiveCalender /> */}
            <BasicCalendar />
          </Paper>
        </Grid>
      </Grid >
      <BodyElements />
    </Box>
  )
}

export default MainPage