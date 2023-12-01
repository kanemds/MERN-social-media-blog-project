import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import userInputs from '../../config/userInputs'
import UserInputField from '../../components/UserInputField'
import { useLocation, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { FormControl, OutlinedInput, MenuItem, Paper, Box, FormControlLabel, FormHelperText, Checkbox, InputLabel, FormGroup, FormLabel, Select, Typography, Button } from '@mui/material'
import LinkButton from '../../components/LinkButton'
import { USER_REGEX, PASSWORD_REGEX } from '../../config/regex'
import usePersist from '../../hooks/usePersist'
import { apiSlice } from '../../app/api/apiSlice'
import { resetCache } from '../blogs/blogSlice'

const LoginPage = ({ state }) => {




  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [checkUsername, setCheckUsername] = useState(false)
  const [password, setPassword] = useState('')
  const [checkPassword, setCheckPassword] = useState(false)
  const [focusedUser, setFocusedUser] = useState('')
  const [focusedPassword, setFocusedPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [persist, setPersist] = usePersist()
  const [requiredLoginMessage, setRequireLoginMessage] = useState(location.state ? location.state : '')


  // testing purpose
  // const [loading, setLoading] = useState(true)

  useEffect(() => {
    setCheckUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setCheckPassword(PASSWORD_REGEX.test(password))
  }, [password])

  const [
    login,
    {
      isLoading,
    }
  ] = useLoginMutation()

  const canSave = [username, checkUsername, checkPassword, password].every(Boolean) && !isLoading


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
    setRequireLoginMessage('')
    setUsername(e.target.value)
  }
  const handleChangePassword = (e) => {
    setRequireLoginMessage('')
    setPassword(e.target.value)
  }

  const handleShowPassword = (e) => {
    setShowPassword(e.target.checked)
  }

  const handlePersist = () => {
    setPersist(prev => !prev)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!username) {
      setFocusedUser(null)
    }
    if (!password) {
      setFocusedPassword(null)
    }

    if (canSave) {
      try {
        const { accessToken } = await login({ username, password }).unwrap()
        // after login success, will get accessToken generate by backend login controller and the refresh token will store in the cookie  
        // set auth.token = accessToken
        // dispatch(resetCache())
        // dispatch(apiSlice.util.invalidateTags(['Blog']))
        dispatch(setCredentials({ accessToken }))
        setUsername('')
        setPassword('')
        navigate('/')
      } catch (error) {
        if (!error.status) {
          setErrorMessage('No server response at the moment, please try again later')
        } else if (error.status === 400) {
          setErrorMessage('Missing username or password')
        } else if (error.status === 401) {
          setErrorMessage('User is not authorized')
        } else {
          setErrorMessage(error.data?.message)
        }
      }
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  let content

  if (isLoading) return content = <LoadingSpinner />

  // testing purpose
  // if (isLoading) return content = <LoadingSpinner />


  content = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', m: 1 }}>
      <Paper
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          minWidth: '320px',
          width: '400px',
          pt: '20px',
          pb: '20px'
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant='h8' sx={{ mb: 1 }}>{requiredLoginMessage}</Typography>
        </Box>

        <Box sx={{ pb: '40px', }} textAlign='center'>
          <Box textAlign='center'>
            <Typography sx={{ fontSize: '1.7rem' }}>Login</Typography>
          </Box>
        </Box>
        {
          errorMessage ?
            <Typography>{errorMessage}</Typography>
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

          <FormControl sx={{ width: '85%', height: '130px', }}>
            <FormLabel
              error={!username?.length && focusedUser === null ? true : username.length && focusedUser === null && !checkUsername ? true : false}
            >Username</FormLabel>
            <OutlinedInput
              required
              // placeholder=''
              onFocus={handleFocusUser}
              onBlur={handleBlurUser}
              onChange={handleChangeUser}
              value={username}
              type='text'
              error={!username?.length && focusedUser === null ? true : username.length && focusedUser === null && !checkUsername ? true : false}
            />
            <FormHelperText error>
              {!username.length && focusedUser === null ? 'Please enter a username' : username.length && focusedUser === null && !checkUsername ? 'Please enter a valid username, it must be with at least 4 characters' : ''}
            </FormHelperText>
          </FormControl>


          <FormControl sx={{ width: '85%', height: '130px', }}>
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
              {!password.length && focusedPassword === null ? 'Please enter a password' : password.length && focusedPassword === null && !checkPassword ? 'Invalid password, it must be at least 8 characters and contain both letters and numbers' : ''}
            </FormHelperText>

            <Box sx={{ pb: '50px' }}>
              <FormControlLabel control={<Checkbox onChange={handleShowPassword} />} label="Show Password" />
            </Box>

          </FormControl>

          <FormControl sx={{ width: '100%' }}>
            <FormControlLabel
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
              value='end'
              control={<Checkbox onChange={handlePersist} checked={persist} />}
              label='Keep me logged in'
              labelPlacement="end"
            />
          </FormControl>

          <Box sx={{ mt: '40px' }}>

            <Button
              variant='contained'
              sx={{ ml: '10px' }}
              onClick={handleCancel}
            >Cancel</Button>
            <Button
              variant='contained'
              sx={{ ml: '10px' }}
              onClick={handleSave}
            >Submit</Button>

          </Box>
        </Box>
      </Paper >
    </Box>
  )



  return content
}

export default LoginPage