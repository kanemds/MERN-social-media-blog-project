import React, { useEffect, useRef, useState } from 'react'
import ActiveCalender from '../blogs/ActiveCalender'
import { Box, Button, Paper, Container, Typography, AppBar, Toolbar } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import Note from '../../components/Note'
import FrontPageSearchBar from '../../components/FrontPageSearchBar'
import { blue } from '@mui/material/colors'
import FrontPageSideBar from '../../components/FrontPageSideBar'
import { useGetBlogsQuery, useGetPaginatedBlogsQuery } from '../blogs/blogsApiSlice'
import LoadingSpinner from '../../components/LoadingSpinner'
import useAuth from '../../hooks/useAuth'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useGetLikedBlogsFromUserQuery } from '../likes/likesApiSlice'
import { useLocation } from 'react-router-dom'




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



const buttonStyle = {
  padding: '4px',
}


const dataList = [{ id: 1, 'type': 'All' }, { id: 2, 'type': 'Recently Upload' }]



const MainContent = () => {

  const { username, userId } = useAuth()


  const smallScreenSize = useMediaQuery('(min-width:600px)')

  const [page, setPage] = useState(1)
  const [isSelected, setIsSelected] = useState('All')
  const [allBlogs, setAllBlogs] = useState(null)
  const [paginatedBlogs, setPaginatedBlogs] = useState(null)

  const [products, setProducts] = useState([])


  const [hasMore, setHasMore] = useState(true)
  const elementRef = useRef(null)


  const {
    data: blogs,
    isLoading,
    isSuccess,
    isError,
    error } = useGetBlogsQuery()



  const {
    data: paginatedData,
    isSuccess: paginatedIsSuccess,
    isLoading: paginatedIsLoading,
  } = useGetPaginatedBlogsQuery(page)



  // useEffect(() => {
  //   if (isSuccess) {
  //     const { entities } = blogs
  //     const list = Object.values(entities)
  //     const withOutCurrentUser = list?.filter(blog => blog?.user !== username)
  //     setAllBlogs(withOutCurrentUser)
  //   }
  // }, [isSuccess])

  useEffect(() => {
    if (paginatedIsSuccess) {
      // setPaginatedBlogs(paginatedData)
      setProducts(paginatedData)
    }
  }, [paginatedIsSuccess, paginatedData]) // needs paginatedData as dependency for the latest update

  useEffect(() => {

    const observer = new IntersectionObserver(onIntersection)

    if (observer && elementRef.current) {
      console.log(observer)
      console.log(elementRef.current)
      observer.observe(elementRef.current)
    }

    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [])





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

  const onIntersection = (entries) => {
    const firstEntry = entries[0]

    if (firstEntry.isIntersecting && hasMore) {
      fetchMoreBlogs()
    }
  }

  const fetchMoreBlogs = () => {
    if (Number(page) >= Number(products?.numberOfPages)) {
      setHasMore(false)
    } else {
      setPage(prev => prev + 1)
    }
  }


  const current = Date.parse(new Date())
  const sevenDays = 60 * 60 * 24 * 1000 * 7
  const recentlyUpload = Array.isArray(allBlogs) && allBlogs?.filter(blog => current - Date.parse(blog?.createdAt) < sevenDays)

  let content

  if (isLoading || paginatedIsLoading) {
    content = (<LoadingSpinner />)
  }

  if (isSuccess || paginatedIsSuccess) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {/* {
          isSelected === 'All' ?
            (
              allBlogs?.map(blog =>
                <Grid key={blog.id} xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} >
                  <Note blog={blog} />
                </Grid>)
            ) :
            isSelected === 'Recently Upload' ?
              (
                recentlyUpload?.map(blog =>
                  <Grid key={blog.id} xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} >
                    <Note blog={blog} />
                  </Grid>)
              ) :
              ''
        } */}
        {/* 
        {paginatedBlogs?.data?.map(blog =>
          <Grid key={blog.id} xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} >
            <Note blog={blog} />
          </Grid>)} */}

        {products?.data?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <Note blog={blog} />
          </Grid>)}
      </Grid>
    )
  }


  return (

    <Box sx={{ display: 'flex', height: '100%' }}>

      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 20 }} maxWidth='xxl'>

        <Box sx={{ position: 'sticky', top: '150px', backgroundColor: 'white', zIndex: 10, width: '100%', pt: '10px', pb: '10px', pl: 2, pr: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
          {/* <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <FrontPageSearchBar />
          </Box> */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', p: smallScreenSize ? '' : '0 8px' }}>
            <Box >
              {dataList?.map(category => {
                return (
                  <Button style={buttonStyle} key={category.id} size='small' variant={isSelected === category.type ? 'contained' : 'text'} sx={{ ['.css-14rqobi-MuiButtonBase-root-MuiButton-root']: { padding: 0 }, minWidth: 0, mr: 2 }} value={category.type} onClick={handleSelect} > {category.type}</Button>
                )
              }
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: smallScreenSize ? 2 : '0 24px' }}>
          {content}
          {/* <Button onClick={handlePrev} disabled={page === 1 ? true : false}>pre</Button>
          {page}
          <Button onClick={handleNext} disabled={page === paginatedBlogs?.numberOfPages ? true : false}>next</Button> */}

          {
            hasMore &&
            <Box ref={elementRef}> </Box>
          }
        </Box >

      </Box >

    </Box >


  )
}


const MemoizedMainContent = React.memo(MainContent)
export default MemoizedMainContent