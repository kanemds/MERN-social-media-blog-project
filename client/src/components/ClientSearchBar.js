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
import { Button, AppBar, Icon, Paper, InputBase, Divider, Typography } from '@mui/material'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import useAuth from '../hooks/useAuth'
import MenuIcon from '@mui/icons-material/Menu'
import DirectionsIcon from '@mui/icons-material/Directions'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

export default function ClientSearchBar({ setSearchInput, searchInput, isSearch, isSelectedDate, handleSearch, handleClearFromSearch, handleClearFromSelectedDate }) {

  const handleChange = (e) => {
    setSearchInput(e.target.value)
  }
  const handleClear = (e) => {
    if (isSearch) {
      handleClearFromSearch()
    } else {
      setSearchInput('')
    }
  }


  return (

    // <Paper
    //   component="form" sx={{ display: 'flex', flexDirection: 'row' }}>
    //   {/* <Button variant='contained' onClick={handleSearch}><SearchIcon /></Button> */}
    //   <OutlinedInput
    //     sx={{ width: '100%', padding: 0 }}
    //     value={searchInput}
    //     onChange={handleChange}
    //     autoComplete='true'
    //     placeholder='Search...'
    //     startAdornment={<InputAdornment position="start" ><IconButton onClick={handleSearch} variant='contained' ><SearchIcon /></IconButton></InputAdornment>}
    //     endAdornment={
    //       searchInput.length ?
    //         <InputAdornment position="end">
    //           <IconButton onClick={handleClear}>
    //             <ClearOutlinedIcon />
    //           </IconButton>
    //         </InputAdornment>
    //         : ''}
    //   />
    <Box
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', border: 'solid 2px #1976d2', borderRadius: '5px' }}
    >

      <IconButton size='small' type="button" aria-label="search" onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <InputBase
        value={searchInput}
        sx={{ ml: 1, flex: 1 }}
        placeholder='Search...'
        inputProps={{ 'aria-label': 'Search...' }}
        onChange={handleChange}
      />

      {searchInput || isSearch ?
        <IconButton size='small' type="button" aria-label="clear search" onClick={handleClear}>
          <ClearOutlinedIcon />
        </IconButton>
        :
        ''
      }

      {isSelectedDate ?
        <> <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton type="button" aria-label="clear date"
            size='small'
            variant='contained'
            sx={{ backgroundColor: '#ef5350', '&:hover': { backgroundColor: 'red' }, color: 'white' }}
            onClick={handleClearFromSelectedDate}>
            <CalendarMonthIcon />

          </IconButton></>
        : ''
      }

    </Box>

    // </Paper>
  )
}