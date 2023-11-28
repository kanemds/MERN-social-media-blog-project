import React, { useRef, useState, useEffect } from 'react'
import { FormControl, FormLabel, Checkbox, FormControlLabel } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { green, blue, red } from '@mui/material/colors'
import { useLocation } from 'react-router-dom'

export default function UserInputField({ userInputs, state, setState, validation }) {


  const { placeholder, text, error, correct, type } = userInputs

  const [focusedInput, setFocusedInput] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleFocus = (inputName) => {
    setFocusedInput(inputName)
  }

  const handleBlur = () => {
    setFocusedInput(null)
  }

  const handleChange = (e) => {
    setState(e.target.value)
  }

  const handleShowPassword = (e) => {
    setShowPassword(e.target.checked)
  }
  const handleShowConfirm = (e) => {
    setShowConfirm(e.target.checked)
  }

  return (

    <FormControl sx={{ width: '85%', height: `${type === 'password' ? '180px' : '130px'}` }}>
      <FormLabel
        error={state?.length && !validation && focusedInput === null ? true : false}
      >{placeholder}*</FormLabel>
      <OutlinedInput
        required
        placeholder={placeholder}
        onFocus={() => handleFocus(placeholder)}
        onBlur={handleBlur}
        onChange={handleChange}
        value={state}
        type={
          type === 'password' && showPassword ? 'text' :
            type === 'password' && showConfirm ? 'text' :
              type
        }
        error={state?.length && !validation && focusedInput === null ? true : false}

        endAdornment={
          validation ? <RadioButtonCheckedIcon position="end" sx={{ color: green[500] }} />
            : ''
        }
      />
      <FormHelperText>
        {validation ? correct : state.length && !validation && focusedInput === null ? error : text}
      </FormHelperText>
      <Box sx={{ pb: '50px' }}>
        {placeholder === 'Password' || placeholder === 'New Password' ?
          <FormControlLabel control={<Checkbox onChange={handleShowPassword} />} label="Show Password" /> :
          placeholder === 'Confirm Password' ?
            <FormControlLabel control={<Checkbox onChange={handleShowConfirm} />} label="Show Confirm Password" />
            : ''
        }
      </Box>

    </FormControl>

  )
}