import { Box, Input, OutlinedInput, Paper, CardMedia, TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Card } from '@mui/material'
import React from 'react'
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined'
import noteBook from '../../images/noteBook.jpg'
import ark from '../../images/ark.jpg'

const SideButton = styled(Button)({
  textTransform: 'none',
  justifyContent: "flex-start",
})

const ButtonInfo = styled(Typography)({
  textAlign: 'left',
  marginLeft: 12
})


const NewBlog = () => {
  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

      <OutlinedInput autoComplete='true' />
      <TextField
        multiline
        maxRows={12}
        minRows={9}
        autoComplete='true'
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ display: 'flex' }} >
          <EmojiPeopleOutlinedIcon />
          <ButtonInfo >Visible To</ButtonInfo>
        </Box>
        <FormControl sx={{ m: 3, width: 120 }}>
          <Select
            sx={{
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": { border: 0 },
              "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
              {
                border: 0,
              },
              "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: 0,
              },
            }}
            autoWidth
            defaultValue='Public'
          >

            <MenuItem value='Public'>Public</MenuItem>
            <MenuItem value='Private'>Private</MenuItem>

          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* preveiw */}
        <Paper sx={{ width: '400px', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CardMedia
            component="img"
            image={noteBook}
            alt="green iguana"
          />
        </Paper>
        <Paper sx={{ width: '400px', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CardMedia
            component="img"
            image={ark}
            alt="green iguana"
          />
        </Paper>

        {/* image list */}
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', width: '150px', height: '150px' }}>
            <CardMedia
              component="img"
              image={noteBook}
              alt="green iguana"
            />
          </Box>
          <Box sx={{ display: 'flex', width: '150px', height: '150px' }}>
            <CardMedia
              component="img"
              image={ark}
              alt="green iguana"
            />
          </Box>

          {/* add image */}
          <Box sx={{ width: '150px', height: '150px', border: '1px dashed black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton color='primary'>
              <AddAPhotoOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

    </Paper >
  )
}

export default NewBlog