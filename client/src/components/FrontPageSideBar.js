import React, { useEffect, useState } from 'react'
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
import { useGetBlogsQuery } from '../pages/blogs/blogsApiSlice'
import Modal from '@mui/material/Modal'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useMediaQuery } from '@mui/material'
import useAuth from '../hooks/useAuth'
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded'
import EditNoteIcon from '@mui/icons-material/EditNote'

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
  const small = useMediaQuery('(max-width:792px)')



  const navigate = useNavigate()
  const { username } = useAuth()
  const { id } = useParams()
  const { pathname } = useLocation()

  const { currentBlog } = useGetBlogsQuery('BlogsList', {
    selectFromResult: ({ data }) => ({
      currentBlog: data?.entities[id]
    })
  })

  const [checked, setChecked] = useState(false)
  const [showBack, setShowBack] = useState(false)
  const [open, setOpen] = React.useState(false)
  const [isShow, setIsShow] = useState(true)
  const [keepOpen, setKeepOpen] = useState(true)
  const [hiddenSideBar, setHiddenSideBar] = useState(false)
  const [state, setState] = React.useState({
    left: false,
  })


  useEffect(() => {
    if (pathname === `/blogs/post/${id}` || pathname === `/blogs/post/edit/${id}`) {
      setChecked(true)
    } else {
      setChecked(false)
    }

    if (pathname !== '/') {
      setShowBack(true)
    }
  }, [pathname])

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  useEffect(() => {


    if (!largeBP) {
      setIsShow(false)
    }
    if (largeBP) {
      setIsShow(true)
      setState({ ...state, left: false })
    }


  }, [largeBP, mediumBP, small])



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
    navigate('/blogs')
  }
  const handleToEdit = () => {
    navigate(`/blogs/post/edit/${id}`)
  }
  const handleToCreatePost = () => {
    navigate('/blogs/new')
  }
  const handleToSubscribed = () => {
    navigate('/blogs/subscribed')
  }
  const handleToFavorite = () => {
    navigate('/blogs/favorite')
  }
  const handleToLiked = () => {
    navigate('/blogs/liked')
  }
  const handleToSetting = () => {
    navigate('/setting')
  }

  const handleToBack = () => {
    navigate(-1)
  }

  const iconEdit = (
    <SideButton >
      <SvgIcon>
        <svg
          viewBox='-2 0 24 24'
        >
          <EditNoteIcon />
        </svg>
      </SvgIcon>
      <ButtonInfo onClick={handleToEdit}>Edit Post</ButtonInfo>
    </SideButton>
  )
  const iconBack = (
    <SideButton >
      {/* <SubdirectoryArrowRightOutlinedIcon /> */}
      <ForwardRoundedIcon style={{ transform: 'rotate(180deg)' }} />
      <ButtonInfo onClick={handleToBack}>Back</ButtonInfo>
    </SideButton>
  )

  const list = (anchor) => (
    <Box
      // sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 288 }}
      sx={{ width: '288px', height: '100%' }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box sx={{ height: '70px', width: '100%', background: '#1976d2' }}>

      </Box>
      <Box sx={{ height: '80px', display: 'flex', alignItems: 'flex-end', ml: 3, mr: 3 }}>
        <IconButton style={IconButtonStyle} color="primary" onClick={handleMenu} >
          <DehazeIcon color='primary' />
        </IconButton>
      </Box>
      <List style={{ padding: 0 }} sx={{ ml: 3, mr: 3 }}>
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

        <Divider />
        <ActiveCalender />
        <Divider />
        <Section >
          <SideButton  >
            <ArticleOutlinedIcon />
            <ButtonInfo onClick={handleToMyPost}>My Post(s)</ButtonInfo>
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
          <SideButton >
            <PostAddIcon />
            <ButtonInfo onClick={handleToCreatePost}> Create a Post</ButtonInfo>
          </SideButton>
        </Section>
        <Divider />
        <Section >
          <SideButton >
            <Diversity2OutlinedIcon onClick={handleToSubscribed} />
            <ButtonInfo>  Friend's Post(s)</ButtonInfo>
          </SideButton>
          <SideButton >
            <StarRoundedIcon onClick={handleToFavorite} />
            <ButtonInfo>  Favorite</ButtonInfo>
          </SideButton>
          <SideButton >
            <RecommendIcon onClick={handleToLiked} />
            <ButtonInfo>  Liked</ButtonInfo>
          </SideButton>
        </Section>
        <Divider />
        <Section>
          <SideButton  >
            <SettingsIcon onClick={handleToSetting} />
            <ButtonInfo >  Settings</ButtonInfo>
          </SideButton>
        </Section>
      </List >
    </Box >
  )

  let sideBar

  if (largeBP) {
    sideBar = (
      <Box sx={{ width: '288px', ml: 3, mr: 3 }}>
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

        <Divider />
        <ActiveCalender />
        <Divider />
        <Section >
          <SideButton  >
            <ArticleOutlinedIcon />
            <ButtonInfo onClick={handleToMyPost}>My Post(s)</ButtonInfo>
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
          <SideButton >
            <PostAddIcon />
            <ButtonInfo onClick={handleToCreatePost}> Create a Post</ButtonInfo>
          </SideButton>
        </Section>
        <Divider />
        <Section >
          <SideButton >
            <Diversity2OutlinedIcon onClick={handleToSubscribed} />
            <ButtonInfo>  Friend's Post(s)</ButtonInfo>
          </SideButton>
          <SideButton >
            <StarRoundedIcon onClick={handleToFavorite} />
            <ButtonInfo>  Favorite</ButtonInfo>
          </SideButton>
          <SideButton >
            <RecommendIcon onClick={handleToLiked} />
            <ButtonInfo>  Liked</ButtonInfo>
          </SideButton>
        </Section>
        <Divider />
        <Section>
          <SideButton  >
            <SettingsIcon onClick={handleToSetting} />
            <ButtonInfo >  Settings</ButtonInfo>
          </SideButton>
        </Section>
      </Box>
    )
  }

  if (mediumBP) {
    sideBar = (
      <Box sx={{ width: '40px' }}>
        <>
          {['left'].map((anchor) => (
            <Box key={anchor} >
              <IconButton style={IconButtonStyle} color="primary" onClick={toggleDrawer(anchor, true)} >
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
            </Box>
          ))}
        </>
        <Divider />
        <Section >

          <IconButton color="primary" onClick={handleToHome}>
            <HomeIcon color='primary' />
          </IconButton>

        </Section>
        {showBack ?
          <IconButton color="primary" onClick={handleToBack}>
            <ForwardRoundedIcon style={{ transform: 'rotate(180deg)' }} />
          </IconButton>
          : ''
        }
        <Divider />
        <IconButton color="primary" onClick={handleOpen}>
          <CalendarMonthIcon color='primary' />
        </IconButton>
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
          <IconButton color="primary" onClick={handleToFavorite}>
            <StarRoundedIcon color='primary' />
          </IconButton>
          <IconButton color="primary" onClick={handleToLiked}>
            <RecommendIcon color='primary' />
          </IconButton>

        </Section>
        <Divider />
        <Section>
          <IconButton color="primary" onClick={handleToSetting}>
            <SettingsIcon color='primary' />
          </IconButton>

        </Section>
      </Box>
    )
  }

  if (small) {
    sideBar = (
      <>
        {['left'].map((anchor) => (
          <Box key={anchor} >
            <IconButton style={IconButtonStyle} color="primary" onClick={toggleDrawer(anchor, true)} >
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
          </Box>
        ))}
      </>)
  }


  return (
    <Box sx={{ position: 'sticky', top: '100px', width: isShow ? '280px' : '40px', ml: 3, mr: 3, mb: 10 }}>

      {/* {largeBP ?
        <IconButton style={IconButtonStyle} color="primary" onClick={handleMenu} >
          <DehazeIcon color='primary' />
        </IconButton>
        :
        <>
          {['left'].map((anchor) => (
            <Box key={anchor} >
              <IconButton style={IconButtonStyle} color="primary" onClick={toggleDrawer(anchor, true)} >
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
            </Box>
          ))}
        </>
      } */}


      {sideBar}
    </Box>
  )
}

export default FrontPageSideBar