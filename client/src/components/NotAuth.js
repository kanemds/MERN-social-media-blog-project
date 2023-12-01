import { Box, Button, Typography } from '@mui/material'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import React from 'react'
import useAuth from '../hooks/useAuth'

const NotAuth = () => {

  const { username } = useAuth()

  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login')
  }
  const handleRegister = () => {
    navigate('/register')
  }
  const handleHome = () => {
    navigate('/')
  }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>

      {!username ?
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography>
            This content requires authorization.
          </Typography>
          <Typography>
            Back to  <Button onClick={handleHome}>Home Page</Button>
          </Typography>
        </Box>
        :
        <>
          <Typography>
            This content requires authorization.
          </Typography>
          <Typography>
            Please <Button onClick={handleLogin}>Login</Button>
            or  <Button onClick={handleRegister}>Register</Button></Typography>
        </>
      }


    </Box>


  )
}

export default NotAuth