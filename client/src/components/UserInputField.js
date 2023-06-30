import React, { useRef, useState } from 'react'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'

export default function UserInputField({ placeholder }) {
  const [focusedInput, setFocusedInput] = useState(null)


  const handleFocus = (inputName) => {
    setFocusedInput(inputName)
  }

  const handleBlur = () => {
    setFocusedInput(null)

  }

  const isInputFocused = (inputName) => {
    return focusedInput === inputName
  }



  return (
    <Box component="form" noValidate autoComplete="off">
      <FormControl sx={{ width: '25ch' }}>
        <OutlinedInput
          placeholder={placeholder}
          onFocus={() => handleFocus(placeholder)}
          onBlur={handleBlur}

        />
        <FormHelperText>
          {isInputFocused(placeholder) ? '' : 'Helper text'}
        </FormHelperText>
      </FormControl>
    </Box>
  )
}