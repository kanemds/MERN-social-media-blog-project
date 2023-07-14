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

// const baseQueryWithTokenGeneration = async (args, api, extraOptions) => {

//   console.log(args) // request url, method, body
//   // console.log(api) // signal, dispatch, getState()
//   // console.log(extraOptions) //custom like {shout: true}

//   let result = await baseQuery(args, api, extraOptions)
//   console.log(result)

//   if (result?.error?.status === 403) {
//     console.log('New token is generating')

//     const refreshToken = await baseQuery('/auth/refresh', api, extraOptions)

//     if (refreshToken?.data) {

//       console.log(refreshToken)
//       console.log(refreshToken?.data)

//       api.dispatch(setCredentials({ ...refreshToken.data }))

//       result = await baseQuery(args, api, extraOptions)
//     } else {
//       if (refreshToken?.error?.status === 403) {
//         refreshToken.error.data.message = 'Login has expired'
//       }
//       return refreshToken
//     }
//   }
//   return result
// }


export const apiSlice = createApi({
  // reducerPath: 'api', default
  // baseQuery: baseQueryWithTokenGeneration,
  baseQuery,
  tagTypes: ['Blog', 'User'],
  endpoints: builder => ({})
})

