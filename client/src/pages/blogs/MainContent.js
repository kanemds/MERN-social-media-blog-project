import React, { useEffect, useState } from 'react'
import ActiveCalender from './ActiveCalender'
import { Box, Button, Paper, Container, Typography, AppBar, Toolbar } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import Note from '../../components/Note'
import FrontPageSearchBar from '../../components/FrontPageSearchBar'
import { blue } from '@mui/material/colors'
import FrontPageSideBar from '../../components/FrontPageSideBar'
import { useGetBlogsQuery, useGetLimitedBlogsQuery } from './blogsApiSlice'
import LoadingSpinner from '../../components/LoadingSpinner'
import useAuth from '../../hooks/useAuth'


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

  const { username } = useAuth()

  const [page, setPage] = useState(0)
  const [isSelected, setIsSelected] = useState('All')
  const [allBlogs, setAllBlogs] = useState(null)

  console.log(page)

  const {
    data: blogs,
    isLoading,
    isSuccess,
    isFetching,
    isError,
    error
  } = useGetBlogsQuery()




  useEffect(() => {
    if (isSuccess) {
      const { entities } = blogs
      const list = Object.values(entities)
      const withOutCurrentUser = list?.filter(blog => blog?.user !== username)
      setAllBlogs(withOutCurrentUser)
    }

  }, [isSuccess])

  const handleSelect = (e) => {
    setIsSelected(e.target.value)
  }

  const current = Date.parse(new Date())
  const sevenDays = 60 * 60 * 24 * 1000 * 7
  const recentlyUpload = Array.isArray(allBlogs) && allBlogs?.filter(blog => current - Date.parse(blog?.createdAt) < sevenDays)

  let content

  if (isLoading) {
    content = (<LoadingSpinner />)
  }

  if (isSuccess) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 12, xl: 15, xxl: 12 }}>
        {
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
        }
      </Grid>
    )
  }


  return (
    <Box sx={{ display: 'flex', mt: '50px', mb: '50px', height: '100%' }}>

      <FrontPageSideBar blogs={blogs} />

      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} maxWidth='xxxl'>

        <Box sx={{ position: 'sticky', top: '70px', backgroundColor: 'white', zIndex: 10, width: '100%', pt: '10px', pb: '10px', pl: 1, pr: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
          <Box sx={{ width: '100%' }}>
            <FrontPageSearchBar />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', mt: 1 }}>
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
        <Box sx={{ p: 1 }}>
          {/* {content} */}

        </Box >
      </Box >

    </Box >
  )
}

export default MainContent