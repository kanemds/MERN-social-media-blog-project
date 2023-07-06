import * as React from 'react'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { green, pink } from '@mui/material/colors'
import { alpha, styled } from '@mui/material/styles'


const ColorSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[500],
    '&:hover': {
      backgroundColor: alpha(pink[500], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: pink[500],
  },
}))

export default function ToggleButton({ active, setActive }) {

  // console.log('button', active)
  const handleChange = (event) => {
    // console.log('event', event.target.checked)
    return setActive(event.target.checked)
  }



  return (
    <FormControlLabel
      sx={{ display: 'flex', alignItems: 'center', width: 120, justifyContent: 'space-between' }}
      control={<ColorSwitch
        checked={active}
        onChange={handleChange}
      />}
      label={active ? 'Active' : 'Inactive'}
    />


  )
}