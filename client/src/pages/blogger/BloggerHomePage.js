import React, { useContext, useEffect, useState } from 'react'

import { Box, Button, Paper, Container, Typography, Toolbar, useScrollTrigger, IconButton, CardMedia, SvgIcon } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import { blue } from '@mui/material/colors'
import ClientSearchBar from '../../components/ClientSearchBar'
import { useDeleteBlogMutation, useGetBloggerHomePageQuery, useGetUserBlogsFromUserIdQuery } from '../blogs/blogsApiSlice'
import { timeDisplayOptions } from '../../config/timeDisplayOptions'
import LoadingSpinner from '../../components/LoadingSpinner'
import ReorderOutlinedIcon from '@mui/icons-material/ReorderOutlined'
import UpgradeOutlinedIcon from '@mui/icons-material/UpgradeOutlined'
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined'
import VerticalAlignTopOutlinedIcon from '@mui/icons-material/VerticalAlignTopOutlined'
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import useMediaQuery from '@mui/material/useMediaQuery'
import DehazeIcon from '@mui/icons-material/Dehaze'
import { useLocation, useOutletContext, useParams } from 'react-router-dom'
import { SideBarContext } from '../../useContext/SideBarContext'
import img from './Dtqnxj1W4AAgFut.jpg'
import BlogForBlogger from './BlogForBlogger'
import useAuth from '../../hooks/useAuth'
import useNumberDisplay from '../../hooks/useNumberDisplay'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { set } from 'lodash'

const Root = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center'
  },
}))

const IconButtonStyle = {
  width: '40px', height: '40px'
}


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


const dataList = [{ id: 1, 'type': 'All' }, { id: 2, 'type': 'Public' }, { id: 3, 'type': 'Private' }]

