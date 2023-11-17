import { apiSlice } from "../../app/api/apiSlice"
import { logOut, setCredentials } from "./authSlice"


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
          const { data } = await queryFulfilled
          // console.log(data)
          dispatch(logOut())
          // dispatch(apiSlice.util.resetApiState())
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState())
          }, 900) // clear out the cache data, giving extra time to clear cache data
        } catch (error) {
          console.log(error)
        }
      }
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET'
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const { accessToken } = data
          dispatch(setCredentials({ accessToken }))
        } catch (error) {
          // console.log(error)
        }
      }
    })
  })
})

export const { useLoginMutation, useSendLogOutMutation, useRefreshMutation } = authApiSlice