import React, { useEffect, useState } from 'react'
import LinkButton from './LinkButton'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useGetUsersQuery } from '../pages/users/UserApiSlice'
import { Avatar, AppBar, Box, Toolbar, Typography, Button, IconButton, MenuIcon, Popover } from '@mui/material'
import { current } from '@reduxjs/toolkit'



export default function Navbar({ handleLogout, isSuccess }) {

  // export default function Navbar() {

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { username, userId } = useAuth()

  const { currentUser } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      currentUser: data?.entities[userId]
    })
  })

  const [initial, setInitial] = useState(null)
  const [avatarImg, setAvatarImg] = useState(null)

  useEffect(() => {
    if (isSuccess) {
      navigate('/')
    }
  }, [isSuccess, navigate])

  useEffect(() => {
    if (username) {
      setInitial(username[0].toString().toUpperCase())
    }
    if (currentUser.avatar) {
      setAvatarImg(currentUser.avatar)
    }
  }, [username, currentUser])


  const [anchorEl, setAnchorEl] = React.useState(null)

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)


  return (

    <AppBar sx={{ flexGrow: 1, height: '70px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <LinkButton visit='/' name='K-Blog' style='outlined' fontSize='2rem' />


        {username && current.role === 'Admin' ?
          (
            <Box>
              <LinkButton visit='/dash/users' name='users' />
              <LinkButton visit='/dash/users/new' name='new user' />
              <Avatar src={avatarImg}>{avatarImg ? '' : initial}</Avatar>
              <Button sx={{ color: 'white' }}>{username}</Button>
              <Button sx={{ color: 'white' }} onClick={handleLogout}>Logout</Button>
            </Box>
          )
          : username ?
            <IconButton
              aria-owns={open ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Avatar src={avatarImg}>{avatarImg ? '' : initial}</Avatar>
            </IconButton>

            :
            <Box>
              <LinkButton visit='/login' name='Login' />
              <LinkButton visit='/register' name='Signup' />
            </Box>
        }

      </Toolbar>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography variant='12px'
          sx={{
            maxWidth: '100px', // Set your desired maximum width
            color: 'black',
            wordBreak: "break-word",
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
            textOverflow: 'ellipsis',
            m: 1,
          }}
        >{username}</Typography>
      </Popover>
    </AppBar>

  )
}