import { Box, Container, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HorizontalSwiper from '../../components/swiper/HorizontalSwiper'
import { useParams } from 'react-router-dom'
import { blogsApiSlice, useGetBlogsQuery } from './blogsApiSlice'
import useAuth from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner'
import ImagesDisplaySlider from './ImagesDisplaySlider'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'

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
          <Box sx={{ width: 500, maxWidth: 1200, height: 'auto' }}>

            <ImagesDisplaySlider row={currentBlog?.images} />

          </Box>
          <Box>
            <Box>
              {currentBlog.title}
            </Box>
            <Box>
              {currentBlog.text}
            </Box>
          </Box>
        </Container>
      </ThemeProvider>

    )

  }

  return content
}

export default SingleBlog