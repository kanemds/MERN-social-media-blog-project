import React, { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { List, Box, styled } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { SideBarContext } from '../../useContext/SideBarContext'
import { timeDisplayOptions } from '../../config/timeDisplayOptions'
import { useLocation } from 'react-router-dom'


function ActionList(props) {
  const { onAccept, onClear, onCancel, onSetToday, className } = props
  const actions = [
    { text: 'Today', method: onSetToday },
    // { text: 'Accept', method: onAccept },
    { text: 'Clear', method: onClear },
    // { text: 'Cancel', method: onCancel }
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

  // dayjs is giving the current timezone no need to convert

  const { selectedDate, setSelectedDate, path, setPath, calendarDate, setCalendarDate } = useContext(SideBarContext)
  const { pathname } = useLocation()

  console.log(selectedDate.frontPage)

  useEffect(() => {
    setPath(pathname)
  }, [pathname])

  const handleSelectedDate = (date) => {

    const timeConvert = date ? new Date(Date.parse(date?.toString())).toLocaleString(undefined, timeDisplayOptions.optionTwo) : null
    if (pathname === '/') {
      setCalendarDate({ ...calendarDate, frontPage: date })
      setSelectedDate({ ...selectedDate, frontPage: timeConvert })
    }
    if (path === '/blogs') {
      setCalendarDate({ ...calendarDate, myPostPage: date })
      setSelectedDate({ ...selectedDate, myPostPage: timeConvert })
    }

    if (path === '/blogs/liked') {
      setCalendarDate({ ...calendarDate, likedPage: date })
      setSelectedDate({ ...selectedDate, likedPage: timeConvert })
    }
    if (path === '/blogs/subscribed') {
      setCalendarDate({ ...calendarDate, subscribePage: date })
      setSelectedDate({ ...selectedDate, subscribePage: timeConvert })
    }
    if (path === '/blogs/bookmarks') {
      setCalendarDate({ ...calendarDate, bookmarkPage: date })
      setSelectedDate({ ...selectedDate, bookmarkPage: timeConvert })
    }
  }

  // display on the sidebar calender
  let displayDate = ''

  if (path === '/') {
    displayDate = calendarDate.frontPage
  }
  if (path === '/blogs/liked') {
    displayDate = calendarDate.likedPage
  }
  if (path === '/blogs/subscribed') {
    displayDate = calendarDate.subscribePage
  }
  if (path === '/blogs/bookmarks') {
    displayDate = calendarDate.bookmarkPage
  }

  return (

    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ maxWidth: '240px', minWidth: '240px', }}>
      <StaticDatePicker

        orientation='portrait'
        // disablePast={true}
        disableFuture={true}
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
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                m: 0,
                P: 0
              },

              [`.MuiPickersYear-root`]: {

                maxWidth: '180px',

                overflow: 'hidden',

                '-webkit-flex-basis': '33%',
              },
              [`.css-1lkpf4l-MuiYearCalendar-root`]: {
                width: '200px',
                '-webkit-flex-basis': '33%',
              },
              [`.css-1beqopj-MuiPickersYear-yearButton`]: {
                width: '50px',
                alignItems: 'center',
                fontSize: '.8rem',
                m: 0,
                P: 0
              },
              [`.css-nk89i7-MuiPickersCalendarHeader-root`]: {
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                m: 0,
                p: 0
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
                height: '240px',
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
        value={displayDate}
        onChange={newDate => handleSelectedDate(newDate)}
      />
    </LocalizationProvider>

  )
}
