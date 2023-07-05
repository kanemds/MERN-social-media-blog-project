import React from 'react'
import { useGetUsersQuery } from './UserApiSlice'
import { useParams } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import EditUserForm from './EditUserForm'

const EditUserPage = () => {

  const { id } = useParams()

  const { currentUser } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      currentUser: data?.entities[id]
    })
  })

  let content

  if (!currentUser) return <LoadingSpinner />

  if (currentUser) return <EditUserForm currentUser={currentUser} />

  return content

}

export default EditUserPage