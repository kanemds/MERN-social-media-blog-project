import React, { useEffect, useRef, useState } from 'react'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import { useRefreshMutation } from './authApiSlice'
import { Link, Outlet } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { Box, Typography } from '@mui/material'
import LinkButton from '../../components/LinkButton'



const PersistLogin = () => {

  const [persist] = usePersist()

  const token = useSelector(selectCurrentToken)

  // console.log('selectCurrentToken', token)

  const effectRan = useRef(false) // due to strict mode runs twice



  const [success, setSuccess] = useState(false)

  const [
    refresh, {
      isUninitialized, // When true, indicates that the query has not started yet
      isSuccess,
      isLoading,
      isError,
      error
    }
  ] = useRefreshMutation()

  useEffect(() => {

    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        // console.log('verifying refresh token')
        try {

          await refresh()

          setSuccess(true)
        }
        catch (error) {
        }
      }

      if (!token && persist) verifyRefreshToken()
    }

    // react strict mode runs twice 
    // set effectRan to true after first render,
    // the code the second time will execute the code above during development

    return () => {
      // console.log('clean up')
      effectRan.current = true
    }// clean up which the second time will run clean up first before execute the code

    // disable some eslint warring
    // eslint-disable-next-line
  }, [])


  let content

  if (!persist) {
    // console.log('Account did not set to persist')
    content = <Outlet />
  } else if (isLoading) {
    // console.log('Loading')
    content = (<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <LoadingSpinner />
    </Box>)
  } else if (isError) {
    // console.log('error', error.data)
    // content = (
    //   <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    //     <ErrorMessage error={error.data} />
    //     <Box sx={{ mt: 3 }}>
    //       <LinkButton visit='/login' name='Login' />
    //     </Box>
    //   </Box>
    // )
    content = <Outlet />
  } else if (isSuccess && success) {
    // console.log('success')
    content = <Outlet />
  } else if (token && isUninitialized) {
    // console.log('token and uninit')
    // console.log(isUninitialized)
    content = <Outlet />
  }

  return content
}

export default PersistLogin