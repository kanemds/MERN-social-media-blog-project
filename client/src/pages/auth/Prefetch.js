import React, { useEffect } from 'react'
import { store } from '../../app/store'
import { usersApiSlice } from '../users/UserApiSlice'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
  useEffect(() => {
    console.log('subscribing')
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())
    console.log(users)
    return () => {
      console.log('unsubscribing')
      users.unsubscribe()
    }
  }, [])

  return <Outlet />

}

export default Prefetch