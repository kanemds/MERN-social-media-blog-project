
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

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
import { createTheme } from '@mui/material'
import DeleteActionButton from './DeleteActionButton'
import { useDeleteUserMutation } from './UserApiSlice'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function UsersTable({ user, smallerThan1459, smallerThan1026, smallerThan971, smallerThan699, smallerThan501, smallerThan401 }) {

  const options = { year: 'numeric', month: 'short', day: 'numeric' }


  const navigate = useNavigate()

  const [active, setActive] = useState(user?.active)
  const [role, setRole] = useState(user?.role)
  const stateActive = active === user?.active ? true : false
  const stateRole = role === user?.role ? true : false

  const handleEdit = (userId) => {
    navigate(`/dash/users/edit/${userId}`)
  }

  const handleChange = (event) => {
    setRole(event.target.value)
  }


  return (

    <TableRow
      key={user._id}

      sx={{
        '&:last-child td, &:last-child th': { border: 0 },

        '&:nth-of-type(odd)': {
          backgroundColor: grey[300],
        },
        '&:nth-of-type(even)': {
          backgroundColor: grey[200],
        },
        '&:hover': {
          backgroundColor: blue[200],
        },

      }}


    >
      <TableCell component="th" scope="row" sx={{ width: '100px' }} >
        {user.avatar ?
          <Avatar src={user.avatar} />
          :
          <Avatar sx={{ backgroundColor: '#bdbdbd' }}>
            <PersonIcon />
          </Avatar>
        }
      </TableCell>

      <TableCell align="left" >
        <Typography sx={{
          minWidth: '80px',
          maxWidth: '160px',
          wordBreak: "break-word",
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 1,
          textOverflow: 'ellipsis',
        }}>
          {user.username}aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        </Typography>
      </TableCell>
      {smallerThan971 ? ''
        :
        <TableCell align="left">{user.email}</TableCell>
      }

      {smallerThan1026 ? ''
        :
        <TableCell align="left">
          {
            <Select
              sx={{
                width: 120,
                color: 'white',
                backgroundColor: role === 'Admin' ? green[700] : role === 'Employee' ? orange[700] : yellow[700],
                "&& fieldset": {
                  border: "none"
                }
              }}
              value={role}
              onChange={handleChange}
            >
              <MenuItem value='User'>User</MenuItem>
              <MenuItem value='Employee'>Employee</MenuItem>
              <MenuItem value='Admin'>Admin</MenuItem>
            </Select>
          }
        </TableCell>
      }

      <TableCell align={smallerThan699 ? 'right' : 'left'}>
        <IconButton
          sx={{ fontSize: 35, color: 'white', backgroundColor: orange[400], '&:hover': { color: orange[400], backgroundColor: 'white' } }}
          onClick={() => handleEdit(user._id)}
        >
          {/* <GridViewIcon sx={{ color: 'white', '&:hover': { color: orange[400] } }} /> */}
          <GridViewIcon />
        </IconButton>
      </TableCell>
      {smallerThan699 ? ''
        :
        <TableCell align="left"><ToggleButton active={active} setActive={setActive} /></TableCell>
      }

      {smallerThan1459 ? '' :
        <>
          <TableCell align="left">{new Intl.DateTimeFormat('en-US', options).format(new Date(user.createdAt))}</TableCell>
          <TableCell align="left">{new Intl.DateTimeFormat('en-US', options).format(new Date(user.updatedAt))}</TableCell>
        </>}

      {smallerThan699 ?
        ''
        :
        <TableCell align="left">
          < SaveActionFromUsersList
            user={user}
            stateActive={stateActive}
            stateRole={stateRole}
            active={active}
            role={role}
          />
        </TableCell>
      }

      {smallerThan501 ? ''
        :
        <TableCell align={smallerThan699 ? 'right' : "left"}>
          <DeleteActionButton userId={user._id} />
        </TableCell>
      }

    </ TableRow>
  )



}