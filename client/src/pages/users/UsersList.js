import React, { useState } from 'react'
import { useGetUsersQuery } from './UserApiSlice'
import { Avatar, Button, Typography, ToggleButton } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { DataGrid, gridClasses, GridCellParams } from '@mui/x-data-grid'
import PersonIcon from '@mui/icons-material/Person'
import { grey, blue } from '@mui/material/colors'


const ODD_OPACITY = 0.2

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: theme.palette.grey[200],

    // '&:hover, &.Mui-hovered': {
    //   backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
    //   '@media (hover: none)': {
    //     backgroundColor: 'transparent',
    //   },
    // },
    // '&.Mui-selected': {
    //   backgroundColor: alpha(
    //     theme.palette.primary.main,
    //     ODD_OPACITY + theme.palette.action.selectedOpacity,
    //   ),
    //   '&:hover, &.Mui-hovered': {
    //     backgroundColor: alpha(
    //       theme.palette.primary.main,
    //       ODD_OPACITY +
    //       theme.palette.action.selectedOpacity +
    //       theme.palette.action.hoverOpacity,
    //     ),
    //     // Reset on touch devices, it doesn't add specificity
    //     '@media (hover: none)': {
    //       backgroundColor: alpha(
    //         theme.palette.primary.main,
    //         ODD_OPACITY + theme.palette.action.selectedOpacity,
    //       ),
    //     },
    //   },
    // },
  },
  '&.Mui-selected': {
    backgroundColor: 'primary.main'
  }
}))


const UsersList = () => {

  const options = { year: 'numeric', month: 'short', day: 'numeric' }


  const handleToggle = (params: GridCellParams) => {
    // Handle the toggle logic based on the row data
    console.log(params.row.active) // Example: Log the current active state
  }

  const ToggleButtonCell = (params: GridCellParams) => (
    <ToggleButton
      value={params.row.active ? 'Active' : 'Inactive'}
      selected={params.row.active}
      onChange={() => handleToggle(params)}
      size="small"
      color="primary"
    >
      {params.row.active ? 'Active' : 'Inactive'}
    </ToggleButton>
  )


  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery()

  const columns = [

    {
      field: 'avatar',
      headerName: 'Avatar',
      width: 80,
      renderCell: (params) => params.row.avatar ?
        <Avatar src={params.row.avatar} />
        :
        <Avatar><PersonIcon /></Avatar>
      ,
      sortable: false,
      filterable: false,
    },
    { field: 'id', headerName: 'ID', width: 130 },
    { field: 'userName', headerName: 'User Name', width: 130 },
    { field: 'email', headerName: 'E-mail', width: 130 },
    {
      field: 'roles',
      headerName: 'Roles',
      width: 130,
      type: 'singleSelect',
      valueOptions: ['Employee', 'Admin', 'Client'],
      editable: true
    },
    {
      field: 'active',
      headerName: 'State',
      width: 130,
      type: 'boolean',
      editable: true,
      renderCell: params => params.row.active ? 'Active' : 'Inactive',
      sortable: true,
      filterable: true
    },
    {
      field: 'createAt',
      headerName: 'Created At',
      type: 'number',
      width: 130,
      renderCell: params => new Intl.DateTimeFormat('en-US', options).format(new Date(params.row.createAt))
    },
    {
      field: 'updateAt',
      headerName: 'Last Updated',
      type: 'number',
      width: 130,
      renderCell: params => new Intl.DateTimeFormat('en-US', options).format(new Date(params.row.updateAt))
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



  let content

  if (isLoading) content = <Typography>Loading...</Typography>

  if (isError) content = <Typography>{error?.data?.message}</Typography>

  if (isSuccess) {


    const { ids, entities } = users
    console.log(entities)

    const reducerArray = Object.values(entities)

    const eachUser = reducerArray.map(user => {

      return {
        id: user?._id,
        userName: user?.username,
        email: user?.email,
        roles: user?.roles,
        active: user?.active ? 'Active' : 'Inactive',
        createAt: user?.createdAt,
        updateAt: user?.updatedAt,

      }
    })



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
            pageSizeOptions={[5, 10, 20]}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }

            sx={{
              boxShadow: 2,
              border: 2,
              borderColor: 'primary.light',
              '.MuiDataGrid-cell:hover': {
                color: 'white',
              },
              // odd row background
              [`& .${gridClasses.row}.odd`]: {
                backgroundColor: grey[300],
              },
              //  rows css
              [`& .${gridClasses.row}`]: {
                '&.Mui-selected': {
                  backgroundColor: blue[500],
                  color: 'white',
                  '&:hover': {
                    backgroundColor: blue[500]
                  },
                  '& .MuiDataGrid-cell:hover': {
                    color: 'black',
                  },
                },
                '&:hover': {
                  backgroundColor: blue[200],
                },
              }
            }}



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