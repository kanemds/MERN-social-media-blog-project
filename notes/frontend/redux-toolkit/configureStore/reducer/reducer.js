
// First API Slice
const apiSlice1 = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://api1.example.com' }),
  endpoints: builder => ({})
})

// Second API Slice
const apiSlice2 = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://api2.example.com' }),
  endpoints: builder => ({})
})

const store = configureStore({
  reducer: {
    [apiSlice1.reducerPath]: apiSlice1.reducer,
    [apiSlice2.reducerPath]: apiSlice2.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(apiSlice1.middleware)
      .concat(apiSlice2.middleware),
  devTools: process.env.NODE_ENV === 'development',
})


// This example showcases how you can create and configure multiple API slices with distinct reducerPath values to handle different API endpoints or configurations within a single Redux store.