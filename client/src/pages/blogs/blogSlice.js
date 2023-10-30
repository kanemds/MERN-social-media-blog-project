import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  pageNumber: 1,
  logout: false
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
    userLogout: (state, action) => {
      state.logout = action.payload
    }
  }
})

export const { increment, resetCache, userLogout } = blogSlice.actions

export default blogSlice.reducer