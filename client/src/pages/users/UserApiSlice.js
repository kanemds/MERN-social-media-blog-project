import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '/users',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      // specifies that unused data will be retained for 5 seconds.
      keepUnusedDataFor: 5,
      // change format from  [{id,username}, {…}]
      // to  {ids: Array(2), entities: {…}}
      transformResponse: responseData => {
        const loadedUsers = responseData.map(user => {
          user.id = user._id
          return user
        })
        // setAll(currentState,replace the currentState)
        return usersAdapter.setAll(initialState, loadedUsers)
      },
      providesTags: (result, error, arg) => {
        console.log(result)
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'User', id }))
          ]
        } else return [{ type: 'User', id: 'LIST' }]
      }
    })
  })
})

export const {
  //  hook generated by the API slice, providing access to the 
  useGetUsersQuery
} = usersApiSlice



// using builder.query() it automatically generates a set of hooks and selectors, including the select() method for that endpoint
// The select() method takes no arguments and returns a selector function. 



export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// By calling this selector function with useSelector, you can access the result of the getUsers query from the Redux store's state in your component.

// const usersResult = useSelector(selectUsersResult);
// return:
// data: { ids: Array(2), entities: {… } }
// endpointName: "getUsers"
// fulfilledTimeStamp: 1687638568305
// isError: false
// isLoading: false
// isSuccess: true
// isUninitialized: false
// requestId: "b5vnBUgZeat8KoqsOQJBL"
// startedTimeStamp: 1687638568265
// status: "fulfilled"


// the second arg stores data from the first arg.
// the stored data from second arg will changed only the first arg update
// else the request data will send from the stored data object 

const selectUsersData = createSelector(
  selectUsersResult,
  // the stored data is specific from  selectUsersResult.data which is data: { ids: Array(2), entities: {… } }
  selectUsersResultObject => selectUsersResultObject.data
)


export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)

// in this case, selectUsersData(state) is used to check if the state contains the desired data.

// The selectUsersData selector is created using createSelector, and its purpose is to extract the data property from the selectUsersResult object. 
// By invoking selectUsersData(state), you are checking if the data property exists in the provided state.

// If the data property exists and is not undefined or null, selectUsersData(state) will return the value of the data property. Otherwise, it will return undefined.

// The ?? operator is then used to provide a fallback value (initialState) in case the data property is not present or is undefined in the state.



// other case

// By passing selectTodos to todosAdapter.getSelectors, you ensure that the selectors are based on the correct slice of the state containing the todos data.

// export const selectTodos = (state) => state.todos;
// export const {
//   selectAll: selectAllTodos,
//   selectById: selectTodoById,
//   selectIds: selectTodoIds,
//   selectEntities: selectTodoEntities,
// } = todosAdapter.getSelectors(selectTodos);
