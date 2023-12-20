import { Box, Input, OutlinedInput, Paper, CardMedia, TextField, Typography, Button, FormControl, InputLabel, CardActionArea, Select, MenuItem, IconButton, Card, Container } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined'
import Grid from '@mui/material/Unstable_Grid2'
import { useNavigate } from 'react-router-dom'
import noteBook from '../../images/noteBook.jpg'
import ark from '../../images/ark.jpg'
import Drag_N_DropImages from '../../components/Drag_N_Drop/Drag_N_DropImages'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useAddNewBlogMutation } from './blogsApiSlice'
import useAuth from '../../hooks/useAuth'

const SideButton = styled(Button)({
  textTransform: 'none',
  justifyContent: "flex-start",
})

const ButtonInfo = styled(Typography)({
  textAlign: 'left',
  marginLeft: 12
})


const NewBlog = () => {

  const matches = useMediaQuery('(min-width:1200px)')


  const { username, userId } = useAuth()
  const navigate = useNavigate()

  const [selectedImage, setSelectedImage] = useState(null)
  const [orgImages, setOrgImages] = useState([])
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState('public')

  const [
    addNewBlog,
    {
      isLoading,
      isSuccess,
      isError,
      error
    }
  ] = useAddNewBlogMutation()

  useEffect(() => {
    if (isSuccess) {
      setText('')
      setTitle('')
      setOrgImages([])
      navigate('/blogs')
    }
  }, [isSuccess])

  const canSave = [title.length && text.length].every(Boolean) && !isLoading

  const handleTitle = e => {
    setTitle(e.target.value)
  }

  const handleText = e => {
    setText(e.target.value)
  }

  const handlePostTo = (e) => {
    setStatus(e.target.value)
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    formData.append('userId', userId)
    formData.append('title', title)
    formData.append('text', text)
    formData.append('visibleTo', status)
    // will be sent in the order they were appended.
    for (const image of orgImages) {
      formData.append("images", image)
    }
    // formData.append('file', orgImages)

    await addNewBlog(formData)
    // await addNewBlog({ username, title, text })

  }


  return (


    <Grid container spacing={2} sx={{ width: '100%', minHeight: '100%', }}>
      <Grid xs={12} md={12} lg={5} sx={{ width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: matches ? '200px' : '120px' }}>
        {/* picture area */}

        {/* preveiw */}
        {!selectedImage ? '' :
          <Card sx={{ p: 2, width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', width: 400, height: 400 }}>
            <CardMedia
              component="img"
              image={selectedImage.url}
              alt={selectedImage.name}
            />
          </Card>
        }

        {/* image list */}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 5, alignItems: 'center' }}>
          <Drag_N_DropImages setSelectedImage={setSelectedImage} selectedImage={selectedImage} setOrgImages={setOrgImages} orgImages={orgImages} />
        </Box>

      </Grid>


      <Grid xs={12} md={12} lg={7} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', mt: '160px' }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {isError ?
            <OutlinedInput defaultValue={error.data.message} color='error' disabled />
            :
            ''
          }

          <TextField
            value={title}
            onChange={handleTitle}
            autoComplete='true'
            multiline
            fullWidth
            sx={{ width: '80%' }}
            placeholder='Story Title'
          />
          <TextField
            value={text}
            onChange={handleText}
            placeholder='what would you like to share today?'
            sx={{ mt: 10, width: '80%' }}
            fullWidth
            multiline
            maxRows={25}
            minRows={14}
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
                defaultValue='public'
                onChange={handlePostTo}
              >
                <MenuItem value='public' >Public</MenuItem>
                <MenuItem value='private'>Private</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            onClick={handleSubmit}
            disabled={!canSave}
          >
            Create
          </Button>
        </Box>
      </Grid>

    </Grid >

  )
}

export default NewBlog