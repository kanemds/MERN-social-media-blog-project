import { Box, Button, Typography } from '@mui/material'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import React from 'react'

const NotExist = () => {



  const navigate = useNavigate()


  const handleHome = () => {
    navigate('/')
  }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>
          The page is not exist
        </Typography>
        <Typography>
          Back to  <Button onClick={handleHome}>Home Page</Button>
        </Typography>
      </Box>
    </Box>


  )
}

export default NotExist