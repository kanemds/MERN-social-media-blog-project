import { createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const blogsAdapter = createEntityAdapter()

// initialState {[ids:], entities:[]}
const initialState = blogsAdapter.getInitialState()


export const blogsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSingleBlog: builder.query({
      query: (currentSingleBlog) => ({
        url: `/blogs/${currentSingleBlog.id}?username=${currentSingleBlog.username}`,
        // validateStatus: (response, result) => {
        //   console.log(response, result)
        //   return response.status === 200 && !result.isError
        // }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {
        if (response) {

          const id = response._id
          const blog = { ...response, id: id }
          return blog
        } else {
          return
        }

      },
      providesTags: (result, error, arg) => {
        // console.log(arg)
        // console.log(result)
        return [{ type: 'Blog', id: arg.id }]
      }
    }),
    getUserBlogsFromUserId: builder.query({
      query: (id) => ({
        url: `/blogs/user?id=${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {
        if (Array.isArray(response)) {
          const loadedBlogs = response?.map(blog => {
            blog.id = blog._id
            return blog
          })
          return loadedBlogs
        } else {
          return []
        }

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
    getBloggerHomePage: builder.query({
      query: (bloggerInfo) => ({
        url: `/blogs/blogger/${bloggerInfo.id}?username=${bloggerInfo.username}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {
        const { blogs } = response
        if (!blogs.length) {
          return response
        } else {
          const loadedBlogs = blogs?.map(blog => {
            blog.id = blog._id
            return blog
          })
          return { ...response, blogs: loadedBlogs }
        }
      },
      providesTags: (result, error, arg) => {
        if (result) {
          const { blogs } = result
          return [
            { type: 'Blog', id: 'LIST' },
            { type: 'Like', id: 'LIST' }, { type: 'Bookmark', id: 'LIST' },
            ...blogs.map(blog => ({ type: 'Blog', id: blog._id }, { type: 'Like', id: blog.like_data.like_id }, { type: 'Bookmark', id: blog.bookmark_data.bookmark_id }))
          ]
        } else {
          return [{ type: 'Blog', id: 'LIST' }, { type: 'Like', id: 'LIST' }, { type: 'Bookmark', id: 'LIST' }]
        }
      }
    }),
    getPaginatedBlogs: builder.query({
      query: (info) => ({
        url: `/blogs/paginatedBlogs?page=${info.page}&username=${info.username}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {

        const loadedBlogs = response?.data?.map(blog => {
          blog.id = blog._id
          return blog
        })
        return { ...response, data: loadedBlogs }
      },
      providesTags: (result, error, pageNumber) => {
        if (result?.data?.length >= 1) {
          const { data } = result
          return [
            { type: 'Blog', id: 'LIST' },
            { type: 'Like', id: 'LIST' }, { type: 'Bookmark', id: 'LIST' },
            ...data.map(blog => ({ type: 'Blog', id: blog._id }, { type: 'Like', id: blog.like_data.like_id }, { type: 'Bookmark', id: blog.bookmark_data.bookmark_id }))
          ]
        } else {
          return [{ type: 'Blog', id: 'LIST' }, { type: 'Like', id: 'LIST' }, { type: 'Bookmark', id: 'LIST' }]
        }
      },
      // // Only have one cache entry because the arg always maps to one string
      // serializeQueryArgs: ({ endpointName }) => {
      //   return endpointName
      // },
      // // Always merge incoming data to the cache entry
      // merge: (currentCache, newItems) => {
      //   // const checkDuplicate = newItems.filter(currentCache.data)
      //   if (!currentCache || !newItems?.data) {
      //     return currentCache
      //   } else {
      //     // return currentCache.data.push(...newItems?.data) // throw a promise error
      //     const updatedData = [...currentCache.data, ...newItems.data]
      //     return { ...currentCache, data: updatedData }
      //   }
      // },
      // // Refetch when the page arg changes,is the argument in this case: pageNumber
      // forceRefetch({ currentArg, previousArg }) {

      //   return currentArg !== previousArg
      // },
    }),
    getSelectedDateBlogsFromHomePage: builder.query({
      query: (info) => ({
        url: `/blogs/selected-date/${info.id}?date=${info.date}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      keepUnusedDataFor: 300,
      transformResponse: (response, meta, arg) => {
        const loadedBlogs = response?.map(blog => {
          blog.id = blog._id
          return blog
        })
        return loadedBlogs
      },
      providesTags: (result, error, pageNumber) => {
        if (result?.data && Array.isArray(result?.data)) {
          return [
            // Provides a tag for each Blog in the current page,
            // as well as the 'PARTIAL-LIST' tag.
            ...result?.data?.map(blog => ({ type: 'Blog', id: blog.id })),
            { type: 'Blog', id: 'LIST' }
          ]
        } else {
          return [{ type: 'Blog', id: 'LIST' }]
        }
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
    deleteBlog: builder.mutation({
      query: ({ id }) => ({
        url: '/blogs',
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => {
        return [{
          type: 'Blog', id: arg.id
        },
        { type: 'Blog', id: 'LIST' },
        ]
      }
    })
  })
})

export const {
  useGetSingleBlogQuery,
  useGetPaginatedBlogsQuery,
  useGetBloggerHomePageQuery,
  useAddNewBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetUserBlogsFromUserIdQuery,
  useGetSelectedDateBlogsFromHomePageQuery
} = blogsApiSlice