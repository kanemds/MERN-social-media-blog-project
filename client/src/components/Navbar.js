import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import LinkButton from './LinkButton'


export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            K-Blog
          </Typography>

          <LinkButton visit='/login' name='Login' />
          <LinkButton visit='/register' name='Signup' />
          <LinkButton visit='/dash/users' name='users' />
          <LinkButton visit='/dash/users/new' name='new user' />
        </Toolbar>
      </AppBar>
    </Box>
  )
}