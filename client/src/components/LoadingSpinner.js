import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingSpinner = () => {
  return (
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
        <Typography >
          Loading
        </Typography>
      </Box>
    </Box>
  )
}

export default LoadingSpinner