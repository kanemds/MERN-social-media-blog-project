import { createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const likesAdapter = createEntityAdapter()

const initialState = likesAdapter.getInitialState()

export const likesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getLikedBlogsFromUser: builder.query({
      query: (username) => ({
        url: `/likes/user?username=${username}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {
        const loadedLikes = response.map(like => {
          like.id = like._id
          return like
        })
        return likesAdapter.setAll(initialState, loadedLikes)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Like', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Like', id }))
          ]
        } else {
          return [{ type: 'Like', id: 'LIST' }]
        }
      }
    }),
    getUserLikedBlogs: builder.query({
      query: (username) => ({
        url: `/likes/user/blogs?username=${username}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {
        const loadedLikes = response.map(like => {
          like.id = like._id
          return like
        })
        return loadedLikes
      },
      providesTags: (result, error, arg) => {
        if (result) {
          return [{
            type: 'Like', id: 'LIST'
          },
          ...result.map(each => ({ type: 'Like', id: each.likeId }))
          ]
        } else {
          return [{ type: 'Like', id: 'LIST' }]
        }
      }
    }),
    addLikedToBlog: builder.mutation({
      query: likedInfo => ({
        url: '/likes',
        method: 'POST',
        body: likedInfo
      }),
      invalidatesTags: [{
        type: 'Like', id: 'LIST'
      }, { type: 'Blog', id: 'LIST' }]
    }),
    deleteLikedFromBlog: builder.mutation({
      // using the blog.id to search like.id also can refresh the blog id cache data as well
      query: ({ id, likeId }) => ({
        url: '/likes',
        method: 'DELETE',
        body: { id, likeId }
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: 'Like', id: arg.likeId }]
      }
    })
  })
})

export const { useGetLikedBlogsFromUserQuery, useAddLikedToBlogMutation, useDeleteLikedFromBlogMutation, useGetUserLikedBlogsQuery } = likesApiSlice