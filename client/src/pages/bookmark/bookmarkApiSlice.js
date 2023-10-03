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
          },
          // return {type:'Bookmark',id:id},{type:'Bookmark',id:id},
          ...result.map(each => ({ type: 'Bookmark', id: each.bookmarkId }))
          ]
        } else {
          // for other endpoint to invalidates this get request
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
      invalidatesTags: (result, error, arg) => {
        // { type: 'Blog', id: arg.blog_id } would invalidates the current single blog cache
        return [{ type: 'Bookmark', id: 'LIST' }, { type: 'Blog', id: arg.blog_id }]
      }
    }),
    deleteBookmark: builder.mutation({
      // using the blog.id to search like.id also can refresh the blog id cache data as well
      query: ({ id, blogId }) => ({
        url: '/bookmarks',
        method: 'DELETE',
        body: { id, blogId }
      }),
      invalidatesTags: (result, error, arg) => {
        return [
          { type: 'Bookmark', id: arg.id },
          { type: 'Blog', id: arg.blogId }
        ]
      }

    })
  })
})

export const { useGetBookmarksQuery, useAddBookmarkMutation, useDeleteBookmarkMutation } = bookmarkApiSlice