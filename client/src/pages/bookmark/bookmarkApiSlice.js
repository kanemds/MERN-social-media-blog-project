import { createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

export const bookmarkApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getBookmarks: builder.query({
      query: username => ({
        url: `/bookmarks?username=${username}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {
        const loadedBookmarks = response.map(bookmark => {
          bookmark.id = bookmark._id
          return bookmark
        })
        return loadedBookmarks
      },
      providesTags: (result, error, arg) => {
        if (result) {
          return [{
            type: 'Bookmark', id: 'LIST'
          }, {
            ...result.map(each => ({ type: 'Bookmark', id: each._id }))
          }]
        } else {
          return [{ type: 'Bookmark', id: 'LIST' }]
        }
      }
    }),
    addBookmark: builder.mutation({
      query: data => ({
        url: '/bookmarks',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{
        type: 'Bookmark', id: 'LIST'
      }]
    }),
    deleteBookmark: builder.mutation({
      // using the blog.id to search like.id also can refresh the blog id cache data as well
      query: ({ id }) => ({
        url: '/bookmarks',
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => {
        return [
          { type: 'bookmarks', id: arg.id }
        ]
      }
    })
  })
})

export const { useGetBookmarksQuery, useAddBookmarkMutation, useDeleteBookmarkMutation } = bookmarkApiSlice