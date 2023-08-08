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
import './mainPageStyle.css'

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



    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ maxWidth: '240px', minWidth: '240px', }}>
      <StaticDatePicker
        defaultValue={dayjs()}
        orientation='portrait'
        // disablePast={true}
        slotProps={{
          layout: {
            sx: {
              minWidth: '240px',
              maxWidth: '240px',
              [`.MuiGrid2-root`]: {
                display: 'none',

              },
              [`.MuiPickersLayout-root`]: {
                display: 'none',
              },
              [`.MuiPickersLayout-contentWrapper `]: {
                minWidth: '240px',
                maxWidth: '240px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 0,
                m: 0
              },
              [`.MuiTypography-overline`]: {
                display: 'none',
              },
              [`.MuiPickersCalendarHeader-label`]: {
                m: 0,
                P: 0
              },
              [`.MuiPickersCalendarHeader-root`]: {
                display: 'flex',
                justifyContent: 'space-between',
                m: 0,
                P: 0
              },
              [`.css-nk89i7-MuiPickersCalendarHeader-root`]: {
                display: 'flex',
                justifyContent: 'space-between',
                m: 0,
                P: 0
              },
              [`.MuiTypography-root`]: {
                fontSize: '1rem',
              },
              [`.MuiButtonBase-root`]: {
                fontSize: '.7rem',

                height: '25px'
              },
              [`.MuiPickersActionBar-root`]: {
                width: '25px',
                height: '25px'
              },
              [`.MuiDateCalendar-root`]: {
                width: 220,
              },
              [`.MuiPickersLayout-actionBar`]: {
                width: '240px',
              },
              [`.MuiPickersLayout-root`]: {
                width: '240px',
              },
              [`.MuiPickersLayout-toolbar`]: {
                width: '240px',
              },
              [`.MuiPickersToolbar-root`]: {
                display: 'none',
                // alignItems: 'center',
                // width: '240px',
              },
              // [`.MuiDatePickerToolbar-title`]: {
              //   alignItems: 'center',
              //   width: '240px',
              // },

              [`.${pickersLayoutClasses.actionBar}`]: {
                gridColumn: 2,
                gridRow: 3,

              },

              [`.${pickersLayoutClasses.contentWrapper}`]: {
                height: '290px',
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
