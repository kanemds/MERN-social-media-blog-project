import React, { useEffect, useState, useRef } from 'react'
import { useUpdateUserMutation, useGetUsersQuery } from './UserApiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { FormControl, MenuItem, Paper, Box, InputLabel, Select, Typography, Button } from '@mui/material'
import UserInputField from '../../components/UserInputField'
import LinkButton from '../../components/LinkButton'
import { useSelector } from 'react-redux'
import { selectUserById } from './UserApiSlice'
import LoadingSpinner from '../../components/LoadingSpinner'
import { USER_REGEX, PASSWORD_REGEX, EMAIL_REGEX } from '../../config/regex'
import userInputs from '../../config/userInputs'
import ToggleButton from '../../components/ToggleButton'



const EditUserForm = ({ currentUser }) => {


  const [updateUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }
  ] = useUpdateUserMutation()

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



  const [username, setUsername] = useState(currentUser?.username)
  const [validUsername, setValidUsername] = useState(false)
  const [email, setEmail] = useState(currentUser?.email)
  const [validEmail, setValidEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [confirm, setConfirm] = useState('')
  const [validConfirm, setValidConfirm] = useState(false)
  const [role, setRole] = useState(currentUser?.role)
  const [active, setActive] = useState(currentUser?.active)



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
      await updateUser({ username, email, password, role })
    }
  }


  const handleChange = (event) => {
    setRole(event.target.value)
  }

  let content

  if (!username.length || !email.length || !role.length) content = <LoadingSpinner />

  if (username && email && role) {

    content = (
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
          <Typography variant='h4'>EDIT ACCOUNT</Typography>
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

          <UserInputField userInputs={userInputs.username} state={username} setState={setUsername} validation={validUsername} />
          <UserInputField userInputs={userInputs.email} state={email} setState={setEmail} validation={validEmail} />
          <UserInputField userInputs={userInputs.password} state={password} setState={setPassword} validation={validPassword} />
          <UserInputField userInputs={userInputs.confirm} state={confirm} setState={setConfirm} validation={validConfirm} />

          <Typography>Status</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FormControl sx={{ m: 3, width: 120 }}>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={role}
                onChange={handleChange}
                autoWidth
                label="Select Role"
              >

                <MenuItem value='User'>User</MenuItem>
                <MenuItem value='Employee'>Employee</MenuItem>
                <MenuItem value='Admin'>Admin</MenuItem>
              </Select>
            </FormControl>
            <ToggleButton active={active} setActive={setActive} />
          </Box>

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

  return content
}

export default EditUserForm