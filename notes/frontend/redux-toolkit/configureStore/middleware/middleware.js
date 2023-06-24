

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV === development ? true : false
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(

  <Provider store={store}>
    <App />
  </Provider>

)

// The purpose of the middleware configuration is to customize the middleware stack used by the Redux store.


// Calling getDefaultMiddleware() retrieves the default middleware stack form Redux.

// .concat(apiSlice.middleware) appends the middleware provided by apiSlice to the default middleware stack.

// const middle = defaultMiddleware.concat(new.middleware)

 
// By combining the default middleware stack with apiSlice.middleware, 
// this allows for seamless integration of API functionality, such as making requests and managing state, within the Redux application.