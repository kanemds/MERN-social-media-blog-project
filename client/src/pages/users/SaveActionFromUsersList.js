import React, { useEffect, useState } from 'react'
import { Box, Fab, CircularProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { green, blue } from '@mui/material/colors'
import SaveIcon from '@mui/icons-material/Save'
import { useUpdateUserMutation } from './UserApiSlice'

const SaveActionFromUsersList = ({ user, stateActive, stateRole, role, active }) => {

  const canSave = stateActive && stateRole ? true : false



  const [
    updateUser, {
      isSuccess,
      isLoading,
      isError,
      error
    }
  ] = useUpdateUserMutation()

  const [loading, setLoading] = useState(isLoading)
  const [success, setSuccess] = useState(isSuccess)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateUser({
      id: user._id,
      username: user.username,
      email: user.email,
      role: role,
      active: active
    })
  }

  useEffect(() => {
    if (isSuccess) {
      setSuccess(true)
    }
  }, [isSuccess])


  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false)
      },
        800)
    }
  }, [success])

  return (
    <Box
      sx={{ m: 1, position: 'relative' }}
    >
      {
        success && isSuccess ? (
          <Fab
            color='primary'
            sx={{
              width: 40,
              height: 40,
              backgroundColor: green[500],
              '&:hover': { color: green[500], backgroundColor: 'white' }
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 35 }} />
          </Fab>)
          : (
            <Fab
              // color='primary'
              sx={{
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  color: 'black'
                },
                width: 40,
                height: 40,
              }}
              disabled={canSave || isLoading}
              onClick={handleSubmit}
            >
              <SaveIcon sx={{ fontSize: 35 }} />
            </Fab>)
      }
      {isLoading && (
        <CircularProgress
          size={52}
          sx={{
            color: green[500],
            position: 'absolute',
            top: -6,
            left: -6,
            zIndex: 1
          }}
        />
      )}
    </Box>
  )
}

export default SaveActionFromUsersList