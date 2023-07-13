import { apiSlice } from "../../app/api/apiSlice"
import { logOut } from "./authSlice"

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/auth',
        method: 'POST',
        body: credentials
      })
    }),
    sendLogOut: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(logOut())
          dispatch(apiSlice.util.resetApiState()) // clear out the cache data
        } catch (error) {
          console.log(error)
        }
      }
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET'
      })
    })
  })
})

export const { useLoginMutation, useSendLogOutMutation, useRefreshMutation } = authApiSlice