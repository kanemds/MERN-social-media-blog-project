import React, { useEffect, useState, useRef } from 'react'
import { useAddNewUserMutation } from './UserApiSlice'
import { Link, useNavigate } from 'react-router-dom'
import { FormControl, MenuItem, IconButton, CardMedia, Paper, Modal, Box, FormHelperText, InputLabel, FormGroup, FormLabel, Select, Typography, Button } from '@mui/material'
import UserInputField from '../../components/UserInputField'
import { USER_REGEX, PASSWORD_REGEX, EMAIL_REGEX } from '../../config/regex'
import userInputs from '../../config/userInputs'
import LinkButton from '../../components/LinkButton'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ImageEditor from '../../components/imageEditor/ImageEditor'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  height: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
}


const RegisterPage = () => {

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



  const [avatarImage, setAvatarImage] = useState({
    name: null,
    url: null
  })
  const [croppedImg, setCroppedImg] = useState({
    file: null,
    url: null
  })
  const [open, setOpen] = React.useState(false)
  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [confirm, setConfirm] = useState('')
  const [validConfirm, setValidConfirm] = useState(false)
  const [role, setRole] = useState('User')


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

    const formData = new FormData()

    if (croppedImg.file !== null) {
      formData.append("avatar", croppedImg.file)
    }

    await addNewUser(formData)
    if (canSave) {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('role', role)
      formData.append("avatar", croppedImg.file)

      await addNewUser(formData)
      // await addNewUser({ username, email, password, role, croppedImg })
    }
  }

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setAvatarImage({
      name: null,
      url: null
    })
  }

  const onDataSelect = (e) => {

    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files
      const name = files[0].name
      setAvatarImage({ name, url: URL.createObjectURL(files[0]) })
      setOpen(true)
      e.target.value = ''
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center', height: '100%', m: 1 }}>
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
        <Box x={{ pb: '40px', }} textAlign='center'>
          <Typography sx={{ fontSize: '1.7rem' }}>Create Account</Typography>
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
          <Box sx={{ height: 200, width: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <IconButton disableRipple component="label" onChange={onDataSelect} sx={{ height: 200, width: 200, p: 0 }}>
              {croppedImg.url ?
                <CardMedia
                  sx={{ height: 166.67, width: 166.67, borderRadius: '50%', p: 0, objectFit: 'initial' }}
                  component="img"
                  image={croppedImg.url}
                /> :
                <AccountCircleIcon sx={{ fontSize: 200, p: 0, color: '#bdbdbd' }} />
              }

              <input type="file" accept='image/*' hidden />
              <CameraAltIcon color="primary" sx={{ position: 'absolute', right: 40, bottom: 20, fontSize: '30px' }} />
            </IconButton>
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <ImageEditor avatarImage={avatarImage} setAvatarImage={setAvatarImage} setCroppedImg={setCroppedImg} handleClose={handleClose} setOpen={setOpen} />
            </Box>
          </Modal>

          <UserInputField userInputs={userInputs.username} state={username} setState={setUsername} validation={validUsername} />
          <UserInputField userInputs={userInputs.email} state={email} setState={setEmail} validation={validEmail} />
          <UserInputField userInputs={userInputs.password} state={password} setState={setPassword} validation={validPassword} />
          <UserInputField userInputs={userInputs.confirm} state={confirm} setState={setConfirm} validation={validConfirm} />


          <Box sx={{ mt: '30px' }}>
            <Button
              variant='contained'
              onClick={handleBack}
            >Back</Button>
            <Button
              variant='contained'
              sx={{ ml: '10px' }}
              // disabled={canSave ? false : true}

              onClick={handleSave}
            >Submit</Button>
          </Box>
        </Box>

      </Paper >
    </Box>
  )
}


export default RegisterPage