import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import MainPage from './pages/mainPage/MainPage'
import LoginPage from './pages/auth/LoginPage'
import BlogsList from './pages/blogs/BlogsList'
import UsersList from './pages/users/UsersList'
import Dashboard from './pages/dashboard/Dashboard'
import EditUserPage from './pages/users/EditUserPage'
import NewUserPage from './pages/users/NewUserPage'
import RegisterPage from './pages/auth/RegisterPage'
import Prefetch from './pages/auth/Prefetch'


function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
        <Route element={<Prefetch />}>
          <Route path='dash' element={<Dashboard />}>
            <Route path='blogs'>
              <Route index element={<BlogsList />} />
            </Route>

            <Route path='users'>
              <Route index element={<UsersList />} />
              <Route path='edit/:id' element={<EditUserPage />} />
              <Route path='new' element={<NewUserPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )

}

export default App
