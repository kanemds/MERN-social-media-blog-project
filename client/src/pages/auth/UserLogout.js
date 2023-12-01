import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Box, CircularProgress, Typography } from '@mui/material'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { onLoggingOut } from './authSlice'

const UserLogout = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoggingOut } = useSelector(state => state?.auth)


  useEffect(() => {
    if (!isLoggingOut) {
      navigate('/')
    }

    // if (isLoggingOut) {
    //   setTimeout(() => {
    //     dispatch(onLoggingOut(false))
    //     navigate('/')
    //   }, 3000)
    // }
  }, [isLoggingOut])

  let content

  if (isLoggingOut) {
    content =
      (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress size={74} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h9"  >
                  Logging
                </Typography>
                <Typography variant="h9"  >
                  out...
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>)
  }

  return content

}

export default UserLogout