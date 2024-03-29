import React, { createContext, useState, useEffect } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useLocation } from 'react-router-dom'



export const SideBarContext = createContext()

const SideBarProvider = ({ children }) => {

  const [selectedDate, setSelectedDate] = useState({
    frontPage: null,
    myPostPage: null,
    subscribePage: null,
    bookmarkPage: null,
    likedPage: null,
    bloggerPage: null
  })
  const [calendarDate, setCalendarDate] = useState({
    frontPage: null,
    myPostPage: null,
    subscribePage: null,
    bookmarkPage: null,
    likedPage: null,
    bloggerPage: null
  })


  const [path, setPath] = useState(null)
  const [state, setState] = useState({
    left: false,
  })

  const [clearSelectedDate, setClearSelectedDate] = useState(false)

  const drawerDirection = ['left']

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
  }


  return (
    <SideBarContext.Provider value={{ state, setState, drawerDirection, toggleDrawer, selectedDate, setSelectedDate, path, setPath, calendarDate, setCalendarDate, clearSelectedDate, setClearSelectedDate }}>
      {children}
    </SideBarContext.Provider>
  )
}

export default SideBarProvider