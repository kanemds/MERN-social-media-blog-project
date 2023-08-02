import React from 'react'
import ActiveCalender from './ActiveCalender'
import { Box, Button, Paper } from '@mui/material'


import Grid from '@mui/material/Unstable_Grid2'
import BodyElements from './BodyElements'
import HorizontalSwiper from '../../components/swiper/HorizontalSwiper'

const MainContent = () => {

  const date = new Date()

  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour24: true }
  const currentDay = new Intl.DateTimeFormat('en-US', options).format(date)

  // const currentDay = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

  return (
    <Box  >

      <Box sx={{ width: '300px' }}>
        <ActiveCalender />
      </Box>

    </Box>
  )
}

export default MainContent