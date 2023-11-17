import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Box, CircularProgress, Typography } from '@mui/material'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {

  const [loggingOut, setLoggingOut] = useState(true)
  const { username } = useAuth()

  console.log(username)

  const navigate = useNavigate()

  // useEffect(() => {
  //   if (loggingOut) {
  //     navigate('/')
  //   }
  // }, [])

  let content



  if (loggingOut) {
    content =
      (<Box sx={{ position: 'relative', display: 'inline-flex' }}>
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
      </Box>)
  }

  return content
}

export default UserLogout