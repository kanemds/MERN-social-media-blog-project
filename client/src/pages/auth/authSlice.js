import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, isLoggingOut: false },
  //reducers: An object containing the reducer functions for updating the state.
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload
      state.token = accessToken
    },
    logOut: (state, action) => {
      state.token = null
    },
    onLoggingOut: (state, action) => {
      state.isLoggingOut = action.payload
    },
  }
})

export const { setCredentials, logOut, onLoggingOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = state => state.auth.token