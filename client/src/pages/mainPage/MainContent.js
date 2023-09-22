import React, { useEffect, useRef, useState } from 'react'
import ActiveCalender from '../blogs/ActiveCalender'
import { Box, Button, Paper, Container, Typography, IconButton, AppBar, Toolbar, SvgIcon } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import Note from '../../components/Note'
import FrontPageSearchBar from '../../components/FrontPageSearchBar'
import { blue } from '@mui/material/colors'
import FrontPageSideBar from '../../components/FrontPageSideBar'
import { useGetBlogsQuery, useGetPaginatedBlogsQuery } from '../blogs/blogsApiSlice'
import LoadingSpinner from '../../components/LoadingSpinner'
import useAuth from '../../hooks/useAuth'
import DehazeIcon from '@mui/icons-material/Dehaze'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useGetLikedBlogsFromUserQuery } from '../likes/likesApiSlice'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { increment, resetCache } from '../blogs/blogSlice'
import { entries } from 'lodash'
import { apiSlice } from '../../app/api/apiSlice'
import ClientSearchBar from '../../components/ClientSearchBar'
import MainBlog from './MainBlog'



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



const MainContent = ({ state, setState, drawerDirection, toggleDrawer }) => {

  const { username, userId } = useAuth()
  const dispatch = useDispatch()
  const { pageNumber } = useSelector((state) => state?.blog)

  const small = useMediaQuery('(max-width:791px)')
  const smallScreenSize = useMediaQuery('(min-width:600px)')

  const [page, setPage] = useState(1)
  const [isSelected, setIsSelected] = useState('All')
  const [allBlogs, setAllBlogs] = useState([])
  const [blogsWithoutUser, setBlogsWithoutUser] = useState([])
  const [paginatedBlogs, setPaginatedBlogs] = useState(null)
  const [likesFromUser, setLikesFromUser] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isSearch, setIsSearch] = useState(false)
  const [products, setProducts] = useState([])
  const [newBlogData, setNewBlogData] = useState([])

  const [hasMore, setHasMore] = useState(true)
  const elementRef = useRef(null)

  // const {
  //   data: blogs,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error } = useGetBlogsQuery()

  const {
    data: paginatedData,
    isSuccess: paginatedIsSuccess,
    isLoading: paginatedIsLoading,
  } = useGetPaginatedBlogsQuery(Number(pageNumber))

  const {
    data: likes,
    isLoading: isLikesLoading,
    isSuccess: isLikesSuccess,
  } = useGetLikedBlogsFromUserQuery(username)


  // useEffect(() => {
  //   if (isSuccess) {
  //     const { entities } = blogs
  //     const list = Object.values(entities)
  //     const withOutCurrentUser = list?.filter(blog => blog?.user !== username)
  //     setAllBlogs(withOutCurrentUser)
  //   }
  // }, [isSuccess])


  useEffect(() => {
    if (paginatedIsSuccess && !username) {
      // setPaginatedBlogs(paginatedData)
      setAllBlogs(paginatedData.data)
    }
    if (paginatedIsSuccess && username) {
      // setPaginatedBlogs(paginatedData)
      const withoutUser = paginatedData?.data?.filter(blog => blog.username !== username)
      setBlogsWithoutUser(withoutUser)
    }

    if (username && isLikesSuccess) {
      const entities = likes?.entities
      const listOfLikes = Object.values(entities)
      setLikesFromUser(listOfLikes)
    }
  }, [paginatedIsSuccess, paginatedData, isLikesSuccess, username]) // needs paginatedData as dependency for the latest update



  useEffect(() => {

    const observer = new IntersectionObserver(([entry]) => {
      // console.log(entries)
      if (entry.isIntersecting && hasMore) {

        if (Number(pageNumber) >= Number(products?.numberOfPages)) {
          setHasMore(false)
        } else {
          dispatch(increment(pageNumber + 1))
        }
      }
    })
    if (!elementRef.current) return ''
    observer.observe(elementRef.current)

    return () => {
      if (elementRef.current) {

        observer.disconnect()
      }
    }
  }, [allBlogs])

  // IntersectionObserver and use observer.observe(elementRef.current); to tell the observer to start observing the DOM element referenced by elementRef.current.
  // When the DOM element referenced by elementRef (in your case, the empty <Box> element) becomes visible in the viewport (e.g., as the user scrolls down)
  // the IntersectionObserver triggers the callback function you provided 
  // if (entry.isIntersecting && hasMore) {
  //   console.log(entry.isIntersecting)

  //   if (Number(pageNumber) >= Number(products?.numberOfPages)) {
  //     setHasMore(false)
  //   } else {
  //     dispatch(increment(pageNumber + 1))
  //   }
  // }
  // then the [products] to disconnect the observer

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
    const result = products.data.filter(blog =>
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

  const current = Date.parse(new Date())
  const sevenDays = 60 * 60 * 24 * 1000 * 7
  const recentlyUpload = Array.isArray(allBlogs) && allBlogs?.filter(blog => current - Date.parse(blog?.createdAt) < sevenDays)

  let content

  if (paginatedIsLoading || isLikesLoading) {
    content = (
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <LoadingSpinner />
      </Box>
    )
  }


  if ((paginatedIsSuccess && allBlogs?.length === 0) || (paginatedIsSuccess && blogsWithoutUser?.length === 0)) {
    content =
      (<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography>
          No Blogs are available at the moment
        </Typography>
      </Box>
      )
  }

  // user not exist
  if (paginatedIsSuccess && isLikesSuccess && allBlogs?.length > 0 && !username) {
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
  if (paginatedIsSuccess && isLikesSuccess && blogsWithoutUser?.length > 0 && username) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {blogsWithoutUser?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} />
          </Grid>)}
      </Grid>
    )
  }

  // if (paginatedIsSuccess && isLikesSuccess && !username) {
  //   content = (
  //     <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
  //       {/* {
  //         isSelected === 'All' ?
  //           (
  //             allBlogs?.map(blog =>
  //               <Grid key={blog.id} xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} >
  //                 <Note blog={blog} />
  //               </Grid>)
  //           ) :
  //           isSelected === 'Recently Upload' ?
  //             (
  //               recentlyUpload?.map(blog =>
  //                 <Grid key={blog.id} xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} >
  //                   <Note blog={blog} />
  //                 </Grid>)
  //             ) :
  //             ''
  //       } */}
  //       {/* 
  //       {paginatedBlogs?.data?.map(blog =>
  //         <Grid key={blog.id} xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} >
  //           <Note blog={blog} />
  //         </Grid>)} */}

  //       {/* {newData?.map(blog =>
  //         <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
  //           <Note blog={blog} />
  //         </Grid>)} */}
  //       {products.data?.map(blog =>
  //         <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
  //           <Note blog={blog} />
  //         </Grid>)}
  //     </Grid>
  //   )
  // }

  // if (paginatedIsSuccess && isLikesSuccess && username && newBlogData) {

  //   const newData = products?.data?.map((blog) => {
  //     // Find the like that matches the current blog's ID
  //     const matchingLike = likesFromUser?.find((like) => like.blog_id === blog.id)

  //     // If a matching like is found, update the blog with the like information
  //     if (matchingLike) {
  //       return { ...blog, isLike: matchingLike.is_like }
  //     }
  //     // If no matching like is found, keep the original blog object
  //     return { ...blog }
  //   })

  //   content = (
  //     <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>

  //       {newData?.map(blog =>
  //         <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
  //           <Note blog={blog} />
  //         </Grid>)}
  //     </Grid>
  //   )
  // }


  return (

    <Box sx={{ width: '100%' }}>

      <Box sx={{ position: 'sticky', top: '70px', backgroundColor: 'white', zIndex: 10, width: '100%', pb: '10px', pl: 2, pr: 2 }}>
        <Box sx={{ display: 'flex', width: '100%', mb: 1, p: '0px' }}>
          {small ?
            <IconButton style={IconButtonStyle} color="primary" sx={{ display: 'flex', justifyContent: 'flex-start', p: '0px', width: '0px' }}
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
              <Button style={buttonStyle} key={category.id} size='small' variant={isSelected === category.type ? 'contained' : 'text'} sx={{ ['.css-14rqobi-MuiButtonBase-root-MuiButton-root']: { padding: 0 }, minWidth: 0, mr: 2 }} value={category.type} onClick={handleSelect} > {category.type}</Button>
            )
          }
          )}
        </Box>
      </Box>

      <Box sx={{ pl: 2, pr: 2 }}>
        <Box sx={{ minHeight: 'calc(100vh - 250px)' }}>
          {content}
        </Box>
        {/* <Button onClick={handlePrev} disabled={page === 1 ? true : false}>pre</Button>
          {page}
          <Button onClick={handleNext} disabled={page === paginatedBlogs?.numberOfPages ? true : false}>next</Button> */}

        <Box sx={{ height: 20 }}>
          {
            hasMore &&
            <Box ref={elementRef}> </Box>
          }
        </Box>
      </Box >

    </Box >




  )
}



export default MainContent