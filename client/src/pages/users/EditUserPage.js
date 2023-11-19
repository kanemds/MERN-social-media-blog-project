import React from 'react'
import { selectUserById, useGetUsersQuery } from './UserApiSlice'
import { useParams } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import EditUserForm from './EditUserForm'
import { useSelector } from 'react-redux'
import { memo } from 'react'
import { Box } from '@mui/material'

const EditUserPage = () => {

  const { id } = useParams()


  // ================================================================================

  // const user = useSelector(state => selectUserById(state, id))
  // // keepUnusedDataFor: 5,
  // // data will be gone after 5 sec
  // // const isExist = user ? 'do something' : 'loading'
  // console.log(user)


  // ================================================================================

  // selected data from result(prefetch), no need extra query

  const { currentUser } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      currentUser: data?.entities[id]
    })
  })

  // ================================================================================
  let content

  if (!currentUser) {
    return <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <LoadingSpinner />
    </Box>

  }

  if (currentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <EditUserForm currentUser={currentUser} />
      </Box>
    )
  }

  return content

}

const memoizedEditUser = memo(EditUserPage)

export default memoizedEditUser