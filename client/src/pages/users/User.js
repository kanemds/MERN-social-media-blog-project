import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectUserById } from './UserApiSlice'



const User = ({ userId }) => {

  const navigate = useNavigate()

  const user = useSelector(state => selectUserById(state, userId))

  let content

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`)

    const userRolesString = user.roles.toString().replaceAll(',', ', ')

    const activeStatus = user.active ? 'Yes' : 'No'

    content = (
      <>

        {userRolesString}
        {activeStatus}
      </>
    )

  } else content = null

  return content






}

export default User