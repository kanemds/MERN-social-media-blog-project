
import { useGetUsersQuery } from './UserApiSlice'
import { Typography } from '@mui/material'

import UserListTable from './UserListTable'




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


    const { ids, entities } = users
    console.log(entities)

    const usersList = Object.values(entities)


    content = (
      <>
        <UserListTable usersList={usersList} />
      </>
    )
  }


  return (
    <>
      <div>UsersList</div>

      {content}

    </>

  )
}

export default UsersList