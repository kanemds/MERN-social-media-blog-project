import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import userInputs from '../../config/userInputs'
import UserInputField from '../../components/UserInputField'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { FormControl, OutlinedInput, MenuItem, Paper, Box, FormControlLabel, FormHelperText, Checkbox, InputLabel, FormGroup, FormLabel, Select, Typography, Button } from '@mui/material'
import LinkButton from '../../components/LinkButton'

const LoginPage = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [focusedUser, setFocusedUser] = useState('')
  const [focusedPassword, setFocusedPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // testing purpose
  // const [loading, setLoading] = useState(true)

  const [
    login,
    {
      isSuccess,
      isLoading,
      isError,
      error
    }
  ] = useLoginMutation()

  const canSave = [username, password].every(Boolean) && !isLoading

  const handleSave = async (e) => {
    e.preventDefault()
    if (canSave) {
      await login({ username, password })
    }
  }

  const handleFocusUser = () => {
    setFocusedUser(username)
  }

  const handleFocusPassword = () => {
    setFocusedPassword(password)
  }

  const handleBlurUser = () => {
    setFocusedUser(null)
  }

  const handleBlurPassword = () => {
    setFocusedPassword(null)
  }

  const handleChangeUser = (e) => {
    setUsername(e.target.value)
  }
  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleShowPassword = (e) => {
    setShowPassword(e.target.checked)
  }


  let content

  if (isLoading) return content = <LoadingSpinner />

  // testing purpose
  // if (isLoading) return content = <LoadingSpinner />


  content = (
    <Paper
      component="form"
      noValidate
      autoComplete="off"
      sx={{
        minWidth: '500px',
        width: '50%',
        p: '50px',
        pb: '100px',

      }}
    >
      <Box sx={{ pb: '40px' }}>
        <Typography variant='h4'>Login</Typography>
      </Box>
      {isError ?
        <Typography>{error}</Typography>
        : ''
      }
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

        <FormControl sx={{ minWidth: '420px', width: '85%', height: '130px' }}>
          <FormLabel
            error={!username?.length && focusedUser === null ? true : false}
          >Username</FormLabel>
          <OutlinedInput
            required
            // placeholder=''
            onFocus={handleFocusUser}
            onBlur={handleBlurUser}
            onChange={handleChangeUser}
            value={username}
            type='text'
            error={!username?.length && focusedUser === null ? true : false}
          />
          <FormHelperText error>
            {!username.length && focusedUser === null ? 'Please enter username' : ''}
          </FormHelperText>
        </FormControl>


        <FormControl sx={{ minWidth: '420px', width: '85%', height: '130px' }}>
          <FormLabel
            error={!password?.length && focusedPassword === null ? true : false}
          >Password</FormLabel>
          <OutlinedInput
            required
            // placeholder=''
            onFocus={handleFocusPassword}
            onBlur={handleBlurPassword}
            onChange={handleChangePassword}
            value={password}
            type={showPassword ? 'text' : 'password'}
            error={!password?.length && focusedPassword === null ? true : false}
          />
          <FormHelperText error>
            {!password.length && focusedPassword === null ? 'Please enter password' : ''}
          </FormHelperText>

          <Box sx={{ pb: '50px' }}>
            <FormControlLabel control={<Checkbox onChange={handleShowPassword} />} label="Show Password" />
          </Box>
        </FormControl>

        <Box sx={{ mt: '30px' }}>
          <Button
            variant='contained'
            sx={{ mr: '10px' }}
            disabled={canSave ? false : true}
            onClick={handleSave}
          >Submit</Button>
          <LinkButton name={'cancel'} />
        </Box>
      </Box>

    </Paper >
  )



  return content
}

export default LoginPage