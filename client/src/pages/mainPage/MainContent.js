import React from 'react'
import { Box } from '@mui/material'
import BodyElements from './BodyElements'
import FrontPageSideBar from '../../components/FrontPageSideBar'





const MainContent = () => {


  return (
    <Box sx={{ display: 'flex', mt: '50px', mb: '50px', height: '100%' }}>

      <FrontPageSideBar />

      <BodyElements />
    </Box>

  )
}

export default MainContent