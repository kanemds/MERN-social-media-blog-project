import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LoginPage from './pages/auth/LoginPage'
import BlogsList from './pages/blogs/BlogsList'
import UsersList from './pages/users/UsersList'
import Dashboard from './pages/dashboard/Dashboard'
import EditUserPage from './pages/users/EditUserPage'
import NewUserPage from './pages/users/NewUserPage'
import RegisterPage from './pages/users/RegisterPage'
import Prefetch from './pages/auth/Prefetch'
import PersistLogina from './pages/auth/PersistLogin'
import PersistLogin from './pages/auth/PersistLogin'
import RequireAuth from './pages/auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle'
import NewBlog from './pages/blogs/NewBlog'
import SingleBlog from './pages/blogs/SingleBlog'
import SingleBlogEditPage from './pages/blogs/SingleBlogEditPage'
import BloggerHomePage from './pages/blogs/BloggerHomePage'
import FavoriteBlog from './pages/favorite/FavoriteBlog'
import MainContent from './pages/mainPage/MainContent'
import LikeList from './pages/likes/LikeList'
import SubscribedList from './pages/subscribed/SubscribedList'



function App() {

  useTitle('Enjoying every moment to the fullest')

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route element={<PersistLogin />}>
          <Route index element={<MainContent />} />

          <Route path='/blogs/post/:id' element={<SingleBlog />} />
          {/* prefetch will only execute when user is browsing routes below */}

          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route path='blogs'>
              <Route index element={<BlogsList />} />
              <Route path='post/:id' element={<SingleBlog />} />
              <Route path='liked' element={<LikeList />} />

              <Route path='new' element={<NewBlog />} />
              <Route path='favorite' element={<FavoriteBlog />} />
              <Route path='subscribed' element={<SubscribedList />} />

              <Route path='post/edit/:id' element={<SingleBlogEditPage />} />
              <Route path='user/:id' element={<BloggerHomePage />} />

            </Route>
          </Route>

          {/* <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}> */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route element={<Prefetch />}>
              <Route path='dash' element={<Dashboard />}>

                <Route path='users'>
                  <Route index element={<UsersList />} />
                  <Route path='edit/:id' element={<EditUserPage />} />
                  <Route path='new' element={<NewUserPage />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes >
  )

}

export default App
