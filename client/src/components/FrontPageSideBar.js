import React, { useEffect, useState } from 'react'
import { Box, Button, IconButton, Typography, FormControlLabel, Switch, Collapse, Paper, Grow } from '@mui/material'
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
  width: '100%',
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



const FrontPageSideBar = ({ isShow }) => {

  const navigate = useNavigate()
  const { id } = useParams()
  const { pathname } = useLocation()

  const { currentBlog } = useGetBlogsQuery('BlogsList', {
    selectFromResult: ({ data }) => ({
      currentBlog: data?.entities[id]
    })
  })

  const [checked, setChecked] = useState(false)
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


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
    navigate(`/blogs/post/edit/${id}`, { state: currentBlog })
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

  const icon = (
    <SideButton sx={{ ml: 3 }}>
      <SubdirectoryArrowRightOutlinedIcon />
      <ButtonInfo onClick={handleToEdit}>Edit Post</ButtonInfo>
    </SideButton>
  )

  return (
    <Box sx={{ position: 'sticky', top: '150px', width: isShow ? '280px' : '40px', height: '100%', pt: '10px', ml: 3, mr: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {isShow ?
        <>
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
        </>
        :
        <>
          <Section >

            <IconButton color="primary" onClick={handleToHome}>
              <HomeIcon color='primary' />
            </IconButton>

          </Section>

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
              <Grow
                in={checked}
                style={{ transformOrigin: '0 0 0' }}
                {...(checked ? { timeout: 800 } : { timeout: 600 })}
              >
                {icon}
              </Grow>
              : ''
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
        </>

      }
    </Box>
  )
}

export default FrontPageSideBar