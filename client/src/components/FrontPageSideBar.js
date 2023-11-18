import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, IconButton, List, Typography, SwipeableDrawer, FormControlLabel, Switch, Collapse, Paper, Grow, Toolbar, AppBar, SvgIcon } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import ActiveCalender from '../pages/blogs/ActiveCalender'
import DehazeIcon from '@mui/icons-material/Dehaze'
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import PostAddIcon from '@mui/icons-material/PostAdd'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import RecommendIcon from '@mui/icons-material/Recommend'
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Modal from '@mui/material/Modal'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useMediaQuery } from '@mui/material'
import useAuth from '../hooks/useAuth'
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { SideBarContext } from '../useContext/SideBarContext'
import { messages } from '../config/requireLoginMessage'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useGetUsersQuery } from '../pages/users/UserApiSlice'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'

const SideButton = styled(Button)({
  textTransform: 'none',
  justifyContent: "flex-start",

})

const ButtonInfo = styled(Typography)({
  textAlign: 'left',
  marginLeft: 12
})

const Section = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
})

const Divider = styled(Box)({
  height: '100%',
  maxWidth: '240px',
  borderTop: '1px solid lightGrey',
  marginTop: 12,
  marginBottom: 12,
})

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '5%',
  border: '2px solid #bdbdbd',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  justifyContent: 'center',
}

const IconButtonStyle = {
  width: '40px', height: '40px'
}


