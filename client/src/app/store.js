import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})


console.log(apiSlice.reducerPath)
console.log(apiSlice.reducer)
