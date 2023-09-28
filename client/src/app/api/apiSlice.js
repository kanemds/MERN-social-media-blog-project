import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../pages/auth/authSlice'


// common usage patterns, setting default headers on every request
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:4567',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token

    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }

    return headers
  }
})


// first to check if accessToken exist, if not send request to /auth/refresh to get one or fail to nothing
const baseQueryWithTokenGeneration = async (args, api, extraOptions) => {

  // console.log(args) // print current request url, method, body  
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions) // baseQuery is the the function above
  // console.log(result) // result will depends on the endpoint query CRUD

  if (result?.error?.status === 403) {
    console.log('New token is generating')

    const newGenerateToken = await baseQuery('/auth/refresh', api, extraOptions)

    // if fulfilled 
    // {
    //   data: {… },
    //   meta: {… }
    // }

    // if rejected 
    // {
    //   error: { status: 401, data: { message: '' } },
    //   meta: { request: Request, response: Response }
    // }


    if (newGenerateToken?.data) {

      api.dispatch(setCredentials({ ...newGenerateToken.data }))

      result = await baseQuery(args, api, extraOptions)
    } else {
      if (newGenerateToken?.error?.status === 403) {
        newGenerateToken.error.data.message = 'Login has expired '
      }
      return newGenerateToken
    }
  }
  return result
}



export const apiSlice = createApi({
  // reducerPath: 'api', default
  // baseQuery:fetchBaseQuery({baseUrl: 'http://localhost:4567'}) origin 
  // baseQuery, // set accessToken to headers for every request
  baseQuery: baseQueryWithTokenGeneration, // add additional handling for every request   
  tagTypes: ['Blog', 'User', 'Like', 'Subscribe', 'Bookmark'],
  endpoints: builder => ({})
})


// baseQuery:
// Consistent API Requests: Establishes a uniform approach for making API requests throughout the application.
// Customizable Behavior: Allows customization of default request behavior, such as modifying headers, handling authentication tokens, or adding common request modifications.
// Reusability: Enables reuse of the same configuration across multiple API endpoints, reducing redundancy and promoting code efficiency.
// Centralized Maintenance: Updates or modifications to the baseQuery configuration are reflected across all endpoints that utilize it, simplifying maintenance and promoting code consistency.

