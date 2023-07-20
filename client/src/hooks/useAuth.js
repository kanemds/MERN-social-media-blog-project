import jwtDecode from 'jwt-decode'

import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../pages/auth/authSlice'

const useAuth = () => {

  const token = useSelector(selectCurrentToken)

  if (token) {
    const decoded = jwtDecode(token)
    const { username, role } = decoded.userInfo

    return { username, role }
  }

  return { username: '', role: '' }

}

export default useAuth