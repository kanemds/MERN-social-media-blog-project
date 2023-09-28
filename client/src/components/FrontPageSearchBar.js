import React, { useEffect, useState } from 'react'
import Input from '@mui/material/Input'
import FilledInput from '@mui/material/FilledInput'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import DehazeIcon from '@mui/icons-material/Dehaze'
import useMediaQuery from '@mui/material/useMediaQuery'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'

import { Box, Button, IconButton, Typography, AppBar, Toolbar, FormControlLabel, Switch, Collapse, Paper, Grow } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import ActiveCalender from '../pages/blogs/ActiveCalender'
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


const IconButtonStyle = {
  width: '40px', height: '40px'
}
export default function FrontPageSearchBar({ handleMenu, setIsShow }) {

  const largeBP = useMediaQuery('(min-width:1200px)')
  const mediumBP = useMediaQuery('(min-width:750px)')

  const [state, setState] = React.useState({
    left: false,
  })


  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    if (open === true) {
      setIsShow(true)
    } else {
      setIsShow(false)
    }
    setState({ ...state, [anchor]: open })
  }

  useEffect(() => {
    setState({ ...state, left: false })
  }, [largeBP])

  const navigate = useNavigate()
  const { id } = useParams()
  const { pathname } = useLocation()

  const { currentBlog } = useGetBlogsQuery('BlogsList', {
    selectFromResult: ({ data }) => ({
      currentBlog: data?.entities[id]
    })
  })

  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (pathname === `/blogs/post/${id}` || pathname === `/blogs/post/edit/${id}`) {
      setChecked(true)
    } else {
      setChecked(false)
    }
  }, [pathname])


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
    navigate('/blogs/bookmarks')
  }
  const handleToLiked = () => {
    navigate('/blogs/liked')
  }
  const handleToSetting = () => {
    navigate('/setting')
  }

  const icon = (
    <SideButton sx={{ ml: 3 }}>
      <SubdirectoryArrowRightOutlinedIcon />
      <ButtonInfo onClick={handleToEdit}>Edit Post</ButtonInfo>
    </SideButton>
  )

  const Divider = styled(Box)({
    height: '100%',
    width: '100%',
    borderTop: '1px solid lightGrey',
    marginTop: 12,
    marginBottom: 12,
  })


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

        </Section>

        <Divider />
        <ActiveCalender />
        <Divider />
        <Section >
          <SideButton  >
            <ArticleOutlinedIcon />
            <ButtonInfo onClick={handleToMyPost}>My Post(s)</ButtonInfo>
          </SideButton>
          {checked ?
            <Grow
              in={checked}
              style={{ transformOrigin: '0 0 0' }}
              {...(checked ? { timeout: 800 } : { timeout: 600 })}
            >
              {icon}
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

  return (



    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%', ml: '24px' }}>
        {largeBP ?
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
        }

      </Box>
      <FormControl sx={{ display: 'flex', flexDirection: 'row', width: '100%', mr: 'calc(40% - 64px)' }}>
        <OutlinedInput
          sx={{ width: '100%' }}
          autoComplete='true'
          placeholder='Search Posts...'
          startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
        />
        <Button variant='contained'><SearchIcon /></Button>
      </FormControl>
    </Box >




  )
}