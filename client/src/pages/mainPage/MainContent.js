import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import ActiveCalender from '../blogs/ActiveCalender'
import { Box, Button, Paper, Container, Typography, IconButton, AppBar, Toolbar, SvgIcon } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import Note from '../../components/Note'
import FrontPageSearchBar from '../../components/FrontPageSearchBar'
import { blue } from '@mui/material/colors'
import FrontPageSideBar from '../../components/FrontPageSideBar'
import { useGetPaginatedBlogsQuery } from '../blogs/blogsApiSlice'
import LoadingSpinner from '../../components/LoadingSpinner'
import useAuth from '../../hooks/useAuth'
import DehazeIcon from '@mui/icons-material/Dehaze'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useGetLikedBlogsFromUserQuery } from '../likes/likesApiSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { increment, resetCache, userLogout } from '../blogs/blogSlice'
import { entries, set } from 'lodash'
import { apiSlice } from '../../app/api/apiSlice'
import ClientSearchBar from '../../components/ClientSearchBar'
import MainBlog from './MainBlog'
import { SideBarContext } from '../../useContext/SideBarContext'




const Root = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center'
  },
}))


const SearchBarWidth = styled(Box)(({ theme }) => ({

  [theme.breakpoints.up('md')]: {
    width: '80%'
  },
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    justifyContent: 'center',
    width: '80%'
  },
}))

const PreView = styled(Button)({
  textTransform: 'none',
  background: blue[300]
})

const IconButtonStyle = {
  width: '40px', height: '40px'
}


const buttonStyle = {
  padding: '4px',
}


const dataList = [{ id: 1, 'type': 'All' }, { id: 2, 'type': 'Recently Upload' }]



const MainContent = () => {



  const { username, userId } = useAuth()
  const dispatch = useDispatch()
  const { pageNumber } = useSelector((state) => state?.blog)
  const logout = useSelector(state => state.blog.logout)

  console.log(logout)


  const small = useMediaQuery('(max-width:791px)')
  const smallScreenSize = useMediaQuery('(min-width:600px)')

  const { state, setState, drawerDirection, toggleDrawer } = useContext(SideBarContext)
  const [page, setPage] = useState(1)
  const [isSelected, setIsSelected] = useState('All')
  const [allBlogs, setAllBlogs] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isSearch, setIsSearch] = useState(false)
  const [maxPage, setMaxPage] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [isReFetch, setIsReFetch] = useState(false)

  const observer = useRef(null)


  const {
    data: paginatedData,
    isSuccess: paginatedIsSuccess,
    isLoading: paginatedIsLoading,
    refetch
  } = useGetPaginatedBlogsQuery(Number(page)) // when dependency change it re-retch

  console.log(paginatedData)


  useEffect(() => {
    if (logout) {
      setAllBlogs([])
      dispatch(userLogout(false))
    }
    if (page === paginatedData?.numberOfPages) {
      setHasMore(false)
    }
    if (paginatedIsSuccess) {
      if (username) {
        setAllBlogs([...new Set([...allBlogs, ...paginatedData.data])])
      } else {
        const withoutUser = paginatedData?.data?.filter(blog => blog.username !== username)
        setAllBlogs([...new Set([...allBlogs, ...withoutUser])])
      }
    }
  }, [paginatedData, logout]) // needs paginatedData as dependency for the latest update


  const handleNext = () => {
    setPage(prev => prev + 1)
  }
  const handlePrev = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1)
    }
  }
  const handleSelect = (e) => {
    setIsSelected(e.target.value)
  }


  const handleSearch = () => {
    if (!searchInput.length) return console.log('nothing')
    const inputLowerCase = searchInput.toLowerCase()
    // console.log([...inputLowerCase]) // ['s', 'd', 'f', 'd', 's']
    const result = allBlogs.filter(blog =>
      [inputLowerCase].some(character => blog.title.toLowerCase().includes(character) || blog.text.toLowerCase().includes(character))
    )

    if (!result.length) {
      setSearchInput('')
      setIsSearch(true)
      return setSearchResult('No search results found for blog(s)')
    } else {
      setSearchInput('')
      setIsSearch(true)
      return setSearchResult(result)
    }
  }

  const moreBlogs = useCallback(node => {
    if (paginatedIsLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [paginatedIsLoading, hasMore])

  const current = Date.parse(new Date())
  const sevenDays = 60 * 60 * 24 * 1000 * 7
  const recentlyUpload = Array.isArray(allBlogs) && allBlogs?.filter(blog => current - Date.parse(blog?.createdAt) < sevenDays)
  const recentlyUploadWithoutUser = Array.isArray(allBlogs) && allBlogs?.filter(blog => current - Date.parse(blog?.createdAt) < sevenDays)

  let content

  if (paginatedIsLoading) {
    content = (
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <LoadingSpinner />
      </Box>
    )
  }


  if (paginatedIsSuccess && allBlogs?.length === 0) {
    content =
      (<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography>
          No Blogs are available at the moment
        </Typography>
      </Box>
      )
  }

  // user not exist and all
  if (paginatedIsSuccess && allBlogs?.length > 0 && !username && isSelected === 'All') {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {allBlogs?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} />
          </Grid>)}
      </Grid>
    )
  }
  // user not exist and recently upload
  if (paginatedIsSuccess && recentlyUpload?.length > 0 && !username && isSelected === 'Recently Upload') {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {recentlyUpload?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} />
          </Grid>)}
      </Grid>
    )
  }


  // if login user exist 
  if (paginatedIsSuccess && allBlogs?.length > 0 && username && isSelected === 'All') {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {allBlogs?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} />
          </Grid>)}
      </Grid>
    )
  }

  // if login user exist 
  if (paginatedIsSuccess && recentlyUploadWithoutUser?.length > 0 && username && isSelected === 'Recently Upload') {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {recentlyUploadWithoutUser?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} />
          </Grid>)}
      </Grid>
    )
  }



  return (

    <Box sx={{ width: '100%' }}>

      <Box sx={{ position: 'sticky', top: '70px', backgroundColor: 'white', zIndex: 10, width: '100%', pb: '10px', pl: 2, pr: 2 }}>
        <Box sx={{ display: 'flex', width: '100%', mb: 1, p: '0px' }}>
          {small ?
            <IconButton style={IconButtonStyle} disableRipple color="primary" sx={{ display: 'flex', justifyContent: 'flex-start', p: '0px', width: '0px' }}
              onClick={toggleDrawer(drawerDirection, true)}
            >
              <DehazeIcon color='primary' />
            </IconButton>
            : ''
          }
          <Box sx={{ width: '100%', pt: '10px' }}>
            <ClientSearchBar setSearchInput={setSearchInput} searchInput={searchInput} handleSearch={handleSearch} />
          </Box>
        </Box>
        <Box  >
          {dataList?.map(category => {
            return (
              <Button style={buttonStyle} key={category.id} size='small' variant={isSelected === category.type ? 'contained' : 'text'} sx={{ minWidth: 0, mr: 2 }} value={category.type} onClick={handleSelect} > {category.type}</Button>
            )
          }
          )}
        </Box>
      </Box>

      <Box sx={{ pl: 2, pr: 2 }}>
        <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 250px)' }}>
          {content}
        </Box>
        {/* <Button onClick={handlePrev} disabled={page === 1 ? true : false}>pre</Button>
          {page}
          <Button onClick={handleNext} disabled={page === paginatedBlogs?.numberOfPages ? true : false}>next</Button> */}
      </Box >
      <Box >
        {
          hasMore &&
          <Box ref={moreBlogs}> </Box>
        }
      </Box>
    </Box >
  )
}



export default MainContent