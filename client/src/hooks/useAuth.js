import jwtDecode from 'jwt-decode'

import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../pages/auth/authSlice'

const useAuth = () => {

  const token = useSelector(selectCurrentToken)

  if (token) {
    const decoded = jwtDecode(token)
    const { username, userId, role, } = decoded.userInfo

    return { username, userId, role }
  }

  return { username: '', userId: '', role: '' }

}

export default useAuth