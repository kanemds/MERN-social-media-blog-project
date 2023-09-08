import { Box, Container, Paper, Typography, TextField, Modal, Button, IconButton, SvgIcon } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HorizontalSwiper from '../../components/swiper/HorizontalSwiper'
import { useNavigate, useParams } from 'react-router-dom'
import { blogsApiSlice, useDeleteBlogMutation, useGetBlogsQuery, useGetSingleBlogQuery } from './blogsApiSlice'
import useAuth from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner'
import ImagesDisplaySlider from './ImagesDisplaySlider'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import { timeDisplayOptions } from '../../config/timeDisplayOptions'
import moment from 'moment'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { red } from '@mui/material/colors'
import useMediaQuery from '@mui/material/useMediaQuery'
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded'
import './imagesDisplaySlider.css'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 140,
  bgcolor: 'background.paper',
  border: '2px solid #bdbdbd',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  p: 4,
  borderRadius: '20px',
}

const stylePicture = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}
const SideButton = styled(Button)({
  textTransform: 'none',
  justifyContent: "flex-start",

})

const ButtonInfo = styled(Typography)({
  textAlign: 'left',
  width: '48px',
  marginLeft: 10
})

const Divider = styled(Box)({
  height: '100%',
  width: '100%',
  borderTop: '1px solid lightGrey',
  marginTop: 12,
  marginBottom: 20,
})


