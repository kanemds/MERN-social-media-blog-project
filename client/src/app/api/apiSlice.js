import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


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


export const apiSlice = createApi({
  // reducerPath: 'api', default
  baseQuery,
  tagTypes: ['Blog', 'User'],
  endpoints: builder => ({})
})

