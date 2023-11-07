import { Box, Input, OutlinedInput, Paper, CardMedia, TextField, Typography, Button, FormControl, InputLabel, CardActionArea, Select, MenuItem, IconButton, Card, Container } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined'
import Grid from '@mui/material/Unstable_Grid2'
import { useNavigate, useParams } from 'react-router-dom'
import Drag_N_DropImages from '../../components/Drag_N_Drop/Drag_N_DropImages'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useAddNewBlogMutation, useUpdateBlogMutation } from './blogsApiSlice'
import './imagesDisplaySlider.css'

const SideButton = styled(Button)({
  textTransform: 'none',
  justifyContent: "flex-start",
})

const ButtonInfo = styled(Typography)({
  textAlign: 'left',
  marginLeft: 12
})


const SingleBlogEditForm = ({ blog }) => {


  const smallBP = useMediaQuery('(min-width:550px)') // true when larger
  const xSamllBP = useMediaQuery('(min-width:466px)') // true when larger
  const matches = useMediaQuery('(min-width:1200px)')
  const navigate = useNavigate()

  const [selectedImage, setSelectedImage] = useState([])
  const [orgImages, setOrgImages] = useState(blog?.images)
  const [imagesBeforeEdit, setImagesBeforeEdit] = useState(blog?.images)
  const [title, setTitle] = useState(blog?.title)
  const [text, setText] = useState(blog?.text)
  const [status, setStatus] = useState(blog?.visible_to)




  const [
    updateBlog,
    {
      isLoading,
      isSuccess,
      isError,
      error
    }
  ] = useUpdateBlogMutation()

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

  const handleBack = () => {
    navigate(-1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('id', blog.id)
    formData.append('title', title)
    formData.append('text', text)
    formData.append('visibleTo', status)
    // will be sent in the order they were appended.

    for (let i = 0;i < orgImages.length;i++) {
      if (orgImages[i] instanceof File) {
        formData.append(`${i + 1}`, orgImages[i])
      } else if (typeof orgImages[i] === 'object') {
        const imageJson = JSON.stringify(orgImages[i])
        formData.append(`${i + 1}`, imageJson)
      }
    }
    await updateBlog(formData)
  }


  return (
    <Grid container spacing={2} sx={{ width: '100%', minHeight: '100%' }}>
      <Grid xs={12} md={12} lg={5} sx={{ width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: matches ? '200px' : '120px' }}>
        {/* picture area */}

        {/* preveiw */}
        {!selectedImage ? '' :
          <Card sx={{ p: 2, width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', width: 400, height: 400 }}>
            <CardMedia
              // className='display'
              component="img"
              image={selectedImage.url}
              alt={selectedImage.name}
            />
          </Card>
        }

        {/* image list */}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 5, mb: 5, alignItems: 'center' }}>
          <Drag_N_DropImages setSelectedImage={setSelectedImage} selectedImage={selectedImage} setOrgImages={setOrgImages} orgImages={orgImages} imagesBeforeEdit={imagesBeforeEdit} />
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
            placeholder='Story Title'
            sx={{ width: '80%' }}
          />
          <TextField
            value={text}
            onChange={handleText}
            placeholder='what would you like to share today?'
            sx={{ mt: 10, width: '80%' }}
            fullWidth
            multiline // auto add line if needed 
            // maxRows={20} will create a scroll bar after the maxRows is reached (not good) 
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
          <Box sx={{ mb: 10 }}>
            <Button
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSave}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Grid>

    </Grid >

  )
}

export default SingleBlogEditForm