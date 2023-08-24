
Cache Behavior
https://redux-toolkit.js.org/rtk-query/usage/cache-behavior

getSingleBlog: builder.query({
  query: id => ({
    url: `/blogs/${id}`,
    validateStatus: (response, result) => {
      return response.status === 200 && !result.isError
    }
  }),
  keepUnusedDataFor: 300, < ---------------------------
transformResponse: (response, meta, arg) => {
  const id = response._doc._id
  const blog = { ...response._doc, id: id }
  return blog
},
  providesTags: (result, error, arg) => {
    return [{ type: 'Blog', id: arg.id }]
  }
})

prevent refetech after first data received for 300s

example:
when navigate to single blog page, within time frame 300s, user can go back and forth without any refetch