
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import React, { useMemo, useState } from 'react'
import { useGetUsersQuery } from './UserApiSlice'
import { Avatar, FormControl, MenuItem, Paper, Box, InputLabel, Select, Typography, Button, IconButton, TablePagination } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { DataGrid, gridClasses, GridCellParams } from '@mui/x-data-grid'
import PersonIcon from '@mui/icons-material/Person'
import { grey, blue, orange, green, yellow } from '@mui/material/colors'
import ToggleButton from '../../components/ToggleButton'
import SaveActionFromUsersList from './SaveActionFromUsersList'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import ViewCompactIcon from '@mui/icons-material/ViewCompact'
import GridViewIcon from '@mui/icons-material/GridView'
import UsersTable from './UsersTable'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'


const UsersList = () => {


  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error

    // } = useGetUsersQuery(undefined, {
  } = useGetUsersQuery('usersList', {
    // consider if multiples people using same app, shorten the pollingInterval will get the latest update info
    pollingInterval: 1000 * 60, // set period of time refetch 
    refetchOnFocus: true, // refetch data after user is back to this app window
    refetchOnMountOrArgChange: true // remount data cause refetch

  })



  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }


  let content

  if (isLoading) return content = <LoadingSpinner />


  if (isError) return content = <ErrorMessage error={error} />

  if (isSuccess) {

    const { ids, entities } = users

    const usersList = Object.values(entities)


    // content = usersList.map(user => <UserListTable key={user._id} user={user} usersList={usersList} />)
    content = (<Paper sx={{ border: 2, borderColor: blue[500] }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: blue[500] }}>
            <TableRow sx={{ color: 'white' }} >
              <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} >Avatar</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">Username </TableCell>
              <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">E-mail</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">Role</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">View</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">State</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">Created At</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">Last Updated</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">Save</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {usersList.map(user => <UsersTable key={user._id} user={user} />)}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{ color: 'white', backgroundColor: grey[500], fontSize: '1.1rem' }}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={usersList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
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