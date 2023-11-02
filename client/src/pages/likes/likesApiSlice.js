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
    getLikeForSingleBlog: builder.query({
      query: ({ id, username }) => ({
        url: `/likes/single?id=${id}&username=${username}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      keepUnusedDataFor: 300,
      providesTags: (result, error, arg) => {
        if (result) {
          return [{
            type: 'Like', id: 'LIST'
          },
          { type: 'Like', id: result._id }
          ]
        } else {
          return [{ type: 'Like', id: 'LIST' }]
        }
      }
    }),
    getSelectedDateLikes: builder.query({
      query: (date) => ({
        url: `/likes/selected-date?date=${date}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {
        const likes = response?.map(like => {
          like.id = like._id
          return like
        })
        return likes
      },
      providesTags: (result, error, arg) => {
        if (result) {
          return [{
            type: 'Like', id: 'LIST'
          },
          { type: 'Like', id: result._id }
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
      invalidatesTags: (result, error, arg) => {
        // { type: 'Blog', id: arg.blog_id } would invalidates the current single blog cache
        return [{ type: 'Like', id: 'LIST' }, { type: 'Blog', id: arg.blog_id }, { type: 'Blog', id: 'LIST' }]
      }
    }),
    deleteLikedFromBlog: builder.mutation({
      // using the blog.id to search like.id also can refresh the blog id cache data as well
      query: ({ id, blogId }) => ({
        url: '/likes',
        method: 'DELETE',
        body: { id, blogId }
      }),
      invalidatesTags: (result, error, arg) => {
        console.log(arg)
        // { type: 'Blog', id: arg.blog_id } would invalidates the current single blog cache
        return [{ type: 'Like', id: arg.id }, { type: 'Blog', id: arg.blogId }, { type: 'Blog', id: 'LIST' }]
      }
    })
  })
})

export const { useGetLikedBlogsFromUserQuery, useGetLikeForSingleBlogQuery, useAddLikedToBlogMutation, useDeleteLikedFromBlogMutation, useGetUserLikedBlogsQuery, useGetSelectedDateLikesQuery } = likesApiSlice