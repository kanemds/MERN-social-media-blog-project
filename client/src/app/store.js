import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'

export const store = configureStore({
  reducer: {},
  devTools: process.env.NODE_ENV === development ? true : false
})