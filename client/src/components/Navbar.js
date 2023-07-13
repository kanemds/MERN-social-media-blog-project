import React, { useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import LinkButton from './LinkButton'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSendLogOutMutation } from '../pages/auth/authApiSlice'


export default function Navbar({ handleLogout, isSuccess }) {

  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    if (isSuccess) {
      navigate('/')
    }
  }, [isSuccess, navigate])



  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <LinkButton visit='/' name='K-Blog' style='outlined' fontSize='2rem' />

          <Box>
            <LinkButton visit='/login' name='Login' />
            <LinkButton visit='/register' name='Signup' />
            <LinkButton visit='/dash/users' name='users' />
            <LinkButton visit='/dash/users/new' name='new user' />
            <LinkButton visit='/' name='Logout' />
            <Button onClick={handleLogout}>out</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}