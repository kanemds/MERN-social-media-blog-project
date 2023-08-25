import { Box, Container, Paper, Typography, TextField, Modal, Button } from '@mui/material'
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

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      ll: 1460,
      xl: 1670,
      xxl: 1950,
      xxxl: 2560,
    },
  },
})

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

  useEffect(() => {
    if (isSuccess) {
      setCurrentBlog(data)
    }
  }, [isSuccess])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const current = Date.parse(new Date())
  const postedDay = Date.parse(currentBlog?.createdAt)
  const sevenDays = 60 * 60 * 24 * 1000 * 7

  const timeInMillisecond = current - postedDay
  const localTime = new Date(Date.parse(currentBlog?.createdAt)).toLocaleString(undefined, timeDisplayOptions.optionTwo)

  console.log(currentBlog.text)

  let content

  if (isLoading) {
    content = (
      <Container sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </Container>
    )
  }

  if (isSuccess) {

    content = (
      <ThemeProvider theme={theme}  >
        <Container sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6, mb: 6 }} maxWidth='xxxl'>
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
        </Container>
      </ThemeProvider>
    )
  }

  return content
}

export default SingleBlog