const SingleBlog = () => {

  const mediumBP = useMediaQuery('(min-width:750px)') // true when larger
  const smallBP = useMediaQuery('(min-width:550px)') // true when larger
  const xSamllBP = useMediaQuery('(min-width:466px)') // true when larger

  const { id } = useParams()
  const { username, userId } = useAuth()
  const navigate = useNavigate()

  const [currentBlog, setCurrentBlog] = useState('')
  const [open, setOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState(null)
  const [isDeleteReady, setIsDeleteReady] = useState(false)

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSingleBlogQuery(id)

  const [
    deleteBlog,
    {
      data: message,
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess
    }
  ] = useDeleteBlogMutation()



  useEffect(() => {
    if (isSuccess) {
      setCurrentBlog(data)
    }
  }, [isSuccess, data])

  useEffect(() => {

    if (isDeleteSuccess && isDeleteReady === true && message?.message) {
      setDeleteMessage(message.message)
      setTimeout(() => {
        // console.log('run this setTimeout')
        setDeleteOpen(false)
        navigate('/blogs', { replace: true })
      }, 1400)
    } else {
      setIsDeleteReady(false)
    }
  }, [isDeleteSuccess, isDeleteReady, message])

  useEffect(() => {
    if (isDeleteLoading) {
      setTimeout(() => {
        setIsDeleteReady(true)
      }, 1400)
    }
  }, [isDeleteLoading])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleToEdit = () => navigate(`/blogs/post/edit/${id}`, { state: data })
  const handleDelete = () => setDeleteOpen(true)
  const handleDeleteClose = () => setDeleteOpen(false)
  const handleDeleteConfirm = async (e) => {
    e.preventDefault()
    await deleteBlog({ id })
  }
  const handleBackToBlogs = () => {
    navigate('/blogs', { replace: true })
  }



  const current = Date.parse(new Date())
  const postedDay = Date.parse(currentBlog?.createdAt)
  const sevenDays = 60 * 60 * 24 * 1000 * 7

  const timeInMillisecond = current - postedDay
  const localCreatedTime = new Date(Date.parse(currentBlog?.createdAt)).toLocaleString(undefined, timeDisplayOptions.optionTwo)
  const localUpdatedTime = new Date(Date.parse(currentBlog?.updatedAt)).toLocaleString(undefined, timeDisplayOptions.optionTwo)

  let deleteModalMessage

  if (isDeleteReady === false) {

    deleteModalMessage = <LoadingSpinner />
  }

  if (!isDeleteLoading && !isDeleteSuccess) {
    deleteModalMessage = (
      <>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Delete the selected blog?
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
          <Button variant='contained' onClick={handleDeleteClose}>Cancel</Button>
          <Button variant='contained' onClick={handleDeleteConfirm} sx={{
            backgroundColor: red[600],
            color: 'white',
            '&:hover': {
              backgroundColor: red[800]
            }
          }}>Delete Blog</Button>
        </Box>
      </>
    )
  }

  if (isDeleteReady === true && deleteMessage) {
    deleteModalMessage = (
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {deleteMessage}
      </Typography>
    )
  }

  let content

  if (isLoading) {
    content = (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </Box>
    )
  }

  if (isSuccess) {

    content = (

      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >

        <Paper onClick={handleOpen} className='display' sx={!xSamllBP ? { width: 375, height: 375 } : !smallBP ? { width: 420, height: 420 } : { width: 500, height: 500 }}>
          <ImagesDisplaySlider row={currentBlog?.images} />
        </Paper>
        {/* <Paper onClick={handleOpen} className='display' sx={{ width: 500, height: 500 }}>
          <ImagesDisplaySlider row={currentBlog?.images} />
        </Paper> */}


        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={stylePicture}>
            <ImagesDisplaySlider row={currentBlog?.images} handleClose={handleClose} on={open} />
          </Box>
        </Modal>
        <Box sx={{ width: !smallBP ? '80%' : 500, m: 2, display: 'flex', flexDirection: !smallBP ? 'column' : 'row', justifyContent: 'center', alignItems: !smallBP ? 'flex-end' : 'center' }}>
          <Typography variant='h8' sx={{ width: '220px', display: 'flex', justifyContent: !smallBP ? 'flex-start' : 'center' }}>
            Posted:
            {
              timeInMillisecond <= sevenDays ?
                moment(Date.parse(currentBlog?.createdAt)).fromNow()
                :
                localCreatedTime
            }
          </Typography>

          {currentBlog?.createdAt === currentBlog?.updatedAt ?
            <Typography variant='h8' sx={{ ml: 2, width: '220px' }}>
              Last Updated:
              {
                timeInMillisecond <= sevenDays ?
                  moment(Date.parse(currentBlog?.updatedAt)).fromNow()
                  :
                  localUpdatedTime
              }
            </Typography>
            :
            ''}
        </Box>
        <Box sx={{ width: !smallBP ? '80%' : 500 }}>
          <TextField
            sx={{
              '.css-1rcvvn7-MuiInputBase-root-MuiInput-root:before': {
                border: 'hidden'
              },
              '.css-1rcvvn7-MuiInputBase-root-MuiInput-root.Mui-disabled:before': {
                borderBottomStyle: 'hidden',
                border: 'hidden'
              },
              '& .MuiInputBase-input.Mui-disabled': {
                fontSize: 22,
                WebkitTextFillColor: 'black',
                '&:hover': {
                  cursor: 'text'
                }
              },
            }
            }
            disabled
            variant='standard'
            fullWidth
            multiline
            defaultValue={currentBlog.title}
          />
          <Divider />
          <TextField
            sx={{
              '.css-1rcvvn7-MuiInputBase-root-MuiInput-root:before': {
                border: 'hidden'
              },
              '.css-1rcvvn7-MuiInputBase-root-MuiInput-root.Mui-disabled:before': {
                borderBottomStyle: 'hidden',
                border: 'hidden'
              },
              '& .MuiInputBase-input.Mui-disabled': {
                fontSize: 16,
                WebkitTextFillColor: 'black',
                '&:hover': {
                  cursor: 'text'
                }
              },
            }}
            disabled
            variant='standard'
            fullWidth
            multiline
            defaultValue={currentBlog.text}
          />
        </Box>
      </Box >

    )
  }

  let menuButton

  if (username === data?.user && mediumBP) {
    menuButton = (
      <Box sx={{ position: 'sticky', top: 'calc(50% - 78px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100px', height: '100%', ml: '7%' }}>
        <SideButton onClick={handleToEdit} sx={{ m: 1 }}>
          <EditNoteOutlinedIcon />
          <ButtonInfo >  Edit</ButtonInfo>
        </SideButton>

        <SideButton onClick={handleDelete} sx={{ m: 1 }}>
          <SvgIcon>
            <svg
              viewBox='2 0 24 24'
            >
              <DeleteForeverOutlinedIcon />
            </svg>
          </SvgIcon>
          <ButtonInfo >Delete</ButtonInfo>
        </SideButton>

        <SideButton onClick={handleBackToBlogs} sx={{ m: 1 }}>
          <ForwardRoundedIcon
            style={{ transform: 'rotate(180deg)' }}
          />
          <ButtonInfo >  Back</ButtonInfo>
        </SideButton>

        <Modal
          open={deleteOpen}
          onClose={handleDeleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {deleteModalMessage}
          </Box>
        </Modal>
      </Box >
    )
  }

  if (username === data?.user && !mediumBP) {
    menuButton = (
      <Box sx={{ position: 'fixed', bottom: 0, background: 'white', zIndex: 30, pb: 2, width: '100%' }} textAlign='center' >
        <SideButton onClick={handleBackToBlogs} sx={{ m: 1 }}>
          <ForwardRoundedIcon
            style={{ transform: 'rotate(180deg)' }}
          />
          <ButtonInfo >  Back</ButtonInfo>
        </SideButton>
        <SideButton onClick={handleDelete} sx={{ m: 1 }}>
          <SvgIcon>
            <svg
              viewBox='2 0 24 24'
            >
              <DeleteForeverOutlinedIcon />
            </svg>
          </SvgIcon>
          <ButtonInfo >Delete</ButtonInfo>
        </SideButton>
        <SideButton onClick={handleToEdit} sx={{ m: 1 }}>
          <EditNoteOutlinedIcon />
          <ButtonInfo >  Edit</ButtonInfo>
        </SideButton>



        <Modal
          open={deleteOpen}
          onClose={handleDeleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {deleteModalMessage}
          </Box>
        </Modal>
      </Box >
    )
  }

  return (
    <Box sx={{
      display: 'flex', width: '100%', height: '100%', minWidth: '375px', minHeight: '375px', position: !mediumBP ? 'none' : 'relative', justifyContent: 'space-evenly'
    }}>
      {menuButton}
      < Box sx={{
        width: '100%', height: '100%'
      }}>
        {content}
      </Box >
    </Box >

  )
}

export default SingleBlog