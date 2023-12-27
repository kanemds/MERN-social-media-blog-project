import { Box, Input, OutlinedInput, Paper, CardMedia, SvgIcon, TextField, Modal, Typography, Button, FormControl, InputLabel, CardActionArea, Select, MenuItem, IconButton, Card, Container } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined'
import Grid from '@mui/material/Unstable_Grid2'
import { useNavigate, useParams } from 'react-router-dom'
import Drag_N_DropImages from '../../components/Drag_N_Drop/Drag_N_DropImages'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useAddNewBlogMutation, useDeleteBlogMutation, useGetSingleBlogQuery, useUpdateBlogMutation } from './blogsApiSlice'
import './imagesDisplaySlider.css'
import { SideBarContext } from '../../useContext/SideBarContext'
import DehazeIcon from '@mui/icons-material/Dehaze'
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded'
import SaveIcon from '@mui/icons-material/Save'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import useAuth from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner'
import { red } from '@mui/material/colors'
import { useDispatch } from 'react-redux'
import { apiSlice } from '../../app/api/apiSlice'

const SideButton = styled(Button)({
  textTransform: 'none',
  justifyContent: "flex-start",
})

const ButtonInfo = styled(Typography)({
  textAlign: 'left',
  marginLeft: 12
})


const SingleBlogEditForm = ({ blog, setDeleteOpen, deleteOpen }) => {

  // const { id } = useParams()
  const { username } = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [
    updateBlog,
    {
      isLoading,
      isSuccess,
      isError,
      error
    }
  ] = useUpdateBlogMutation()

  const extraSmall = useMediaQuery('(max-width:431px)')

  const noMenu = useMediaQuery('(max-width:791px)')


  const { drawerDirection, toggleDrawer } = useContext(SideBarContext)


  const [selectedImage, setSelectedImage] = useState([])
  const [orgImages, setOrgImages] = useState(blog.images)
  const [imagesBeforeEdit, setImagesBeforeEdit] = useState(blog.images)
  const [title, setTitle] = useState(blog.title)
  const [text, setText] = useState(blog.text)
  const [status, setStatus] = useState(blog.visible_to)

  console.log('orgImages', orgImages)
  console.log('imagesBeforeEdit', imagesBeforeEdit)



  useEffect(() => {
    if (isSuccess) {
      setText('')
      setTitle('')
      setOrgImages([])
      navigate('/blogs')
    }
  }, [isSuccess])


  const canSave = [title?.length && text?.length].every(Boolean) && !isLoading

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

  const handleDelete = () => setDeleteOpen(true)
  // const handleDeleteClose = () => setDeleteOpen(false)


  // const handleDeleteConfirm = async (e) => {
  //   e.preventDefault()
  //   await deleteBlog({ id: blog._id })
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('id', blog._id)
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



  let menuButton


  if (noMenu) {
    menuButton = (
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#bdbdbd', zIndex: 30, width: '100%', minWidth: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
        <SideButton
          // disableRipple
          color="primary" sx={{ m: 1 }}
          onClick={toggleDrawer(drawerDirection, true)}
        >
          <DehazeIcon color='primary' />
          {extraSmall ? '' :
            <ButtonInfo > Menu</ButtonInfo>
          }


        </SideButton>
        <SideButton onClick={handleBack} sx={{ m: 1 }}>
          <ForwardRoundedIcon
            style={{ transform: 'rotate(180deg)' }}
          />
          {extraSmall ? '' :
            <ButtonInfo >  Back</ButtonInfo>
          }


        </SideButton>
        {username ?
          <>
            <SideButton onClick={handleDelete} sx={{ m: 1 }}>
              <SvgIcon>
                <svg
                  viewBox='2 0 24 24'
                >
                  <DeleteForeverOutlinedIcon />
                </svg>
              </SvgIcon>
              {extraSmall ? '' :
                <ButtonInfo >Delete</ButtonInfo>
              }


            </SideButton>
            <SideButton onClick={handleSubmit} sx={{ m: 1 }} disabled={!canSave}>
              <SaveIcon />
              {extraSmall ? '' :
                <ButtonInfo >Save</ButtonInfo>
              }
            </SideButton>

          </>
          :
          ''
        }
      </Box >
    )
  }

  let content

  if (blog) {
    content = (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: noMenu ? '0' : '20px' }} >

        {/* picture area */}

        {/* preveiw */}
        {!selectedImage ? '' :
          <Card sx={{
            maxWidth: 500, minWidth: 340, aspectRatio: '1 / 1', display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <CardMedia
              // className='display'
              component="img"
              image={selectedImage.url}
              alt={selectedImage.name}
              sx={{ objectFit: 'initial' }}
            />
          </Card>
        }

        {/* image list */}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 5, mb: 5, alignItems: 'center' }}>
          <Drag_N_DropImages setSelectedImage={setSelectedImage} selectedImage={selectedImage} setOrgImages={setOrgImages} orgImages={orgImages} imagesBeforeEdit={imagesBeforeEdit} />
        </Box>



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
            sx={{ width: '80%', maxWidth: 500 }}
          />
          <TextField
            value={text}
            onChange={handleText}
            placeholder='what would you like to share today?'
            sx={{ mt: 10, width: '80%', maxWidth: 500 }}
            fullWidth
            multiline // auto add line if needed 
            // maxRows={20} will create a scroll bar after the maxRows is reached (not good) 
            minRows={14}
            autoComplete='true'
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: noMenu ? 6 : 3 }}>
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

          {noMenu ? '' :
            <Box sx={{ mb: 10 }}>
              <Button
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSave}
              >
                Save
              </Button>
            </Box>
          }
        </Box>
        {menuButton}

      </Box >
    )

  }



  return content

}

export default SingleBlogEditForm