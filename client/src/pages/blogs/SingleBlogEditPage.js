import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useGetSingleBlogQuery } from './blogsApiSlice'
import { Button, Container } from '@mui/material'

import LoadingSpinner from '../../components/LoadingSpinner'
import SingleBlogEditForm from './SingleBlogEditForm'


const SingleBlogEditPage = () => {

  const { id } = useParams()
  const { state } = useLocation()



  const [blog, setBlog] = useState('')
  const [isReady, setIsReady] = useState(true)
  const [isSkip, setIsSkip] = useState(true)



  const { data, isLoading, isSuccess, isError } = useGetSingleBlogQuery(id)


  useEffect(() => {
    if (!state) {
      setBlog(state)
      setIsReady(false)
    } else {
      setIsSkip(false)
    }
  }, [state])

  useEffect(() => {
    if (!isSkip && isSuccess) {
      setIsReady(isLoading)
      setBlog(data)
    }
  }, [isSuccess, isSkip, data])

  let content

  if (isReady) {
    content = (
      <Container sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </Container>
    )
  }

  if (blog) {
    content = <SingleBlogEditForm blog={blog} />
  }




  return content
}

export default SingleBlogEditPage