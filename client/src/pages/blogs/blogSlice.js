import { createSlice } from '@reduxjs/toolkit'
import produce from 'immer'

const initialState = {
  pageNumber: 1
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    increment: produce((state, action) => {
      state.pageNumber = action.payload
    }),
    resetCache: produce((state) => {
      state.pageNumber = 1
    }),
  }
})

export const { increment, resetCache } = blogSlice.actions

export default blogSlice.reducer