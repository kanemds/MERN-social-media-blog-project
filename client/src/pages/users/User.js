import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectUserById } from './UserApiSlice'

import { selectUsersResult } from './UserApiSlice'

const User = ({ userId }) => {

  const navigate = useNavigate()

  const user = useSelector(state => selectUserById(state, userId)
  )


  const usersResult = useSelector(selectUsersResult)

  console.log(usersResult.data)


  return (
    <div>{user.username}</div>
  )
}

export default User