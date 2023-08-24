import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useGetSingleBlogQuery } from './blogsApiSlice'
import { Button } from '@mui/material'

const SingleBlogEditPage = () => {

  const { id } = useParams()
  const { state } = useLocation()



  const [blog, setBlog] = useState('')
  const [check, setCheck] = useState('')
  const [isSkip, setIsSkip] = useState(true)
  // console.log(id)


  const { data, isLoading, isSuccess, isError } = useGetSingleBlogQuery(id, { skip: isSkip })

  console.log('state', state)
  console.log('data', data)

  useEffect(() => {
    if (state) {
      setBlog(state)
    } else {
      setIsSkip(false)
    }
  }, [state])

  useEffect(() => {
    if (!isSkip && isSuccess) {
      setBlog(data)
    }
  }, [isSuccess, isSkip, data])



  let content




  return content
}

export default SingleBlogEditPage