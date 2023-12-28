import React, { useEffect, useState, useRef } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { FormControl, MenuItem, Paper, Box, SvgIcon, InputLabel, Modal, Select, Typography, CardActionArea, Button, CardMedia, IconButton, Popover } from '@mui/material'
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
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import FlipCameraIosOutlinedIcon from '@mui/icons-material/FlipCameraIosOutlined'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'

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

const SideButton = styled(Button)({
  textTransform: 'none',
  justifyContent: "flex-start",
  borderRadius: '0px',
  '&:hover': {
    backgroundColor: '#1976d2',
    color: 'white'
  }
})

const ButtonInfo = styled(Typography)({
  textAlign: 'left',
  marginLeft: 12
})



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
  const [open, setOpen] = useState(false)
  const [avatarImage, setAvatarImage] = useState({
    name: null,
    url: null
  })
  const [croppedImg, setCroppedImg] = useState(currentUser?.avatar ? {
    file: null,
    url: currentUser?.avatar
  } :
    null
  )
  const [anchorEl, setAnchorEl] = useState(null)

  const popOpen = Boolean(anchorEl)
  const id = popOpen ? 'simple-popover' : undefined

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


  const canSave = showPassword ? [role, validEmail, validPassword, validUsername, validConfirm, typeof active === 'boolean'].every(Boolean) : [role, validEmail, validUsername, typeof active === 'boolean'].every(Boolean)

  const handleSave = async (e) => {
    e.preventDefault()
    // const formData = new FormData()
    // formData.append("avatar", croppedImg.file)
    // const updateReady = await updateUser(formData).unwrap()
    // console.log(updateReady)
    if (canSave) {
      const formData = new FormData()
      formData.append('id', currentUser?.id)
      formData.append('username', username)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('active', active)
      formData.append('role', role)
      if (croppedImg !== null) {
        formData.append("avatar", croppedImg.file)
      }
      // const updateReady = await updateUser({ id: currentUser.id, username, email, password, role, active }).unwrap()
      const updateReady = await updateUser(formData).unwrap()
        .catch(error => {
          console.error('Error while updating user:', error)
        })
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

  const handlePopClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopClose = () => {
    setAnchorEl(null)
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



  return (
    <Paper
      component="form"
      noValidate
      autoComplete="off"
      sx={{
        minWidth: '320px',
        width: '400px',
        pt: '20px',
        pb: '20px',
      }
      }
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
      {
        isError ?
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
          {croppedImg ?
            <IconButton disableRipple component="label" onClick={handlePopClick} sx={{ height: 200, width: 200, p: 0 }}>
              <CardMedia
                sx={{ height: 166.67, width: 166.67, borderRadius: '50%', p: 0, objectFit: 'initial' }}
                component="img"
                image={croppedImg.url}
              />

              <CameraAltIcon color="primary" sx={{ position: 'absolute', right: 40, bottom: 20, fontSize: '30px' }} />
            </IconButton>
            :
            <IconButton disableRipple component="label" onChange={onDataSelect} sx={{ height: 200, width: 200, p: 0 }}>
              <AccountCircleIcon sx={{ fontSize: 200, p: 0, color: '#bdbdbd' }} />
              <input type="file" accept='image/*' hidden />
              <CameraAltIcon color="primary" sx={{ position: 'absolute', right: 40, bottom: 20, fontSize: '30px' }} />
            </IconButton>
          }
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
              <FormControl sx={{ m: 3, width: 130 }}>
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
          <LinkButton visit='/' name={'cancel'} />
          <Button
            variant='contained'
            sx={{ ml: '10px' }}
            disabled={canSave ? false : true}
            onClick={handleSave}
          >Submit</Button>

        </Box>
      </Box>
      <Popover
        id={id}
        open={popOpen}
        anchorEl={anchorEl}
        onClose={handlePopClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}

      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <SideButton disableRipple component="label" onChange={onDataSelect} onClick={handlePopClose}>
            <input type="file" accept='image/*' hidden />
            <FlipCameraIosOutlinedIcon />
            <ButtonInfo >Edit photo</ButtonInfo>
          </SideButton>
          <SideButton  >
            <DeleteForeverRoundedIcon />
            <ButtonInfo >Remove photo</ButtonInfo>
          </SideButton>
        </Box>
      </Popover>
    </Paper >
  )
}

export default UserSettingForm