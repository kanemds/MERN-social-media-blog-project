import React from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import ActiveCalender from '../pages/mainPage/ActiveCalender'
import DehazeIcon from '@mui/icons-material/Dehaze'
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import PostAddIcon from '@mui/icons-material/PostAdd'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined'


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


const ClientSideBar = () => {
  return (
    <Box sx={{ position: 'fixed', top: '70px', width: '280x', pt: '10px', ml: 3, mr: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 11 }}>

      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} >

        <IconButton color="primary">
          <DehazeIcon color='primary' />
        </IconButton>

      </Box>

      <Divider />
      <Section >
        <SideButton >
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
          <ButtonInfo>My Post(s)</ButtonInfo>
        </SideButton>
        <SideButton >
          <PostAddIcon />
          <ButtonInfo > Create a Post</ButtonInfo>
        </SideButton>
      </Section>
      <Divider />
      <Section >
        <SideButton >
          <Diversity2OutlinedIcon />
          <ButtonInfo>  Friend's Post(s)</ButtonInfo>
        </SideButton>
      </Section>

      <Divider />

      <Section>

        <SideButton  >
          <SettingsIcon />
          <ButtonInfo >  Settings</ButtonInfo>
        </SideButton>
      </Section>
    </Box>
  )
}

export default ClientSideBar