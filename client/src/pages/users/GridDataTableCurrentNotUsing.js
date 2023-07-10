import React, { useMemo, useState } from 'react'
import { useGetUsersQuery } from './UserApiSlice'
import { Avatar, FormControl, MenuItem, Paper, Box, InputLabel, Select, Typography, Button, IconButton } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { DataGrid, gridClasses, GridCellParams } from '@mui/x-data-grid'
import PersonIcon from '@mui/icons-material/Person'
import { grey, blue, orange, green, yellow } from '@mui/material/colors'
import ToggleButton from '../../components/ToggleButton'
import SaveActionFromUsersList from './SaveActionFromUsersList'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import ViewCompactIcon from '@mui/icons-material/ViewCompact'
import GridViewIcon from '@mui/icons-material/GridView'


const UserListTable = ({ user, usersList }) => {



  const navigate = useNavigate()


  const [active, setActive] = useState(user?.active)
  const [role, setRole] = useState(user?.role)


  const userRow = [{
    id: user?._id,
    userName: user?.username,
    email: user?.email,
    role: role,
    active: active,
    createAt: user?.createdAt,
    updateAt: user?.updatedAt,
  }]




  const options = { year: 'numeric', month: 'short', day: 'numeric' }

  const handleEdit = (userId) => {
    navigate(`/dash/users/edit/${userId}`)
  }

  const handleChange = (event) => {
    setRole(event.target.value)
  }




  const columns = useMemo(() => [

    {
      field: 'avatar',
      headerName: 'Avatar',
      width: 80,
      renderCell: (params) => params.row.avatar ?
        <Avatar src={params.row.avatar} />
        :
        <Avatar sx={{ backgroundColor: grey[600] }}><PersonIcon /></Avatar>
      ,
      sortable: false,
      filterable: false,
    },
    { field: 'id', headerName: 'ID', width: 130 },
    { field: 'userName', headerName: 'User Name', width: 130 },
    { field: 'email', headerName: 'E-mail', width: 130 },
    {
      field: 'role',
      headerName: 'Role',
      width: 200,
      // type: 'singleSelect',
      // valueOptions: ['User', 'Employee', 'Admin'],
      // type: 'actions',
      // valueOptions: ['User', 'Employee', 'Admin'],
      // editable: true,
      renderCell: params =>
      // console.log(params.formattedValue)
      // setRole(params.formattedValue)
      (

        <Select

          sx={{
            width: 120,
            color: 'white',
            backgroundColor: role === 'Admin' ? green[700] : role === 'Employee' ? orange[700] : yellow[700],
            "&& fieldset": {
              border: "none"
            },
            // "&:hover": {
            //   "&& fieldset": {
            //     border: "none"
            //   }
            // }
          }}
          value={params.row.role}
          onChange={handleChange}
        >
          <MenuItem value='User'>User</MenuItem>
          <MenuItem value='Employee'>Employee</MenuItem>
          <MenuItem value='Admin'>Admin</MenuItem>
        </Select>
      )

    },
    {
      field: 'view',
      headerName: 'View',
      width: 130,
      renderCell: params => (
        <IconButton
          sx={{ fontSize: 35, color: 'white', backgroundColor: orange[400], '&:hover': { color: orange[400], backgroundColor: 'white' } }}
          onClick={() => handleEdit(params.id)}
        >
          {/* <GridViewIcon sx={{ color: 'white', '&:hover': { color: orange[400] } }} /> */}
          <GridViewIcon />
        </IconButton>
      )
    },
    {
      field: 'active',
      headerName: 'State',
      width: 170,
      type: 'boolean',
      renderCell: params => {
        return (
          <ToggleButton active={params.row.active} setActive={setActive} />
        )
      },
      sortable: true,
      filterable: true,
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
    {
      field: 'actions',
      headerName: 'actions',
      type: 'actions',
      renderCell:
        params => {
          const stateActive = params.row.active === user?.active ? true : false
          const stateRole = params.row.role === user?.role ? true : false
          return (
            < SaveActionFromUsersList
              params={params}
              stateActive={stateActive}
              stateRole={stateRole}
            />)
        }
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
  ],
    [user, role]
  )

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={userRow}
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
            backgroundColor: grey[400],
          },
          [`& .${gridClasses.row}.even`]: {
            backgroundColor: grey[200],
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
  )
}

export default UserListTable