const FrontPageSideBar = () => {


  const largeBP = useMediaQuery('(min-width:1300px)')
  const mediumBP = useMediaQuery('(max-width:1299px)')
  const small = useMediaQuery('(max-width:791px)')


  const { state, setState, drawerDirection, toggleDrawer } = useContext(SideBarContext)
  const navigate = useNavigate()
  const { username, userId } = useAuth()
  const { id } = useParams()
  const { pathname } = useLocation()

  const { currentUser } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      currentUser: data?.entities[userId]
    })
  })


  const [checked, setChecked] = useState(false)
  const [showBack, setShowBack] = useState(false)
  const [showCalendar, setShowCalendar] = useState(true)
  const [open, setOpen] = React.useState(false)
  const [isShow, setIsShow] = useState(true)
  const [keepOpen, setKeepOpen] = useState(true)
  const [hiddenSideBar, setHiddenSideBar] = useState(false)


  useEffect(() => {
    if (pathname === `/blogs/post/${id}` || pathname === `/blogs/post/edit/${id}`) {
      setChecked(true)
    } else {
      setChecked(false)
    }

    if (pathname !== '/') {
      setShowBack(true)
    }

    if (pathname.includes('/setting')) {
      setShowCalendar(false)
    }
  }, [pathname])


  useEffect(() => {


    if (!largeBP) {
      setIsShow(false)
    }
    if (largeBP) {
      setIsShow(true)
      setState({ ...state, left: false })
    }

  }, [largeBP])



  const handleMenu = () => {
    if (largeBP) {
      setIsShow(prev => !prev)
      setKeepOpen(prev => !prev)
    } else {
      setKeepOpen(prev => !prev)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleToHome = () => {
    navigate('/')
  }
  const handleToMyPost = () => {
    if (username) {
      navigate('/blogs')
    } else {
      navigate('/login', { state: messages.user })
    }

  }
  const handleToEdit = () => {
    if (username) {
      navigate(`/blogs/post/edit/${id}`)
    } else {
      navigate('/login', { state: messages.user })
    }
  }
  const handleToCreatePost = () => {
    if (username) {
      navigate('/blogs/new')
    } else {
      navigate('/login', { state: messages.user })
    }
  }
  const handleToSubscribed = () => {
    if (username) {
      navigate('/blogs/subscribed')
    } else {
      navigate('/login', { state: messages.user })
    }
  }
  const handleToBookmark = () => {
    if (username) {
      navigate('/blogs/bookmarks')
    } else {
      navigate('/login', { state: messages.user })
    }
  }
  const handleToLiked = () => {
    if (username) {
      navigate('/blogs/liked')
    } else {
      navigate('/login', { state: messages.user })
    }
  }
  const handleToSetting = () => {
    if (username) {
      navigate(`/setting/${userId}`)
    } else {
      navigate('/login', { state: messages.user })
    }
  }

  const handleToUsersSetting = () => {
    if (currentUser?.role === 'Admin') {
      navigate('/dash/users')
    }
  }
  const handleToCreateNewUser = () => {
    if (currentUser?.role === 'Admin') {
      navigate('/dash/users/new')
    }
  }

  const handleToBack = () => {
    navigate(-1)
  }

  const iconEdit = (
    <SideButton onClick={handleToEdit}>
      <SvgIcon>
        <svg
          viewBox='-2 0 24 24'
        >
          <EditNoteIcon />
        </svg>
      </SvgIcon>
      <ButtonInfo >Edit Post</ButtonInfo>
    </SideButton>
  )
  const iconBack = (
    <SideButton onClick={handleToBack}>
      {/* <SubdirectoryArrowRightOutlinedIcon /> */}
      <ForwardRoundedIcon style={{ transform: 'rotate(180deg)' }} />
      <ButtonInfo >Back</ButtonInfo>
    </SideButton>
  )

  const list = (anchor) => (
    <Box

      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box sx={{ height: '70px', width: '100%', background: '#1976d2' }}>

      </Box>

      <List sx={{ pl: 2, pr: 2 }}>
        <IconButton style={IconButtonStyle} color="primary" onClick={handleMenu} >
          <DehazeIcon color='primary' />
        </IconButton>
        <Divider />
        <Section >
          <SideButton onClick={handleToHome}>
            <HomeIcon />
            <ButtonInfo >Home</ButtonInfo>
          </SideButton>
          {showBack ?
            < Grow
              in={showBack}
              style={{ transformOrigin: '0 0 0' }}
              {...(showBack ? { timeout: 800 } : { timeout: 600 })}
            >
              {iconBack}
            </Grow>
            : ''
          }
        </Section>

        {showCalendar ?
          <>
            <Divider />
            <ActiveCalender />
          </>
          : ''
        }

        <Divider />
        <Section >
          <SideButton onClick={handleToMyPost}>
            <ArticleOutlinedIcon />
            <ButtonInfo >My Post(s)</ButtonInfo>
          </SideButton>
          {checked && username ?
            <Grow
              in={checked}
              style={{ transformOrigin: '0 0 0' }}
              {...(checked ? { timeout: 800 } : { timeout: 600 })}
            >
              {iconEdit}
            </Grow>
            : ''
          }
          <SideButton onClick={handleToCreatePost}>
            <PostAddIcon />
            <ButtonInfo> Create a Post</ButtonInfo>
          </SideButton>
        </Section>
        <Divider />
        <Section >
          <SideButton onClick={handleToSubscribed} >
            <Diversity2OutlinedIcon />
            <ButtonInfo> Subscribers</ButtonInfo>
          </SideButton>
          <SideButton >
            <StarRoundedIcon onClick={handleToBookmark} />
            <ButtonInfo>  Bookmarks</ButtonInfo>
          </SideButton>
          <SideButton onClick={handleToLiked}>
            <SvgIcon sx={{ fontSize: '1.3rem', width: '24px' }} >
              <svg
                viewBox='0 0 24 24'
              >
                <FavoriteIcon color='primary' />
              </svg>
            </SvgIcon>
            <ButtonInfo>  Liked</ButtonInfo>
          </SideButton>
        </Section>
        {currentUser?.role === 'Admin' ?
          <>
            <Divider />
            <Typography sx={{ p: '6px 8px ' }}>Admin management</Typography>
            <Section>
              <SideButton onClick={handleToUsersSetting}>
                <ManageAccountsIcon />
                <ButtonInfo >  Users management</ButtonInfo>
              </SideButton>
            </Section>

            <Section>
              <SideButton onClick={handleToCreateNewUser}>
                <PersonAddIcon />
                <ButtonInfo >  Create new user</ButtonInfo>
              </SideButton>
            </Section>
          </>
          : ''}
        <Divider />
        <Section>
          <SideButton onClick={handleToSetting}>
            <SettingsIcon />
            <ButtonInfo >  Settings</ButtonInfo>
          </SideButton>
        </Section>
      </List >
    </Box >
  )

  let sideBar

  if (largeBP) {
    sideBar = (
      <Box >
        <IconButton style={IconButtonStyle} color="primary" onClick={handleMenu} >
          <DehazeIcon color='primary' />
        </IconButton>
        <Divider />
        <Section >
          <SideButton onClick={handleToHome}>
            <HomeIcon />
            <ButtonInfo >Home</ButtonInfo>
          </SideButton>
          {showBack ?
            < Grow
              in={showBack}
              style={{ transformOrigin: '0 0 0' }}
              {...(showBack ? { timeout: 800 } : { timeout: 600 })}
            >
              {iconBack}
            </Grow>
            : ''
          }
        </Section>

        {showCalendar ?
          <>
            <Divider />
            <ActiveCalender />
          </>
          : ''
        }
        <Divider />
        <Section >
          <SideButton onClick={handleToMyPost}>
            <ArticleOutlinedIcon />
            <ButtonInfo >My Post(s)</ButtonInfo>
          </SideButton>
          {checked && username ?
            <Grow
              in={checked}
              style={{ transformOrigin: '0 0 0' }}
              {...(checked ? { timeout: 800 } : { timeout: 600 })}
            >
              {iconEdit}
            </Grow>
            : ''
          }
          <SideButton onClick={handleToCreatePost}>
            <PostAddIcon />
            <ButtonInfo > Create a Post</ButtonInfo>
          </SideButton>
        </Section>
        <Divider />
        <Section >
          <SideButton onClick={handleToSubscribed} >
            <Diversity2OutlinedIcon />
            <ButtonInfo>  Subscribers</ButtonInfo>
          </SideButton>
          <SideButton onClick={handleToBookmark}>
            <StarRoundedIcon />
            <ButtonInfo>  Bookmarks</ButtonInfo>
          </SideButton>
          <SideButton onClick={handleToLiked}>
            <SvgIcon sx={{ fontSize: '1.3rem', width: '24px' }} >
              <svg
                viewBox='0 0 24 24'
              >
                <FavoriteIcon color='primary' />
              </svg>
            </SvgIcon>
            <ButtonInfo>  Liked</ButtonInfo>
          </SideButton>
        </Section>
        {currentUser?.role === 'Admin' ?
          <>
            <Divider />
            <Typography sx={{ p: '6px 8px ' }} >Admin management</Typography>
            <Section>
              <SideButton onClick={handleToUsersSetting}>
                <ManageAccountsIcon />
                <ButtonInfo >  Users management</ButtonInfo>
              </SideButton>
            </Section>

            <Section>
              <SideButton onClick={handleToCreateNewUser}>
                <PersonAddIcon />
                <ButtonInfo >  Create new user</ButtonInfo>
              </SideButton>
            </Section>
          </>
          : ''}
        <Divider />
        <Section>
          <SideButton onClick={handleToSetting}>
            <SettingsIcon />
            <ButtonInfo >  Settings</ButtonInfo>
          </SideButton>
        </Section>
      </Box >
    )
  }

  if (mediumBP || !isShow) {
    sideBar = (
      <Box sx={{ width: '40px' }}>
        <>
          {drawerDirection?.map((anchor) => {
            return (
              <Box key={anchor} >
                <IconButton style={IconButtonStyle} color="primary" onClick={mediumBP ? toggleDrawer(anchor, true) : handleMenu} >
                  <DehazeIcon color='primary' />
                </IconButton>
                <SwipeableDrawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                  onOpen={toggleDrawer(anchor, true)}
                >
                  {list(anchor)}
                </SwipeableDrawer>
              </Box>)
          }
          )}
        </>
        <Divider />
        <Section >

          <IconButton color="primary" onClick={handleToHome}>
            <HomeIcon color='primary' />
          </IconButton>

        </Section>
        {
          showBack ?
            <IconButton color="primary" onClick={handleToBack}>
              <ForwardRoundedIcon style={{ transform: 'rotate(180deg)' }} />
            </IconButton>
            : ''
        }

        {showCalendar ?
          <>
            <Divider />
            <IconButton color="primary" onClick={handleOpen}>
              <CalendarMonthIcon color='primary' />
            </IconButton>
          </>
          : ''
        }

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            borderRadius: "50px",
            backdrop: {
              timeout: 500,
            },

          }}

        >
          <Fade in={open} >
            <Box sx={style} >
              <ActiveCalender />
            </Box>
          </Fade>
        </Modal>
        <Divider />
        <Section >

          <IconButton color="primary" onClick={handleToMyPost}>
            <ArticleOutlinedIcon color='primary' />
          </IconButton>
          {checked ?
            <IconButton color="primary" onClick={handleToEdit}>
              <SvgIcon>
                <svg
                  viewBox='-2 0 24 24'
                >
                  <EditNoteIcon />
                </svg>
              </SvgIcon>

            </IconButton>
            :
            ''
          }

          <IconButton color="primary" onClick={handleToCreatePost}>
            <PostAddIcon color='primary' />
          </IconButton>

        </Section>
        <Divider />
        <Section >
          <IconButton color="primary" onClick={handleToSubscribed}>
            <Diversity2OutlinedIcon color='primary' />
          </IconButton>
          <IconButton color="primary" onClick={handleToBookmark}>
            <StarRoundedIcon color='primary' />
          </IconButton>
          <IconButton color="primary" onClick={handleToLiked}>
            <FavoriteIcon color='primary' sx={{ fontSize: '1.3rem' }} />
          </IconButton>
        </Section>
        {currentUser?.role === 'Admin' ?
          <>
            <Divider />
            <Section>
              <IconButton color="primary" onClick={handleToUsersSetting}>
                <ManageAccountsIcon color='primary' />
              </IconButton>
            </Section>
            <Section>
              <IconButton color="primary" onClick={handleToCreateNewUser}>
                <PersonAddIcon color='primary' />
              </IconButton>
            </Section>
          </>
          : ''}
        <Divider />
        <Section>
          <IconButton color="primary" onClick={handleToSetting}>
            <SettingsIcon color='primary' />
          </IconButton>
        </Section>
      </Box >
    )
  }

  return (

    <Box sx={small ? { display: 'none' } : {}}>
      <Box sx={{ position: 'sticky', top: '80px', width: isShow ? '260px' : '40px', pl: 2, pr: 2, mb: 10 }}>
        {sideBar}
      </Box>
    </Box >
  )


}

export default FrontPageSideBar