import React, { useEffect, useState, useRef } from 'react'
import { useAddNewUserMutation } from './UserApiSlice'
import { Link, useNavigate } from 'react-router-dom'
import { FormControl, MenuItem, Paper, Box, FormHelperText, InputLabel, FormGroup, FormLabel, Select, Typography, Button } from '@mui/material'
import UserInputField from '../../components/UserInputField'
import LinkButton from '../../components/LinkButton'
import { USER_REGEX, PASSWORD_REGEX, EMAIL_REGEX } from '../../config/regex'
import userInputs from '../../config/userInputs'


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
  const [role, setRole] = useState('')


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

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', m: 1 }}>
      <Paper
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          minWidth: '320px',
          width: '400px',
          pt: '20px',
          pb: '20px',
        }}
      >
        <Box sx={{ pb: '40px' }}>
          <Typography sx={{ fontSize: '1.7rem' }} textAlign='center'>Create Account</Typography>
        </Box>
        {isError ?
          <Typography>{error?.data?.message}</Typography>
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
          <UserInputField userInputs={userInputs.username} state={username} setState={setUsername} validation={validUsername} />
          <UserInputField userInputs={userInputs.email} state={email} setState={setEmail} validation={validEmail} />
          <UserInputField userInputs={userInputs.password} state={password} setState={setPassword} validation={validPassword} />
          <UserInputField userInputs={userInputs.confirm} state={confirm} setState={setConfirm} validation={validConfirm} />


          <FormControl sx={{ m: 3, width: 130 }}>
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
            <Button variant='contained' onClick={handleBack}>Back</Button>
            <Button
              variant='contained'
              sx={{ ml: '10px' }}
              disabled={canSave ? false : true}
              onClick={handleSave}
            >Submit</Button>

          </Box>
        </Box>

      </Paper >
    </Box>
  )
}

export default NewUserPage