import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:45674' }),
  tagTypes: ['Blog', 'User'],
  endpoints: builder => ({})
})