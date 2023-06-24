import React from 'react'
import { useGetUsersQuery } from './UserApiSlice'
import { Typography } from '@mui/material'
import User from './User'


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

    const { ids } = users

    const tableContent = ids?.length ?
      ids.map(userId => <User key={userId} userId={userId} />)
      : null

    content = tableContent
  }


  return (
    <>
      <div>UsersList</div>

      {content}
    </>

  )
}

export default UsersList