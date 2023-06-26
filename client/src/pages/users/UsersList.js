import React from 'react'
import { useGetUsersQuery } from './UserApiSlice'
import { Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const columns = [
  { field: 'id', headerName: 'ID', width: 130 },
  { field: 'userName', headerName: 'User Name', width: 130 },
  { field: 'email', headerName: 'E-mail', width: 130 },
  { field: 'roles', headerName: 'Roles', width: 130 },
  { field: 'active', headerName: 'State', width: 130 },
  {
    field: 'createAt',
    headerName: 'Created At',
    type: 'number',
    width: 130,
  },
  {
    field: 'updateAt',
    headerName: 'Last Updated',
    type: 'number',
    width: 130,
  },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  // },
]



const UsersList = () => {

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery()



  let content

  if (isLoading) content = <Typography>Loading...</Typography>

  if (isError) content = <Typography>{error?.data?.message}</Typography>

  if (isSuccess) {


    const { ids, entities } = users
    console.log(entities)

    const reducerArray = Object.values(entities)

    const eachUser = reducerArray.map(user => {
      const userRolesString = user?.roles.toString().replaceAll(',', ', ')
      const createDate = new Date(user?.createdAt)
      const updateDate = new Date(user?.updatedAt)
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      const createDay = new Intl.DateTimeFormat('en-US', options).format(createDate)
      const updateAt = new Intl.DateTimeFormat('en-US', options).format(updateDate)
      return {
        id: user?._id,
        userName: user?.username,
        email: user?.email,
        roles: userRolesString,
        active: user?.active ? 'Active' : 'Inactive',
        createAt: createDay,
        updateAt: updateAt
      }
    })

    console.log(eachUser)

    content = (
      <>

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={eachUser}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>
      </>
    )
  }


  return (
    <>
      <div>UsersList</div>

      {content}

    </>

  )
}

export default UsersList