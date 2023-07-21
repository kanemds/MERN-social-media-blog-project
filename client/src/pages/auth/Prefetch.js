import React, { useEffect } from 'react'
import { store } from '../../app/store'
import { usersApiSlice } from '../users/UserApiSlice'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {

  // ========================================================================================================================

  // redux prefetch

  // useEffect(() => {
  //   console.log('subscribing')
  //   const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())
  //   console.log(users)
  //   return () => {
  //     console.log('unsubscribing')
  //     users.unsubscribe()
  //   }
  // }, []) 


  // ========================================================================================================================

  // rtk query prefetch

  useEffect(() => {
    store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
  })

  return <Outlet />

}

export default Prefetch



// Calling initiate() dispatches the asynchronous API request defined by usersApiSlice.endpoints.getUsers.
// Redux Toolkit's middleware intercepts the action, handles the asynchronous logic, and dispatches additional actions to reflect the different stages of the asynchronous operation.
// The initiate() function returns a promise object that represents the outcome of the API request.
// The returned promise can be used to handle the success and error cases using.then() and.catch() or by defining extraReducers in usersApiSlice.

// users.unsubscribe() is called in the cleanup function returned by useEffect() to cancel or clean up any ongoing operations related to the dispatched API request.
// Unsubscribing or canceling ongoing requests is important to prevent memory leaks and unnecessary network traffic, especially when the component unmounts or when the effect dependencies change.
