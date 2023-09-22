import React, { createContext, useState } from 'react'

export const SmallSideBarContext = createContext()

const SideBarProvider = ({ children }) => {
  const [state, setState] = useState({
    left: false,
  })

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
    <SmallSideBarContext.Provider value={{ state, setState, drawerDirection, toggleDrawer }}>
      {children}
    </SmallSideBarContext.Provider>
  )
}

export default SideBarProvider