import React from 'react'
import { useGetBlogsQuery } from '../blogs/blogsApiSlice'


const FavoriteBlog = () => {

  const { data } = useGetBlogsQuery()

  console.log(data)

  return (
    <div>FavoriteBlog</div>
  )
}

export default FavoriteBlog