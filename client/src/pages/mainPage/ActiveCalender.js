import * as React from 'react'
import dayjs from 'dayjs'
import { List, Box } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'

function ActionList(props) {
  const { onAccept, onClear, onCancel, onSetToday, className } = props
  const actions = [
    { text: 'Today', method: onSetToday },
    { text: 'Accept', method: onAccept },
    { text: 'Clear', method: onClear },
    { text: 'Cancel', method: onCancel }
  ]

  return (
    // Propagate the className such that CSS selectors can be applied
    <List className={className} sx={{ display: 'flex' }}>
      {actions.map(({ text, method }) => (
        <ListItem key={text} disablePadding>
          <ListItemButton onClick={method}>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

export default function ActiveCalender() {
  return (

    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <StaticDatePicker
        defaultValue={dayjs()}
        orientation='portrait'
        // disablePast={true}
        slotProps={{
          layout: {
            sx: {
              maxWidth: '320px',
              padding: 0,
              margin: 0,
              [`.MuiGrid2-root}`]: {
                display: 'none'
              },
              [`.${pickersLayoutClasses.actionBar}`]: {
                gridColumn: 2,
                gridRow: 3,
              },
              [`.${pickersLayoutClasses.toolbar}`]: {
                gridColumn: 2,
                gridRow: 1,
              },
            },
          },
        }}
        slots={{
          actionBar: ActionList,
        }}
      />
    </LocalizationProvider>

  )
}
