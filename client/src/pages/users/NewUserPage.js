import React, { useEffect, useState, useRef } from 'react'
import { useAddNewUserMutation } from './UserApiSlice'
import { useNavigate } from 'react-router-dom'
import { FormControl, OutlinedInput, Box, FormHelperText, InputLabel, FormGroup, FormLabel } from '@mui/material'
import UserInputField from '../../components/UserInputField'




const NewUserPage = () => {

  const [
    addNewUser,
    {
      isLoading,
      isSuccess,
      isError,
      error
    }
  ] = useAddNewUserMutation()

  const navigate = useNavigate()






  useEffect(() => {
    if (isSuccess) {
      setUsername('')
      setEmail('')
      setPassword('')
      setRole('')
      navigate('/')
    }
  }, [isSuccess, navigate])

  //  ======================REGEX=============================

  const USER_REGEX = /^[A-z]{4,20}$/

  const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

  const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  //  ======================REGEX=============================

  //  ======================store input=============================

  const [focused, setFocused] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)
  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [role, setRole] = useState('User')

  //  ======================store input=============================

  //  ======================check validation=============================

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setEmail(EMAIL_REGEX.test(email))
  }, [email])

  useEffect(() => {
    setPassword(PASSWORD_REGEX.test(password))
  }, [password])

  //  ======================check validation=============================

  //  ======================handler=============================

  const handleFocus = (inputName) => {
    setFocusedInput(inputName)
  }

  const handleBlur = () => {
    setFocusedInput(null)

  }

  const isInputFocused = (inputName) => {
    return focusedInput === inputName
  }



  const handleUsername = (e) => { setUsername(e.target.value) }
  const handleEmail = (e) => { setEmail(e.target.value) }
  const handlePassword = (e) => { setPassword(e.target.value) }


  const canSave = [role, validEmail, validPassword, validUsername].every(Boolean) && !isLoading

  const handleSave = async (e) => {
    e.preventDefault()
    if (canSave) {
      await addNewUser({ username, email, password, role })
    }
  }

  //  ======================handler=============================

  //  ======================messages=============================
  const inputs = {
    username: {
      placeholder: 'Username',
      text: 'Please enter your username',
      error: 'Username must be at least 4 characters'
    },
    email: {
      placeholder: 'Email',
      text: 'Please enter your email',
      error: 'Invalid email, please try again'
    },
    password: {
      placeholder: 'Password',
      text: 'Please enter your password',
      error: 'Invalid password, please include at least one capital character and one number'
    },
    confirm: {
      placeholder: 'Confirm Password',
      text: 'Please enter your password again',
      error: 'Please match with your password'
    },
  }

  //  ======================messages=============================



  const inputKeys = Object.keys(inputs)



  // console.log(sortedKeys)

  return (
    <>
      <Box component="form" noValidate autoComplete="off">
        {inputKeys.map(keyName => {

          console.log(inputs[keyName])
          return (
            < FormControl key={keyName} sx={{ width: '25ch' }
            }>
              <FormLabel>{inputs[keyName]?.placeholder}</FormLabel>
              <OutlinedInput
                placeholder={inputs[keyName]?.placeholder}
                onFocus={() => handleFocus(inputs[keyName]?.username)}
                onBlur={handleBlur}

              />
              <FormHelperText> {inputs[keyName]?.text}</FormHelperText>
            </FormControl>)
        })}

      </Box >
    </>
  )
}

export default NewUserPage