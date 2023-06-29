import React, { useEffect, useState } from 'react'
import { useAddNewUserMutation } from './UserApiSlice'
import { useNavigate } from 'react-router-dom'




const NewUserForm = () => {

  const [
    addNewUser,
    {
      isLoading,
      isSuccess,
      isError,
      error
    }
  ] = useAddNewUserMutation()

  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      setUsername('')
      setEmail('')
      setPassword('')
      navigate('/')
    }
  }, [isSuccess, navigate])

  //  ======================REGEX=============================

  USER_REGEX = /^[A-z]{4,20}$/

  PASSWORD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

  EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  //  ======================REGEX=============================

  //  ======================store input=============================

  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [role, setRole] = useState('User')

  //  ======================store input=============================

  //  ======================check validation=============================

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setEmail(EMAIL_REGEX.test(email))
  }, [email])

  useEffect(() => {
    setPassword(PASSWORD_REGEX.test(password))
  }, [password])

  //  ======================check validation=============================


  return (
    <div>NewUserForm</div>
  )
}

export default NewUserForm