const BloggerHomePage = () => {

  const small = useMediaQuery('(min-width: 600px) and (max-width: 791px)')
  const smallScreenSize = useMediaQuery('(max-width:599px)')

  const { id } = useParams()
  const { username, userId } = useAuth()
  const { state, setState, drawerDirection, toggleDrawer, selectedDate, path, setPath, setClearSelectedDate } = useContext(SideBarContext)

  const bloggerInfo = {
    id,
    username: username ? username : null
  }

  const [
    deleteBlog,
    {
      data: removeMessage,
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      error: deleteError
    }
  ] = useDeleteBlogMutation()

  const { userBlogs, isLoading, isSuccess, isError } = useGetBloggerHomePageQuery(bloggerInfo, {
    selectFromResult: ({ data, isLoading, isSuccess, isError }) => ({
      userBlogs: data,
      isLoading,
      isSuccess,
      isError
    })
  })


  const [isSelected, setIsSelected] = useState('All')
  const [isDesc, setIsDesc] = useState(true) // high to low
  const [currentUserBlogs, setCurrentUserBlogs] = useState([])
  const [numberOfSubscribers, setNumberOfSubscribers] = useState(0)
  const [numberOfBlogs, setNumberOfBlogs] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isSearch, setIsSearch] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [bloggerUsername, setBloggerUsername] = useState('')
  const [bloggerAvatar, setBloggerAvatar] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)


  const timeConvert = (date) => {
    return new Date(Date.parse(date?.toString())).toLocaleString(undefined, timeDisplayOptions.optionTwo)
  }

  useEffect(() => {
    if (isSuccess || refresh) {
      if (selectedDate.bloggerPage) {
        const selectedDay = Object.values(userBlogs?.blogs).filter(blog => timeConvert(blog.createdAt) === selectedDate.bloggerPage)
        setCurrentUserBlogs(selectedDay)
      } else {
        setCurrentUserBlogs(Object.values(userBlogs?.blogs))
      }

      setBloggerUsername(userBlogs?.blogger_name)
      setNumberOfSubscribers(userBlogs?.number_of_subscribers)
      setNumberOfBlogs(userBlogs?.number_of_blogs)
      setBloggerAvatar(userBlogs?.blogger_avatar)
      setRefresh(false)
      setIsReady(true)
    }
    if (updateLoading) {

      setCurrentUserBlogs(Object.values(userBlogs?.blogs))
      setBloggerUsername(userBlogs?.blogger_name)
      setNumberOfSubscribers(userBlogs?.number_of_subscribers)
      setNumberOfBlogs(userBlogs?.number_of_blogs)
      setBloggerAvatar(userBlogs?.blogger_avatar)
      setTimeout(() => {
        setUpdateLoading(false)
      }, 500)
    }
  }, [isSuccess, refresh, userBlogs, updateLoading, selectedDate.bloggerPage])

  const handleSelect = (e) => {
    setIsSelected(e.target.value)
  }

  const handleAscendent = () => {
    if (isDesc) {
      const ascendingOrder = currentUserBlogs?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      setCurrentUserBlogs(ascendingOrder)
      setIsDesc(false)
    }
  }

  const handleDescendent = () => {
    if (!isDesc) {
      const descendingOrder = currentUserBlogs?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setCurrentUserBlogs(descendingOrder)
      setIsDesc(true)
    }
  }

  const handleAllBlogs = () => {
    setIsSearch(false)
  }

  const handleSearch = () => {
    if (!searchInput.length) return console.log('nothing')
    const inputLowerCase = searchInput.toLowerCase()
    // console.log([...inputLowerCase]) // ['s', 'd', 'f', 'd', 's']
    const result = currentUserBlogs.filter(blog =>
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

  const handleClearFromSearch = () => {
    setIsSearch(false)
    setSearchResult([])
  }


  const handleClearFromSelectedDate = (e) => {
    setClearSelectedDate(true)
  }


  const subscribersDisplay = useNumberDisplay(numberOfSubscribers)
  const blogsDisplay = useNumberDisplay(numberOfBlogs)

  const searchPublicBlogs = Array.isArray(searchResult) && searchResult?.filter(blog => blog.visible_to === 'public')
  const searchPrivateBlogs = Array.isArray(searchResult) && searchResult?.filter(blog => blog.visible_to === 'private')

  const publicBlogs = currentUserBlogs?.filter(blog => blog.visible_to === 'public')
  const privateBlogs = currentUserBlogs?.filter(blog => blog.visible_to === 'private')

  let content

  if (isLoading || updateLoading) {
    content = (
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <LoadingSpinner />
      </Box>
    )
  }


  if ((isSuccess && !currentUserBlogs.length && !updateLoading) || (isSuccess && !publicBlogs.length && !updateLoading) || (isSuccess && !privateBlogs.length && !updateLoading)) {
    content =
      (<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography>
          No Blogs are created
        </Typography>
      </Box>
      )
  }

  if (isSuccess && currentUserBlogs?.length === 0 && selectedDate.bloggerPage !== null) {
    content =
      (<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography >
          No blogs found on the selected date.
        </Typography>
      </Box>
      )
  }

  console.log(isSuccess)
  console.log(selectedDate.bloggerPage)
  console.log(currentUserBlogs?.length)


  if (isSuccess && currentUserBlogs?.length > 0 && !updateLoading) {

    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {
          currentUserBlogs?.map(blog =>
            <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
              <BlogForBlogger blog={blog} bloggerUsername={bloggerUsername} setUpdateLoading={setUpdateLoading} deleteBlog={deleteBlog} setRefresh={setRefresh} isDeleteLoading={isDeleteLoading} removeMessage={removeMessage} />
            </Grid>
          )}
      </Grid>
    )
  }

  if (isSearch) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {
          Array.isArray(searchResult) ?
            (
              searchResult?.map(blog =>
                <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2}  >
                  <BlogForBlogger blog={blog} bloggerUsername={bloggerUsername} setUpdateLoading={setUpdateLoading} deleteBlog={deleteBlog} setRefresh={setRefresh} isDeleteLoading={isDeleteLoading} removeMessage={removeMessage} />
                </Grid>)
            ) :
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              {searchResult}
            </Box>
        }
      </Grid>
    )
  }

  return (
    <Box sx={{ width: '100%', mt: '30px' }} >
      <Box sx={{ height: 120, width: '100%' }}>
        <Box sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'start-left', pl: 2, pr: 2 }}>
          {bloggerAvatar ?
            <CardMedia
              sx={{ height: 116.67, width: 116.67, mr: '23.34px', borderRadius: '50%', objectFit: 'scale-down' }}
              component="img"
              image={bloggerAvatar}
              alt={''}
            />
            :
            <SvgIcon sx={{ fontSize: 140, p: 0, m: 0, color: '#bdbdbd' }} >
              <svg
                viewBox="2 0 24 24"
              >
                <AccountCircleIcon />
              </svg>
            </SvgIcon>

          }

          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
            <Typography variant='h5' sx={{
              width: '100%',
              wordBreak: "break-word", display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
              textOverflow: 'ellipsis',
            }}>{bloggerUsername}</Typography>
            <Typography>{subscribersDisplay} subscribers</Typography>
            <Typography>{blogsDisplay} blogs</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ position: 'sticky', top: '70px', backgroundColor: 'white', zIndex: 10, width: '100%', pt: '10px', pb: '10px', pl: 2, pr: 2 }}>
        <Box sx={{ display: 'flex', width: '100%', pt: '10px', pb: '10px' }}>
          {small || smallScreenSize ?
            <IconButton style={IconButtonStyle} disableRipple color="primary" sx={{ display: 'flex', justifyContent: 'flex-start', p: '0px', width: '0px' }}
              onClick={toggleDrawer(drawerDirection, true)}
            >
              <DehazeIcon color='primary' />
            </IconButton>
            : ''
          }
          <Box sx={{ width: '100%', pt: '10px' }}>
            <ClientSearchBar setSearchInput={setSearchInput} searchInput={searchInput} isSearch={isSearch} isSelectedDate={selectedDate.bloggerPage} handleSearch={handleSearch} handleClearFromSearch={handleClearFromSearch} handleClearFromSelectedDate={handleClearFromSelectedDate} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', mt: 1 }}>
          <Button size='small' sx={{ minWidth: 0, p: '2px' }} variant='contained' onClick={handleAllBlogs}>All</Button>
          {!isDesc ?
            <Button size='small' sx={{ minWidth: 0, p: '2px', }} variant='contained' onClick={handleDescendent}>
              <KeyboardDoubleArrowDownIcon />
            </Button>
            :
            <Button size='small' sx={{ minWidth: 0, p: '2px' }} variant='contained' onClick={handleAscendent}>
              <KeyboardDoubleArrowUpIcon />
            </Button>
          }

        </Box>
      </Box>
      <Box sx={{ pr: small ? '24px' : smallScreenSize ? '16px' : 2, pl: small ? '24px' : smallScreenSize ? '16px' : 2, pb: 2 }}>

        {content}

      </Box>
    </Box >

  )
}


export default BloggerHomePage