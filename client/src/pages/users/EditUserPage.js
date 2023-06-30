import React, { useEffect, useState, useRef } from 'react'
import { useAddNewUserMutation } from './UserApiSlice'
import { Link, useNavigate } from 'react-router-dom'
import { FormControl, MenuItem, Paper, Box, FormHelperText, InputLabel, FormGroup, FormLabel, Select, Typography, Button } from '@mui/material'
import UserInputField from '../../components/UserInputField'
import LinkButton from '../../components/LinkButton'


const USER_REGEX = /^[A-z]{4,}$/

// const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-zA-Z]).{4,}$/

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

const inputs = {
  username: {
    placeholder: 'Username',
    text: 'Please enter a username with at least 4 characters',
    error: 'Please enter a valid username',
    correct: '',
    type: 'text'
  },
  email: {
    placeholder: 'Email',
    text: 'Please enter a valid email',
    error: 'Invalid email, please try again',
    correct: '',
    type: 'email'
  },
  password: {
    placeholder: 'Password',
    text: 'Password must be at least 8 characters, and contain both letters and numbers.',
    error: 'Invalid password, please include at least one capital character and one number',
    correct: '',
    type: 'password'
  },
  confirm: {
    placeholder: 'Confirm Password',
    text: 'Please enter your password again',
    error: 'Please match with your password',
    correct: '',
    type: 'password'
  },
}


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



  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [confirm, setConfirm] = useState('')
  const [validConfirm, setValidConfirm] = useState(false)
  const [role, setRole] = useState('User')

  console.log(username)
  console.log(email)
  console.log(password)
  console.log(role)

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email))
  }, [email])

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    if (confirm.length) {
      const match = confirm === password
      setValidConfirm(match)
    } else {
      setValidConfirm(false)
    }
  }, [confirm, password])


  const canSave = [role, validEmail, validPassword, validUsername, validConfirm].every(Boolean) && !isLoading

  const handleSave = async (e) => {
    e.preventDefault()
    if (canSave) {
      await addNewUser({ username, email, password, role })
    }
  }


  const handleChange = (event) => {
    setRole(event.target.value)
  }

  return (

    <Paper
      component="form"
      noValidate
      autoComplete="off"
      sx={{
        width: '50%',
        p: '50px',
        pb: '100px',

      }}
    >
      <Box sx={{ pb: '40px' }}>
        <Typography variant='h4'>CREATE AN ACCOUNT</Typography>
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


        <UserInputField inputs={inputs.username} state={username} setState={setUsername} validation={validUsername} />
        <UserInputField inputs={inputs.email} state={email} setState={setEmail} validation={validEmail} />
        <UserInputField inputs={inputs.password} state={password} setState={setPassword} validation={validPassword} />
        <UserInputField inputs={inputs.confirm} state={confirm} setState={setConfirm} validation={validConfirm} />


        <FormControl sx={{ m: 3, width: 120 }}>
          <InputLabel>Select Role</InputLabel>
          <Select
            value={role}
            onChange={handleChange}
            autoWidth
            label="Select Role"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value='User'>User</MenuItem>
            <MenuItem value='Employee'>Employee</MenuItem>
            <MenuItem value='Admin'>Admin</MenuItem>
          </Select>
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
}

export default NewUserPage