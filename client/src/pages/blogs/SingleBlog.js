import { Box, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HorizontalSwiper from '../../components/swiper/HorizontalSwiper'
import { useParams } from 'react-router-dom'
import { blogsApiSlice, useGetBlogsQuery } from './blogsApiSlice'
import useAuth from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner'
import ImagesDisplaySlider from './ImagesDisplaySlider'

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
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </Box>

    )
  }

  if (isSuccess) {
    content = (
      <Box sx={{ width: '100%', height: '100%' }}>
        <Box sx={{ width: '50%', height: '50%' }}>
          <ImagesDisplaySlider row={currentBlog?.images} />
        </Box>
        <Paper>
          {currentBlog.title}
          {currentBlog.text}
        </Paper>
      </Box>)

  }

  return content
}

export default SingleBlog