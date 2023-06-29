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

export default function ToggleButton(props) {

  const { active } = props

  const [checked, setChecked] = React.useState(active)

  const handleChange = (event) => {
    setChecked(event.target.checked)
  }

  return (
    <FormControlLabel
      sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}
      control={<ColorSwitch
        checked={checked}
        onChange={handleChange}
      />}
      label={checked ? 'Active' : 'Inactive'}
    />


  )
}