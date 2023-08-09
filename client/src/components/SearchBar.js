import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
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
import { Button, AppBar } from '@mui/material'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
export default function SearchBar() {
  return (



    <FormControl fullWidth sx={{ display: 'flex', flexDirection: 'row' }}>

      <OutlinedInput
        autoComplete='true'
        placeholder='Search Posts...'
        startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
      />
      <Button variant='contained'><SearchIcon /></Button>


    </FormControl>



  )
}