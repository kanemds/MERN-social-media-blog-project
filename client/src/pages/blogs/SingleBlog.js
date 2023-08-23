import { Box, Container, Paper, Typography, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HorizontalSwiper from '../../components/swiper/HorizontalSwiper'
import { useParams } from 'react-router-dom'
import { blogsApiSlice, useGetBlogsQuery } from './blogsApiSlice'
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


const SingleBlog = () => {

  const { id } = useParams()
  const { username } = useAuth()

  const [currentBlog, setCurrentBlog] = useState('')



  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetBlogsQuery()

  useEffect(() => {
    if (isSuccess) {
      const findUserBlogs = Object.values(data?.entities)?.filter(blog => blog.user === username)
      const blog = findUserBlogs.filter(blog => blog.id === id)
      setCurrentBlog(...blog) // using filter became array, spread out become object
    }
  }, [isSuccess])

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
        <Container sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} maxWidth='xxxl'>
          <Paper sx={{ width: 500, height: 500 }}>
            <ImagesDisplaySlider row={currentBlog?.images} />

          </Paper>
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
          <Box sx={{ width: '60%' }}>
            <TextField
              sx={{
                mb: 1,
                '& .MuiInputBase-input.Mui-disabled': {
                  fontSize: 26,
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
              defaultValue={currentBlog.title}
            />
            <TextField
              sx={{
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