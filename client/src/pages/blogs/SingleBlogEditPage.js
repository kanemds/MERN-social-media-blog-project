import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useGetSingleBlogQuery } from './blogsApiSlice'
import { Button, Container } from '@mui/material'

import LoadingSpinner from '../../components/LoadingSpinner'
import SingleBlogEditForm from './SingleBlogEditForm'


const SingleBlogEditPage = () => {

  const { id, username } = useParams()

  const [blog, setBlog] = useState('')

  const currentSingleBlog = {
    id,
    username: username ? username : null
  }

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSingleBlogQuery(currentSingleBlog)


  useEffect(() => {
    if (isSuccess) {
      setBlog(data)
    }
  }, [isSuccess, data])

  console.log(data)

  let content

  if (!blog || isLoading) {
    content = (
      <Container sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </Container>
    )
  }

  if (blog && isSuccess) {
    content = <SingleBlogEditForm blog={blog} />
  }




  return content
}

export default SingleBlogEditPage