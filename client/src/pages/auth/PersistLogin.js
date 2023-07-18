import React, { useEffect, useRef, useState } from 'react'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import { useRefreshMutation } from './authApiSlice'
import { Link, Outlet } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { Box } from '@mui/material'


const PersistLogin = () => {

  const [persist] = usePersist()

  const token = useSelector(selectCurrentToken)

  const effectRan = useRef(false) // due to strict mode runs twice

  const [success, setSuccess] = useState(false)

  const [
    refresh, {
      isUninitialized,
      isSuccess,
      isLoading,
      isError,
      error
    }
  ] = useRefreshMutation()

  useEffect(() => {

    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {

      const verifyRefreshToken = async () => {
        console.log('verifying refresh token')
        try {

          await refresh()

          setSuccess(true)
        }
        catch (error) {
          console.log(error)
        }
      }

      if (!token && persist) verifyRefreshToken()
    }
    return () => effectRan.current = true

    // disable some eslint warring
    // eslint-disable-next-line
  }, [])


  let content

  if (!persist) {
    console.log('Account did not set to persist')
    content = <Outlet />
  } else if (isLoading) {
    console.log('Loading')
    content = <LoadingSpinner />
  } else if (isError) {
    console.log('error')
    content = (
      <Box>
        <ErrorMessage error={error.data} />
        <Link to='/login'>Please login again</Link>
      </Box>
    )
  } else if (isSuccess && success) {
    console.log('success')
    content = <Outlet />
  } else if (token && isUninitialized) {
    console.log(isUninitialized)
    content = <Outlet />
  }




  return content
}

export default PersistLogin