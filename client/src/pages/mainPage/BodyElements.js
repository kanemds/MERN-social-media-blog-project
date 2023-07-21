import { Box, Button } from '@mui/material'
import React from 'react'

const BodyElements = () => {
  return (
    <Box sx={{ borderTop: 2, borderColor: 'primary.main' }}>
      <Box>
        <Button>Most Like</Button>
        <Button></Button>
        <Button></Button>
      </Box>
    </Box>
  )
}

export default BodyElements