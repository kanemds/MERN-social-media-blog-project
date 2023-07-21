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
import useAuth from '../hooks/useAuth'


export default function Navbar({ handleLogout, isSuccess }) {

  // export default function Navbar() {

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { username } = useAuth()

  useEffect(() => {
    if (isSuccess) {
      navigate('/')
    }
  }, [isSuccess, navigate])


  return (

    <AppBar position="static" sx={{ flexGrow: 1, height: '70px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <LinkButton visit='/' name='K-Blog' style='outlined' fontSize='2rem' />

        <Box>
          <LinkButton visit='/dash/users' name='users' />
          <LinkButton visit='/dash/users/new' name='new user' />

          {username ?
            (<>
              <Button sx={{ color: 'white' }}>{username}</Button>
              <Button sx={{ color: 'white' }} onClick={handleLogout}>Logout</Button>
            </>)
            :
            <>
              <LinkButton visit='/login' name='Login' />
              <LinkButton visit='/register' name='Signup' />
            </>
          }
        </Box>
      </Toolbar>
    </AppBar>

  )
}