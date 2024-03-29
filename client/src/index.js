import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { store } from './app/store'
import { Provider } from 'react-redux'
import ScrollToTop from './components/ScrollToTop'
import SideBarProvider from './useContext/SideBarContext'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'


//  disable the React Developer Tools addon to access the application
if (process.env.NODE_ENV === 'production') disableReactDevTools()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CssBaseline />
      <SideBarProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path='/*' element={<App />} />
          </Routes>
        </BrowserRouter>
      </SideBarProvider>
    </Provider>
  </React.StrictMode>
)
