
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import React, { useContext, useEffect, useMemo, useState } from 'react'
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
import useMediaQuery from '@mui/material/useMediaQuery'
import DehazeIcon from '@mui/icons-material/Dehaze'
import { SideBarContext } from '../../useContext/SideBarContext'


const IconButtonStyle = {
  width: '40px', height: '40px'
}


const UsersList = () => {

  const navigate = useNavigate()
  const { toggleDrawer, drawerDirection } = useContext(SideBarContext)


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

  const smallerThan1459 = useMediaQuery('(max-width:1459px)')
  const smallerThan1080 = useMediaQuery('(max-width:1080px)')
  const smallerThan971 = useMediaQuery('(max-width:971px)')
  const smallerThan699 = useMediaQuery('(max-width:699px)')
  const smallerThan501 = useMediaQuery('(max-width:501px)')
  const smallerThan401 = useMediaQuery('(max-width:401px)')

  const hiddenMenu = useMediaQuery('(max-width:791px)')



  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)


  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleBack = () => {
    navigate(-1)
  }


  let content

  if (isLoading) return content = <LoadingSpinner />


  if (isError) return content = <ErrorMessage error={error} />

  if (isSuccess) {

    const { ids, entities } = users

    const usersList = Object.values(entities)


    // content = usersList.map(user => <UserListTable key={user._id} user={user} usersList={usersList} />)
    content = (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', mt: '30px' }}>
        {hiddenMenu ?
          <IconButton style={IconButtonStyle} disableRipple color="primary" sx={{ display: 'flex', justifyContent: 'flex-start', p: '0px', width: '0px' }}
            onClick={toggleDrawer(drawerDirection, true)}
          >
            <DehazeIcon color='primary' />
          </IconButton>
          :
          ''
        }

        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 343 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: blue[500] }}>
                <TableRow sx={{ color: 'white' }} >

                  <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} >Avatar</TableCell>
                  <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">Username </TableCell>
                  {smallerThan971 ? ''
                    :
                    <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">E-mail</TableCell>
                  }

                  {smallerThan1080 ? ''
                    :
                    <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">Role</TableCell>
                  }

                  <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align={smallerThan699 ? 'right' : "left"}>View</TableCell>
                  {smallerThan699 ? ''
                    :
                    <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">State</TableCell>
                  }

                  {smallerThan1459 ? '' :
                    <>
                      <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">Created At</TableCell>
                      <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">Last Updated</TableCell>
                    </>
                  }

                  {smallerThan699 ? ''
                    :
                    <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align="left">Save</TableCell>
                  }
                  {smallerThan501 ? ''
                    :
                    <TableCell sx={{ color: 'white', fontSize: '1.3rem' }} align={smallerThan699 ? 'right' : "left"}>Delete</TableCell>
                  }

                </TableRow>
              </TableHead>
              <TableBody  >
                {usersList.map(user => <UsersTable key={user._id} user={user} smallerThan1459={smallerThan1459} smallerThan1080={smallerThan1080} smallerThan971={smallerThan971} smallerThan699={smallerThan699} smallerThan501={smallerThan501} smallerThan401={smallerThan401} />)}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            sx={{ color: 'white', backgroundColor: grey[500], fontSize: '1rem', '& .MuiTablePagination-input': { marginRight: smallerThan401 ? '10px' : '32px' }, '& .MuiTablePagination-actions': { marginLeft: smallerThan401 ? '0px' : '20px' } }}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={usersList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
        {hiddenMenu ?
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}>
            <Button variant='contained' onClick={handleBack}>Back</Button>
          </Box>

          :
          ''
        }

      </Box >
    )
  }


  return (
    <>


      {content}

    </>

  )
}

export default UsersList