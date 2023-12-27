import { Paper, Typography, Box } from '@mui/material'
import React from 'react'

const AboutThisApp = () => {


  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', m: 3 }}>
      <Box sx={{ p: 3 }}>
        <Typography variant='h6'>About this App</Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <Typography>Concept:</Typography>
        <Typography>
          The concept involves sharing joyful moments and reconnecting with loved ones.
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <Typography>Feature:</Typography>
        <Typography>
          - Bookmark and like blogs
        </Typography>
        <Typography>
          - subscribe to favorite bloggers
        </Typography>
        <Typography>
          - choose specific dates to showcase content
        </Typography>
      </Box>
      <Box>
        <Box sx={{ p: 3 }}>
          <Typography>Frontend:</Typography>
          <Typography>- react: RTK-Query, Redux-toolkit, Redux, react-context</Typography>
          <Typography>- app style: Material UI</Typography>
          <Typography>- using Grid to make the app responsive (support minimum  screen width:360px) </Typography>
          <Typography>- image upload: Firebase</Typography>
          <Typography>- infinite scroll: front page </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography>libraries / tools:</Typography>
          <Typography>- swiper: display images content</Typography>
          <Typography>- moment: display time</Typography>
          <Typography>- react-easy-crop: image cropping for user avatar </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography>Backend:</Typography>
          <Typography>MVC:An architectural pattern structure.</Typography>
          <Typography>- nodeJs: Express</Typography>
          <Typography>- data storage: MongoDB</Typography>
          <Typography>- image storage: Firebase</Typography>
          <Typography>- password encryption: Bcrypt</Typography>
          <Typography>- authorization key: Json Web Token (JWT)</Typography>
        </Box>
      </Box>
    </Paper >
  )
}

export default AboutThisApp