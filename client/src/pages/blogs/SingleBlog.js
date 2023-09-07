import { Box, Container, Paper, Typography, TextField, Modal, Button, IconButton, SvgIcon } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HorizontalSwiper from '../../components/swiper/HorizontalSwiper'
import { useParams } from 'react-router-dom'
import { blogsApiSlice, useGetBlogsQuery, useGetSingleBlogQuery } from './blogsApiSlice'
import useAuth from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner'
import ImagesDisplaySlider from './ImagesDisplaySlider'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import { timeDisplayOptions } from '../../config/timeDisplayOptions'
import moment from 'moment'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const SideButton = styled(Button)({
  textTransform: 'none',
  justifyContent: "flex-start",

})

const ButtonInfo = styled(Typography)({
  textAlign: 'left',
  marginLeft: 12
})


const SingleBlog = () => {

  const { id } = useParams()
  const { username } = useAuth()

  const [currentBlog, setCurrentBlog] = useState('')
  const [open, setOpen] = useState(false)



  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSingleBlogQuery(id)

  console.log(data)


  useEffect(() => {
    if (isSuccess) {
      setCurrentBlog(data)
    }
  }, [isSuccess, data])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const current = Date.parse(new Date())
  const postedDay = Date.parse(currentBlog?.createdAt)
  const sevenDays = 60 * 60 * 24 * 1000 * 7

  const timeInMillisecond = current - postedDay
  const localTime = new Date(Date.parse(currentBlog?.createdAt)).toLocaleString(undefined, timeDisplayOptions.optionTwo)

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

      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >

        <Paper onClick={handleOpen} sx={{ width: 500, height: 500 }}>
          <ImagesDisplaySlider row={currentBlog?.images} />
        </Paper>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <ImagesDisplaySlider row={currentBlog?.images} handleClose={handleClose} on={open} />
          </Box>
        </Modal>
        <Box sx={{ m: 2 }}>
          <Typography>
            {
              timeInMillisecond <= sevenDays ?
                moment(Date.parse(currentBlog?.createdAt)).fromNow()
                :
                localTime
            }
          </Typography>
        </Box>
        <Box sx={{ width: '60%', minWidth: 500 }}>
          <TextField
            sx={{
              mb: 1,
              '.css-1rcvvn7-MuiInputBase-root-MuiInput-root:before': {
                border: 'hidden'
              },
              '.css-1rcvvn7-MuiInputBase-root-MuiInput-root.Mui-disabled:before': {
                borderBottomStyle: 'hidden',
                border: 'hidden'
              },
              '& .MuiInputBase-input.Mui-disabled': {
                fontSize: 20,
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
                fontSize: 14,
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
      </Box>

    )
  }

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: '300px' }}>
        <SideButton  >
          <EditNoteOutlinedIcon />
          <ButtonInfo >  Edit</ButtonInfo>
        </SideButton>

        <SideButton >
          <SvgIcon>
            <svg
              viewBox='2 0 24 24'
            >
              <DeleteForeverOutlinedIcon />
            </svg>
          </SvgIcon>
          <ButtonInfo >  Delete</ButtonInfo>
        </SideButton>
      </Box >
      {content}
    </Box >
  )
}

export default SingleBlog