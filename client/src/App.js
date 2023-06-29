import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import MainPage from './pages/mainPage/MainPage'
import LoginPage from './pages/auth/LoginPage'
import BlogsList from './pages/blogs/BlogsList'
import UsersList from './pages/users/UsersList'
import Dashboard from './pages/dashboard/Dashboard'
import EditUser from './pages/users/EditUser'


function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path='login' element={<LoginPage />} />

        <Route path='dash' element={<Dashboard />}>
          <Route path='blogs'>
            <Route index element={<BlogsList />} />
          </Route>

          <Route path='users'>
            <Route index element={<UsersList />} />
            <Route path='edit/:id' element={<EditUser />} />
          </Route>
        </Route>

      </Route>
    </Routes>
  )

}

export default App
