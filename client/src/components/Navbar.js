import React, { useEffect, useState, useRef } from 'react'
import LinkButton from './LinkButton'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useGetUsersQuery } from '../pages/users/UserApiSlice'
import { Avatar, AppBar, Box, Toolbar, Typography, Button, IconButton, MenuIcon, Popover } from '@mui/material'
import { current } from '@reduxjs/toolkit'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import { red } from '@mui/material/colors'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import SettingsIcon from '@mui/icons-material/Settings'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'



const SideButton = styled(Button)({
  textTransform: 'none',
  justifyContent: "flex-start",
  borderRadius: '0px',
  '&:hover': {
    backgroundColor: '#1976d2',
    color: 'white'
  }
})

const ButtonInfo = styled(Typography)({
  textAlign: 'left',
  marginLeft: 12
})

const getWindowSize = () => {
  const { innerWidth } = window
  return { innerWidth }
}

export default function Navbar({ handleLogout, isSuccess }) {


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
  const [isOnClick, setIsOnClick] = useState(false)
  const [windowSize, setWindowSize] = useState(getWindowSize())



  useEffect(() => {
    if (username) {
      setInitial(username[0].toString().toUpperCase())
    }
    if (currentUser?.avatar) {
      setAvatarImg(currentUser?.avatar)
    }
  }, [username, currentUser])

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize())
      setIsOnClick(false)
      setAnchorEl(null)
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])


  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (event) => {

    setAnchorEl(event.currentTarget)

  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setIsOnClick(true)
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setIsOnClick(false)
    setAnchorEl(null)

  }
  const handleToMyPost = () => {
    navigate('/blogs')
  }

  const handleToSetting = () => {
    navigate(`/setting/${userId}`)
  }



  const id = open ? 'simple-popover' : undefined


  return (

    <AppBar sx={{ flexGrow: 1, height: '70px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <LinkButton visit='/' name='K-Blog' style='outlined' fontSize='2rem' />

        {username ?
          <IconButton
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"

            onMouseEnter={!isOnClick ? handlePopoverOpen : null}
            onMouseLeave={!isOnClick ? handlePopoverClose : null}
            onClick={handleClick}
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
          display: isOnClick ? 'none' : 'block'
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
            m: 1
          }}
        >{username}</Typography>
      </Popover>
      <Popover
        id={id}
        open={isOnClick ? open : false}
        anchorEl={anchorEl}
        onClose={isOnClick ? handleClose : null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <SideButton onClick={handleToMyPost} >
            <ArticleOutlinedIcon sx={{ fontSize: '20px' }} />
            <ButtonInfo >My post(s)</ButtonInfo>
          </SideButton>
          <SideButton onClick={handleToSetting}>
            <SettingsIcon sx={{ fontSize: '20px' }} />
            <ButtonInfo >  Settings</ButtonInfo>
          </SideButton>
          <SideButton sx={{ color: 'white', backgroundColor: red[700], '&:hover': { color: red[700], backgroundColor: 'white', } }} onClick={handleLogout} >
            <PowerSettingsNewIcon sx={{ fontSize: '20px' }} />
            <ButtonInfo>Sign out</ButtonInfo>
          </SideButton>
        </Box>
      </Popover>
    </AppBar >

  )
}