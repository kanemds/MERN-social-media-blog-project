import React, { useEffect, useState } from 'react'

import { Box, Button, Paper, Container, Typography, AppBar, Toolbar, useScrollTrigger, IconButton } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import Note from '../../components/Note'
import FrontPageSearchBar from '../../components/FrontPageSearchBar'

import { blue } from '@mui/material/colors'
import ClientSearchBar from '../../components/ClientSearchBar'
import { useGetBlogsQuery, useGetUserBlogsQuery } from './blogsApiSlice'
import useAuth from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner'
import ReorderOutlinedIcon from '@mui/icons-material/ReorderOutlined'
import UpgradeOutlinedIcon from '@mui/icons-material/UpgradeOutlined'
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined'
import VerticalAlignTopOutlinedIcon from '@mui/icons-material/VerticalAlignTopOutlined'
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      ll: 1460,
      xl: 1670,
      xxl: 1950
    },
  },
})



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


const dataList = [{ id: 1, 'type': 'All' }, { id: 2, 'type': 'Public' }, { id: 3, 'type': 'Private' }]

const BlogsList = () => {


  const { username } = useAuth()

  const [isSelected, setIsSelected] = useState('All')
  const [isDesc, setIsDesc] = useState(true) // high to low
  const [currentUserBlogs, setCurrentUserBlogs] = useState(null)

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetBlogsQuery()


  useEffect(() => {
    if (isSuccess) {
      const findUserBlogs = Object.values(data?.entities)?.filter(blog => blog.user === username)
      const descendingOrder = findUserBlogs?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setCurrentUserBlogs(descendingOrder)
    }
  }, [isSuccess])


  const handleSelect = (e) => {
    setIsSelected(e.target.value)
  }
  console.log('currentUserBlogs', currentUserBlogs)

  let content

  if (isLoading) {
    content = (
      <Box sx={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
        <LoadingSpinner />
      </Box>
    )
  }


  const handleAscendent = () => {
    if (isDesc) {
      const ascendingOrder = currentUserBlogs?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      setCurrentUserBlogs(ascendingOrder)
      console.log(currentUserBlogs)
      setIsDesc(false)
    }
  }

  const handleDescendent = () => {
    if (!isDesc) {
      const descendingOrder = currentUserBlogs?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setCurrentUserBlogs(descendingOrder)
      console.log(currentUserBlogs)
      setIsDesc(true)
    }
  }

  if (isSuccess) {

    const publicBlogs = currentUserBlogs?.filter(blog => blog.visible_to === 'public')
    const privateBlogs = currentUserBlogs?.filter(blog => blog.visible_to === 'private')


    content = (
      <ThemeProvider theme={theme}  >
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            {dataList?.map(category => {
              return (
                <Button key={category.id} size='small' variant={isSelected === category.type ? 'contained' : 'text'} value={category.type} onClick={handleSelect} sx={{ minWidth: 0, mr: 1 }}>{category.type}</Button>
              )
            }
            )}
          </Box>
          <Box>
            {isDesc ?
              <Button size='small' sx={{ minWidth: 0, p: 0 }} onClick={handleAscendent}>
                <ReorderOutlinedIcon />
                <ExpandLessOutlinedIcon />
                DESC
              </Button>
              :
              <Button size='small' sx={{ minWidth: 0, p: 0 }} onClick={handleDescendent}>
                <ReorderOutlinedIcon />
                <ExpandMoreOutlinedIcon />
                ACES
              </Button>
            }

          </Box>
        </Box>

        <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 12, xl: 15, xxl: 12 }}>

          {
            isSelected === 'All' ?
              (
                currentUserBlogs?.map(blog =>
                  <Grid key={blog.id} xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Note blog={blog} />
                  </Grid>)
              ) :
              isSelected === 'Public' ?
                (
                  publicBlogs?.map(blog =>

                    <Grid key={blog.id} xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Note blog={blog} />
                    </Grid>)
                ) :
                (
                  privateBlogs?.map(blog =>
                    <Grid key={blog.id} xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Note blog={blog} />
                    </Grid>)
                )
          }
        </Grid>
      </ThemeProvider >
    )


  }
  return content
}

export default BlogsList