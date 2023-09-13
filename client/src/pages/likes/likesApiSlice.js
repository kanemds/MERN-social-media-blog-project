import { createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const likesAdapter = createEntityAdapter()

const initialState = likesAdapter.getInitialState()

export const likesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getLikedBlogsFromUser: builder.query({
      query: (username) => ({
        url: '/likes/user',
        // validateStatus: (response, result) => {
        //   return response.status === 200 && !result.isError
        // }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {
        console.log(response)
        // const loadedLikes = response.map(like => {
        //   like.id = like._id
        //   return like
        // })
        // return likesAdapter.setAll(initialState, loadedLikes)
      },
      // providesTags: (result, error, arg) => {
      //   if (result?.ids) {
      //     return [
      //       { type: 'Like', id: 'LIST' },
      //       ...result.ids.map(id => ({ type: 'Blog', id }))
      //     ]
      //   } else {
      //     return [{ type: 'Like', id: 'LIST' }]
      //   }
      // }
    })
  })
})

export const { useGetLikedBlogsFromUserQuery } = likesApiSlice