import React from 'react'

import { useParams } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'

import { useGetUsersQuery } from '../users/UserApiSlice'
import UserSettingForm from './UserSettingForm'
import { Box } from '@mui/material'

const SettingPage = () => {

  const { id } = useParams()


  const { currentUser } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      currentUser: data?.entities[id]
    })
  })

  // ================================================================================
  let content

  if (!currentUser) content = <LoadingSpinner />

  if (currentUser) content = <UserSettingForm currentUser={currentUser} />

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >

      {content}
    </Box>
  )

}



export default SettingPage