import React, { useState } from 'react'
import { Box, Fab, CircularProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { green, blue } from '@mui/material/colors'
import SaveIcon from '@mui/icons-material/Save'

const SaveActionFromUsersList = ({ params, rowId, setRowId }) => {



  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <Box
      sx={{ m: 1, position: 'relative' }}
    >
      {
        isSuccess ? (
          <Fab
            color='primary'
            sx={{
              width: 40,
              height: 40,
              backgroundColor: green[500],
              '&:hover': { backgroundColor: 'white' }
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 35, '&:hover': { color: green[500] } }} />
          </Fab>)
          : (
            <Fab
              color='primary'
              sx={{
                width: 40,
                height: 40,
              }}
              disabled={params.id !== rowId || loading}
              // disabled={false}
              onClick={handleSubmit}
            >
              <SaveIcon sx={{ fontSize: 35 }} />
            </Fab>)
      }
      {loading && (
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