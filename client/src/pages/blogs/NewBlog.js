import { Box, Input, OutlinedInput, Paper, CardMedia, TextField, Typography, Button, FormControl, InputLabel, CardActionArea, Select, MenuItem, IconButton, Card, Container } from '@mui/material'
import React from 'react'
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined'
import Grid from '@mui/material/Unstable_Grid2'
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


    <Grid container spacing={1} sx={{ width: '100%', minHeight: '100vh' }}>

      <Grid xs={12} md={12} lg={5} sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* picture area */}

        {/* preveiw */}
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <Card sx={{ p: 2, maxWidth: 400, maxHeight: 400, minWidth: 280, minHeight: 280, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardMedia

              component="img"
              image={noteBook}
              alt="green iguana"
            />
          </Card>
        </Box>

        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <Card sx={{ p: 2, maxWidth: 400, maxHeight: 400, minWidth: 280, minHeight: 280, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardMedia

              component="img"
              image={ark}
              alt="green iguana"
            />
          </Card>
        </Box>



        {/* image list */}

        <Box sx={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'center', mt: 10 }}>

          <Card sx={{ display: 'flex', width: 120, height: 120, m: 1 }}>
            <CardMedia
              component="img"
              image={noteBook}
              alt="green iguana"
            />
          </Card>
          <Card sx={{ display: 'flex', width: 120, height: 120, m: 1 }}>
            <CardMedia
              component="img"
              image={noteBook}
              alt="green iguana"
            />
          </Card>
          <Card sx={{ display: 'flex', width: 120, height: 120, m: 1 }}>
            <CardMedia
              component="img"
              image={noteBook}
              alt="green iguana"
            />
          </Card>
          <Card sx={{ display: 'flex', width: 120, height: 120, m: 1 }}>
            <CardMedia
              component="img"
              image={noteBook}
              alt="green iguana"
            />
          </Card>

          <Card sx={{ display: 'flex', width: 120, height: 120, m: 1 }}>
            <CardMedia
              component="img"
              image={noteBook}
              alt="green iguana"
            />
          </Card>



          {/* add image */}
          <Box sx={{ m: 1, width: 120, height: 120, border: '1px dashed black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton color='primary'>
              <AddAPhotoOutlinedIcon />
            </IconButton>
          </Box>

        </Box>

      </Grid>


      <Grid xs={12} md={12} lg={7}>
        {/* input area */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
        </Box>
      </Grid>

    </Grid >

  )
}

export default NewBlog