import React from 'react'
import { Typography } from '@mui/material'

const ErrorMessage = ({ error }) => {
  return (
    <Typography>{error?.data ? error?.data?.message : 'Network error ocurred, please try again later'}</Typography>
  )
}

export default ErrorMessage