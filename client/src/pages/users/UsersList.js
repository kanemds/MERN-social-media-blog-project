import React from 'react'
import { useGetUsersQuery } from './UserApiSlice'
import { Typography } from '@mui/material'
const UsersList = () => {

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery()

  let content

  if (isLoading) content = <Typography>Loading...</Typography>

  if (isError) content = <Typography>{error?.data?.message}</Typography>

  if (isSuccess) {
    content = <Typography>{users}</Typography>
  }

  return (
    <>
      <div>UsersList</div>
      {content}
    </>

  )
}

export default UsersList