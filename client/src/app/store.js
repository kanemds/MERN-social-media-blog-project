import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import { setupListeners } from '@reduxjs/toolkit/dist/query'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})


console.log('apiSlice.reducerPath', apiSlice.reducerPath)
console.log('apiSlice.reducer', apiSlice.reducer)

setupListeners(store.dispatch)


// setupListeners() is a function provided by Redux Toolkit's @reduxjs/toolkit/query package. It is used to set up listeners for automatic handling of cache updates and network events related to API queries.

// Automatic cache updates: Cached results are automatically updated when a successful API query result is obtained, reducing the need for redundant network requests.
// Improved performance: Subsequent identical queries can utilize the cached result instead of making new network requests, resulting in faster response times.
// Cache invalidation: When server data is modified, the cache is automatically updated to reflect the changes, ensuring that subsequent queries fetch the latest data.
// Simplified network event handling: Listeners provided by setupListeners() handle network events such as retries, aborts, and online/offline status changes, reducing the need for manual intervention.
// Consistent state management: Automatic handling of cache updates and network events ensures a consistent and up-to-date state across the application.
// Reduced boilerplate code: The automatic handling of cache updates and network events eliminates the need to write custom code for these operations, reducing development effort and potential errors.
// Improved application scalability: The query slice's automatic cache management and network event handling facilitate scaling of API-related functionality without significant manual intervention.
// Enhanced developer experience: By leveraging setupListeners(), developers can focus on business logic rather than manually managing cache and network-related operations.
// Using setupListeners() allows you to harness the full power of Redux Toolkit's query slice and simplify the management of API queries, cache, and network events in your application.


// Without calling setupListeners() for a Redux store using Redux Toolkit's query functionality:
// Cache updates won't happen automatically when a successful API query result is obtained.
// Subsequent identical queries won't use the cached result, resulting in new network requests.
// Cache won't be automatically invalidated when server data is modified, potentially leading to outdated data in subsequent queries.
// Network events such as retries, aborts, and online/offline status changes won't be handled automatically.
// Manual handling of cache updates, cache invalidation, and network events for API queries would be required.
// Additional custom logic and complexity would be needed to manage these aspects.
// Increased potential for errors and inconsistencies in handling cache and network-related operations.
// It is recommended to use setupListeners() for each Redux store that uses Redux Toolkit's query functionality to benefit from the automatic handling of cache updates and network events provided by the query slice.