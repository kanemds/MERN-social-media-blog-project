import React from 'react'
import { Box } from '@mui/material'
import BodyElements from './BodyElements'
import FrontPageSideBar from '../../components/FrontPageSideBar'





const MainContent = () => {

  const date = new Date()

  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour24: true }
  const currentDay = new Intl.DateTimeFormat('en-US', options).format(date)

  // const currentDay = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

  return (
    <Box sx={{ display: 'flex', mt: '50px', mb: '50px', }}>
      <FrontPageSideBar />

      <BodyElements />
    </Box>

  )
}

export default MainContent