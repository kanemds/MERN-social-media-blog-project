import React from 'react'
import { selectUserById, useGetUsersQuery } from './UserApiSlice'
import { useParams } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import EditUserForm from './EditUserForm'
import { useSelector } from 'react-redux'

const EditUserPage = () => {

  const { id } = useParams()

  const user = useSelector(state => selectUserById(state, id))
  // keepUnusedDataFor: 5,
  // data will be gone after 5 sec
  // const isExist = user ? 'do something' : 'loading'
  console.log(user)

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