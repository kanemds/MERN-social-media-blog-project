import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  // reducerPath: 'api', default
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4567' }),
  tagTypes: ['Blog', 'User'],
  endpoints: builder => ({})
})

