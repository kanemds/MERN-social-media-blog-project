import { createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const subscribeAdapter = createEntityAdapter()

const initialState = subscribeAdapter.getInitialState()

export const subscribeApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUserSubscribedBlogs: builder.query({
      query: (username) => ({
        url: `/subscribe?username=${username}`,
        ValidityState: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {
        const loadedSubscribed = response.map(subscribe => {
          subscribe.id = subscribe._id
          return subscribe
        })
        return loadedSubscribed
      },
      providesTags: (result, error, arg) => {
        if (result) {
          return [{
            type: 'Subscribe', id: 'LIST'
          },
          ...result.map(each => ({ type: 'Subscribe', id: each.id }))
          ]
        } else {
          return [{ type: 'Subscribe', id: 'LIST' }]
        }
      }
    }),
    addSubscribedBlog: builder.mutation({
      query: subscribedInfo => ({
        url: '/subscribe',
        method: 'POST',
        body: subscribedInfo
      }),
      invalidatesTags: [{
        type: 'Subscribe', id: 'LIST'
      }, {
        type: 'Blog', id: 'LIST'
      }]
    }),
    deleteSubscribedFromBlog: builder.mutation({
      query: ({ id }) => ({
        url: '/subscribe',
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => {
        console.log(arg.id)
        return [
          { type: 'Subscribe', id: arg.id }
        ]
      }
    })
  })
})

export const { useGetUserSubscribedBlogsQuery, useAddSubscribedBlogMutation, useDeleteSubscribedFromBlogMutation } = subscribeApiSlice