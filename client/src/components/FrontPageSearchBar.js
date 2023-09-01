import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import FilledInput from '@mui/material/FilledInput'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import SearchIcon from '@mui/icons-material/Search'
import { Button, AppBar, IconButton } from '@mui/material'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import DehazeIcon from '@mui/icons-material/Dehaze'


const IconButtonStyle = {
  width: '40px', height: '40px'
}
export default function FrontPageSearchBar({ handleMenu }) {




  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', mt: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%', ml: '24px' }}>
        <IconButton style={IconButtonStyle} color="primary" onClick={handleMenu} >
          <DehazeIcon color='primary' />
        </IconButton>
      </Box>
      <FormControl sx={{ display: 'flex', flexDirection: 'row', width: '100%', mr: 'calc(40% - 64px)' }}>
        <OutlinedInput
          sx={{ width: '100%' }}
          autoComplete='true'
          placeholder='Search Posts...'
          startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
        />
        <Button variant='contained'><SearchIcon /></Button>
      </FormControl>

    </Box >

  )
}