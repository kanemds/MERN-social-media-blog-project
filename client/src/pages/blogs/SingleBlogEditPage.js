import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useGetBlogsQuery } from './blogsApiSlice'

const SingleBlogEditPage = () => {

  const { id } = useParams()
  const location = useLocation()
  // console.log(id)
  console.log(location)



  const { currentBlog } = useGetBlogsQuery('usersList', {
    selectFromResult: ({ data }) => ({
      currentBlog: data?.entities[id]
    })
  })

  console.log(currentBlog)


  return (
    <div>SingleBlogEditPage</div>
  )
}

export default SingleBlogEditPage