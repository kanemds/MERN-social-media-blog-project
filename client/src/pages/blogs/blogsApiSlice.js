import { createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const blogsAdapter = createEntityAdapter()

// initialState {[ids:], entities:[]}
const initialState = blogsAdapter.getInitialState()



export const blogsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getBlogs: builder.query({
      query: () => ({
        url: '/blogs',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      transformResponse: responseData => {

        const loadedBlogs = responseData.map(blog => {
          blog.id = blog._id
          return blog
        })

        return blogsAdapter.setAll(initialState, loadedBlogs)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Blog', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Blog', id }))
          ]
        } else {
          return [{ type: 'Blog', id: 'LIST' }]
        }
      }
    }),
    addNewBlog: builder.mutation({
      query: blogData => ({
        url: '/blogs',
        method: 'POST',
        body: blogData
      }),
      invalidatesTags: [{
        type: 'Blog', id: 'LIST'
      }]
    }),
    updateBlog: builder.mutation({
      query: updateData => ({
        url: '/blogs',
        method: 'PATCH',
        body: updateData
      }),
      invalidatesTags: (result, error, arg) => {
        return [{
          type: 'Blog', id: arg.id
        }]
      }
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: '/blogs',
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => {
        return [{
          type: 'Blog', id: arg.id
        }]
      }
    })
  })
})

export const {
  useGetBlogsQuery,
  useAddNewBlogMutation,
  useUpdateBlogMutation,
  useDeleteUserMutation
} = blogsApiSlice