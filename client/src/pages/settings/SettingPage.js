import React from 'react'

import { useParams } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'

import { useGetUsersQuery } from '../users/UserApiSlice'
import UserSettingForm from './UserSettingForm'

const SettingPage = () => {

  const { id } = useParams()


  const { currentUser } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      currentUser: data?.entities[id]
    })
  })

  // ================================================================================
  let content

  if (!currentUser) return <LoadingSpinner />

  if (currentUser) return <UserSettingForm currentUser={currentUser} />

  return content

}



export default SettingPage