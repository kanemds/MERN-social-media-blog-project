import React, { useEffect, useState } from 'react'

import { Box, Button, Paper, Container, Typography, AppBar, Toolbar, useScrollTrigger, IconButton } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import Note from '../../components/Note'
import FrontPageSearchBar from '../../components/FrontPageSearchBar'

import { blue } from '@mui/material/colors'
import ClientSearchBar from '../../components/ClientSearchBar'
import { useGetBlogsQuery, useGetUserBlogsQuery } from '../blogs/blogsApiSlice'
import useAuth from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner'
import ReorderOutlinedIcon from '@mui/icons-material/ReorderOutlined'
import UpgradeOutlinedIcon from '@mui/icons-material/UpgradeOutlined'
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined'
import VerticalAlignTopOutlinedIcon from '@mui/icons-material/VerticalAlignTopOutlined'
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import { useGetLikedBlogsFromUserQuery, useGetUserLikedBlogsQuery } from './likesApiSlice'


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


const LikeList = () => {


  const { username } = useAuth()

  const [isDesc, setIsDesc] = useState(true) // high to low
  const [currentLikes, setCurrentLikes] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isSearch, setIsSearch] = useState(false)

  const { likedBlogs } = useGetUserLikedBlogsQuery(username, {
    selectFromResult: ({ data }) => ({
      likedBlogs: data
    })
  })

  useEffect(() => {

    if (likedBlogs) {
      setCurrentLikes(Object.values(likedBlogs))
      setIsReady(true)
    }
  }, [likedBlogs])


  let content

  if (isReady === false) {
    content = (
      <Box sx={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
        <LoadingSpinner />
      </Box>
    )
  }


  const handleAscendent = () => {
    if (isDesc) {

      const ascendingOrder = currentLikes?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      setCurrentLikes(ascendingOrder)
      setIsDesc(false)
    }
  }

  const handleDescendent = () => {
    if (!isDesc) {
      const descendingOrder = currentLikes?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setCurrentLikes(descendingOrder)
      setIsDesc(true)
    }
  }

  const handleSearch = () => {
    if (!searchInput.length) return console.log('nothing')
    const inputLowerCase = searchInput.toLowerCase()
    // console.log([...inputLowerCase]) // ['s', 'd', 'f', 'd', 's']
    const result = setCurrentLikes.filter(blog =>
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

  if (isReady === true) {

    content = (

      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 12, xl: 15, xxl: 12 }}>

        {currentLikes?.map(blog =>
          <Grid key={blog.id} xs={12} sm={12} md={6} lg={4} ll={3} xl={3} xxl={2} >
            <Note blog={blog} />
          </Grid>)}

      </Grid>
    )
  }

  return (

    <Box sx={{ width: '100%' }} >
      <Box sx={{ position: 'sticky', top: '150px', backgroundColor: 'white', zIndex: 10, width: '100%', pt: '10px', pb: '10px', pl: 2, pr: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
        {/* <Box sx={{ width: '100%' }}>
          <ClientSearchBar setSearchInput={setSearchInput} searchInput={searchInput} handleSearch={handleSearch} />
        </Box> */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', mt: 1 }}>

          <Box>
            {!isDesc ?
              <Button size='small' sx={{ minWidth: 0, p: 0 }} onClick={handleDescendent}>
                <ReorderOutlinedIcon />
                <ExpandMoreOutlinedIcon />
                DESC
              </Button>
              :
              <Button size='small' sx={{ minWidth: 0, p: 0 }} onClick={handleAscendent}>
                <ReorderOutlinedIcon />
                <ExpandLessOutlinedIcon />
                ACES
              </Button>
            }
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 2, mt: '60px' }}>
        {content}
      </Box>
    </Box >

  )
}

export default LikeList