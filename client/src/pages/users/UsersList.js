
import { useGetUsersQuery } from './UserApiSlice'
import { Typography } from '@mui/material'
import LoadingSpinner from '../../components/LoadingSpinner'
import UserListTable from './UserListTable'
import ErrorMessage from '../../components/ErrorMessage'



const UsersList = () => {


  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery()



  let content

  if (isLoading) return content = <LoadingSpinner />

  if (isError) return content = <ErrorMessage error={error} />

  if (isSuccess) {


    const { ids, entities } = users

    const usersList = Object.values(entities)


    content = usersList.map(user => <UserListTable key={user._id} user={user} />


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