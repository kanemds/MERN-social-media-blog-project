import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useDeleteBlogMutation, useGetSingleBlogQuery } from './blogsApiSlice'
import { Button, Container } from '@mui/material'

import LoadingSpinner from '../../components/LoadingSpinner'
import SingleBlogEditForm from './SingleBlogEditForm'


const SingleBlogEditPage = () => {

  const { id, username } = useParams()
  const [blog, setBlog] = useState('')

  const currentSingleBlog = {
    id: id ? id : '',
    username: username ? username : null
  }

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSingleBlogQuery(currentSingleBlog)

  const [
    deleteBlog,
    {
      data: message,
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      error: deleteError
    }
  ] = useDeleteBlogMutation()


  useEffect(() => {
    if (isSuccess) {
      setBlog(data)
    }
  }, [isSuccess, data])

  console.log(blog)

  let content

  if (isLoading) {
    content = (
      <Container sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </Container>
    )
  }

  if (blog && isSuccess) {
    content = <SingleBlogEditForm blog={blog} deleteBlog={deleteBlog} message={message} isDeleteSuccess={isDeleteSuccess} isDeleteLoading={isDeleteLoading} />
  }




  return content
}

export default SingleBlogEditPage