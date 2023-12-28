import { Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material'
import React from 'react'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

const AboutThisApp = () => {


  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', m: 1 }}>
      <Box sx={{ p: 3 }}>
        <Typography variant='h6'>About this App</Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <Typography>Concept:</Typography>
        <List sx={{ listStyle: 'inherit', pl: 4 }}>
          <ListItem sx={{ display: "list-item" }}>
            <Typography>
              To share joyful moments and reconnect with loved ones.
            </Typography>
          </ListItem>
        </List>

      </Box>
      <Box sx={{ p: 3 }}>
        <Typography>Feature:</Typography>
        <List sx={{ listStyle: 'inherit', pl: 4 }}>
          <ListItem sx={{ display: "list-item" }}>
            <Typography>
              Creating blog posts with image and texts as public or private entries
            </Typography>
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <Typography>
              Browsing public posts from all users with infinite scroll
            </Typography>
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <Typography>
              Interacting with other blog posts by liking and bookmarking their entries
            </Typography>
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <Typography>
              Subscribing to favorite bloggers
            </Typography>
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <Typography>
              Sorting post entries with date picker
            </Typography>
          </ListItem>
        </List>
      </Box>
      <Box>
        <Box sx={{ p: 3 }}>
          <Typography>Frontend:</Typography>
          <List sx={{ listStyle: 'inherit', pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              <Typography>UI: React, Material UI</Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography>State Management: Redux Toolkit, RTK Query, React Context</Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography>Image upload: Firebase</Typography>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography>Libraries / tools:</Typography>
          <List sx={{ listStyle: 'inherit', pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              <Typography>Image Gallery: swiper</Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography>Date & Time: momentjs</Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography>User Avatar: react-easy-crop</Typography>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography>Backend:</Typography>
          <List sx={{ listStyle: 'inherit', pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              <Typography> Frameworks: Node.js, Express</Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography> Data storage: MongoDB</Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography> Image storage: Firebase</Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography>Password encryption: Bcrypt</Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography>Authentication: Json Web Token (JWT)</Typography>
            </ListItem>
          </List>
        </Box>
      </Box>

    </Paper >
  )
}

export default AboutThisApp