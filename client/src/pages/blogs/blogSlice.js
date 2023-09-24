import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  pageNumber: 1
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    increment: (state, action) => {
      state.pageNumber = action.payload
    },
    resetCache: (state) => {
      state.pageNumber = 1
    },
  }
})

export const { increment, resetCache } = blogSlice.actions

export default blogSlice.reducer