import React, { useEffect, useState } from 'react'
import LinkButton from './LinkButton'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useGetUsersQuery } from '../pages/users/UserApiSlice'
import { Avatar, AppBar, Box, Toolbar, Typography, Button, IconButton, MenuIcon } from '@mui/material'
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
            <Avatar src={avatarImg}>{avatarImg ? '' : initial}</Avatar>
            :
            <Box>
              <LinkButton visit='/login' name='Login' />
              <LinkButton visit='/register' name='Signup' />
            </Box>
        }

      </Toolbar>
    </AppBar>

  )
}