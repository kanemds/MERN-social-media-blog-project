import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4567' }),
  tagTypes: ['Blog', 'User'],
  endpoints: builder => ({})
})

