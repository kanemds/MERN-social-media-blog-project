import React, { useEffect, useState, useRef } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { FormControl, MenuItem, Paper, Box, SvgIcon, InputLabel, Modal, Select, Typography, CardActionArea, Button, CardMedia, IconButton } from '@mui/material'
import UserInputField from '../../components/UserInputField'
import LinkButton from '../../components/LinkButton'
import LoadingSpinner from '../../components/LoadingSpinner'
import { USER_REGEX, PASSWORD_REGEX, EMAIL_REGEX } from '../../config/regex'
import userInputs from '../../config/userInputs'
import ToggleButton from '../../components/ToggleButton'
import { useUpdateUserMutation } from '../users/UserApiSlice'
import { ROLES } from '../../config/roles'
import { useRefreshMutation } from '../auth/authApiSlice'
import img from './Dtqnxj1W4AAgFut.jpg'
import CameraIcon from '@mui/icons-material/Camera'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ImageEditor from '../../components/imageEditor/ImageEditor'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

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


const UserSettingForm = ({ currentUser }) => {

  const [updateUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }
  ] = useUpdateUserMutation()


  const [
    refresh, { }
  ] = useRefreshMutation()

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
  const [showPassword, setShowPassword] = useState(false)
  const [avatarImage, setAvatarImage] = useState({
    name: null,
    url: null
  })
  const [croppedImg, setCroppedImg] = useState(null)
  const [open, setOpen] = React.useState(false)

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

  useEffect(() => {
    setPassword('')
    setConfirm('')
  }, [showPassword])


  const canSave = showPassword ? [role, validEmail, validPassword, validUsername, validConfirm, typeof active === 'boolean'].every(Boolean) && !isLoading : [role, validEmail, validUsername, typeof active === 'boolean'].every(Boolean) && !isLoading

  const handleSave = async (e) => {
    e.preventDefault()
    if (canSave) {
      const updateReady = await updateUser({ id: currentUser.id, username, email, password, role, active }).unwrap()
      if (updateReady) {
        await refresh()
      }
    }
  }

  const handleChange = (event) => {
    setRole(event.target.value)
  }

  const handleShowPassword = () => {
    setShowPassword(prev => !prev)
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
      // // turn into base64
      // const reader = new FileReader()
      // reader.readAsDataURL(files[0])
      // reader.addEventListener('load', () => {
      //   setAvatarImage({ name: files[0]?.name, url: reader.result })
      // })
    }
  }

  console.log(avatarImage)
  let content

  if (!username.length || !email.length || !role.length || typeof active !== 'boolean') content = <LoadingSpinner />

  if (username && email && role && typeof active === 'boolean') {

    content = (
      <Paper
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          minWidth: '500px',
          width: '50%',
          p: '10px',
          pb: '100px',
        }}
      >
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


        <Box sx={{ ml: '5%' }}>
          <Typography variant='h4'>EDIT ACCOUNT</Typography>
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
              {croppedImg ?
                <CardMedia
                  sx={{ height: 166.67, width: 166.67, borderRadius: '50%', p: 0, objectFit: 'initial' }}
                  component="img"
                  image={croppedImg}
                /> :
                <AccountCircleIcon sx={{ fontSize: 200, p: 0, color: '#bdbdbd' }} />
              }

              <input type="file" accept='image/*' hidden />
              <CameraAltIcon color="primary" sx={{ position: 'absolute', right: 40, bottom: 20, fontSize: '30px' }} />
            </IconButton>
          </Box>

          <UserInputField userInputs={userInputs.username} state={username} setState={setUsername} validation={validUsername} />
          <UserInputField userInputs={userInputs.email} state={email} setState={setEmail} validation={validEmail} />

          <Button onClick={handleShowPassword}>
            Update Password
          </Button>
          {showPassword ?
            (<>
              <UserInputField userInputs={userInputs.newPassword} state={password} setState={setPassword} validation={validPassword} />
              <UserInputField userInputs={userInputs.confirm} state={confirm} setState={setConfirm} validation={validConfirm} />
            </>
            )
            : ''
          }
          {currentUser.role === ROLES.Admin ?
            <>
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
            </>
            : ''}

          <Box sx={{ mt: '30px' }}>
            <Button
              variant='contained'
              sx={{ mr: '10px' }}
              disabled={canSave ? false : true}
              onClick={handleSave}
            >Submit</Button>
            <LinkButton visit='/' name={'cancel'} />
          </Box>
        </Box>
      </Paper >
    )
  }

  return content
}

export default UserSettingForm