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
      keepUnusedDataFor: 300,
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
    getSingleBlog: builder.query({
      query: id => ({
        url: `/blogs/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {
        const id = response._doc._id
        const blog = { ...response._doc, id: id }
        return blog
      },
      providesTags: (result, error, arg) => {
        return [{ type: 'Blog', id: arg.id }]
      }
    }),
    getPaginatedBlogs: builder.query({
      query: (pageNumber) => ({
        url: `/blogs/paginatedBlogs?page=${pageNumber}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {
        const loadedBlogs = response.data.map(blog => {
          blog.id = blog._id
          return blog
        })
        return { ...response, data: loadedBlogs }
      },
      providesTags: (result, error, pageNumber) =>
        result
          ? [
            // Provides a tag for each Blog in the current page,
            // as well as the 'PARTIAL-LIST' tag.
            ...result.data.map(id => ({ type: 'Blog', id })),
            { type: 'Blog', id: 'PARTIAL-LIST' },
          ]
          : [{ type: 'Blog', id: 'PARTIAL-LIST' }],
      // Only have one cache entry because the arg always maps to one string
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        console.log(currentCache)
        console.log(newItems)
        currentCache.data.push(...newItems.data)
      },
      // Refetch when the page arg changes,is the argument in this case: pageNumber
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg
      },
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
        }, {
          type: 'Blog', id: 'PARTIAL-LIST'
        }]
      }
    })
  })
})

export const {
  useGetBlogsQuery,
  useGetSingleBlogQuery,
  useGetPaginatedBlogsQuery,
  useAddNewBlogMutation,
  useUpdateBlogMutation,
  useDeleteUserMutation
} = blogsApiSlice