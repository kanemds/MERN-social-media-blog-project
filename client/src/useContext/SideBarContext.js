import React, { createContext, useState } from 'react'

export const SideBarContext = createContext()

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
    <SideBarContext.Provider value={{ state, setState, drawerDirection, toggleDrawer }}>
      {children}
    </SideBarContext.Provider>
  )
}

export default SideBarProvider