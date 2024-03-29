import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Paper, Container, Typography, AppBar, Toolbar, useScrollTrigger, IconButton } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import FrontPageSearchBar from '../../components/FrontPageSearchBar'
import { blue } from '@mui/material/colors'
import ClientSearchBar from '../../components/ClientSearchBar'
import DehazeIcon from '@mui/icons-material/Dehaze'
import useMediaQuery from '@mui/material/useMediaQuery'
import useAuth from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import { set } from 'lodash'
import { SideBarContext } from '../../useContext/SideBarContext'
import { useDeleteSubscribedFromBlogMutation, useGetUserSubscribedBlogsQuery } from './subscribeApiSlice'
import SubscribedBlog from './SubscribedBlog'
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


const SubscribedList = () => {

  const small = useMediaQuery('(min-width: 600px) and (max-width: 791px)')
  const smallScreenSize = useMediaQuery('(max-width:599px)')

  const { username } = useAuth()
  const { pathname } = useLocation()
  const { state, setState, drawerDirection, toggleDrawer, selectedDate, setPath, setClearSelectedDate } = useContext(SideBarContext)

  const [
    deleteSubscribed,
    {
      data: removeMessage,
      isLoading: isDeleteSubscribedLoading,
      isSuccess: isDeleteSubscribedSuccess,
      isError: isDeleteSubscribedError,
      error: deleteSubscribedError
    }] = useDeleteSubscribedFromBlogMutation()

  const { subscribedBlogs, isSuccess, isLoading } = useGetUserSubscribedBlogsQuery(username, {
    selectFromResult: ({ data, isSuccess, isLoading }) => ({
      subscribedBlogs: data,
      isSuccess,
      isLoading
    })
  })




  const [isDesc, setIsDesc] = useState(true) // high to low
  const [currentSubscribed, setCurrentSubscribed] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isSearch, setIsSearch] = useState(false)
  const [refresh, setRefresh] = useState(false)


  useEffect(() => {

    if (isSuccess || refresh) {
      if (selectedDate.subscribePage) {
        const selectedDay = Object.values(subscribedBlogs).filter(blog => blog.subscribedAt === selectedDate.subscribePage)
        setCurrentSubscribed(selectedDay)
        setRefresh(false)
      } else {
        setCurrentSubscribed(Object.values(subscribedBlogs))
        setRefresh(false)
      }
    }
  }, [isSuccess, refresh, selectedDate.subscribePage])


  useEffect(() => {
    if (pathname === '/blogs/subscribed') {
      setPath(pathname)
    }
  }, [pathname])

  const handleAscendent = () => {
    if (isDesc) {

      const ascendingOrder = currentSubscribed?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      setCurrentSubscribed(ascendingOrder)
      setIsDesc(false)
    }
  }

  const handleDescendent = () => {
    if (!isDesc) {
      const descendingOrder = currentSubscribed?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setCurrentSubscribed(descendingOrder)
      setIsDesc(true)
    }
  }

  const handleAllBlogs = () => {
    setSearchInput('')
    setIsSearch(false)
  }

  const handleSearch = () => {
    if (!searchInput.length) return console.log('nothing')
    const inputLowerCase = searchInput.toLowerCase()
    // console.log([...inputLowerCase]) // ['s', 'd', 'f', 'd', 's']
    const result = currentSubscribed.filter(blog =>
      [inputLowerCase].some(character => blog.username.toLowerCase().includes(character))
    )
    if (!result.length) {
      setIsSearch(true)
      return setSearchResult('No subscriber was found to match the input')
    } else {
      setIsSearch(true)
      return setSearchResult(result)
    }
  }

  const handleClearFromSearch = () => {
    setSearchInput('')
    setIsSearch(false)
    setSearchResult([])
  }


  const handleClearFromSelectedDate = (e) => {
    setClearSelectedDate(true)
  }


  let content

  if (isLoading) {
    content = (
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <LoadingSpinner />
      </Box>
    )
  }


  if (isSuccess && currentSubscribed?.length === 0 && selectedDate.subscribePage === null) {
    content =
      (<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography >
          No subscribed bloggers yet! Start saving your favorites.
        </Typography>
      </Box>
      )
  }

  if (isSuccess && currentSubscribed?.length === 0 && selectedDate.subscribePage !== null) {
    content =
      (<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography >
          No subscribed bloggers found on the selected date.
        </Typography>
      </Box>
      )
  }

  if (isSuccess && currentSubscribed?.length >= 1) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {currentSubscribed?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <SubscribedBlog blog={blog} deleteSubscribed={deleteSubscribed} setRefresh={setRefresh} isDeleteSubscribedLoading={isDeleteSubscribedLoading} removeMessage={removeMessage} />
          </Grid>
        )
        }
      </Grid >
    )
  }

  if (isSearch) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {
          Array.isArray(searchResult) ?
            (
              searchResult?.map(blog =>
                <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
                  <SubscribedBlog blog={blog} deleteSubscribed={deleteSubscribed} setRefresh={setRefresh} isDeleteSubscribedLoading={isDeleteSubscribedLoading} removeMessage={removeMessage} />
                </Grid>)
            ) :
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              {searchResult}
            </Box>
        }
      </Grid >
    )
  }


  return (
    <Box >
      <Box sx={{ position: 'sticky', top: '70px', backgroundColor: 'white', zIndex: 10, pr: small ? '24px' : smallScreenSize ? '16px' : 2, pl: small ? '24px' : smallScreenSize ? '16px' : 2, pb: 2 }}>
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
            <ClientSearchBar setSearchInput={setSearchInput} searchInput={searchInput} isSearch={isSearch} isSelectedDate={selectedDate.subscribePage} handleSearch={handleSearch} handleClearFromSearch={handleClearFromSearch} handleClearFromSelectedDate={handleClearFromSelectedDate} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', mt: 1 }}>

          <Button size='small' sx={{ minWidth: 0, p: '2px' }} variant='contained' onClick={handleAllBlogs}>All</Button>
          {!isDesc ?
            <Button size='small' sx={{ minWidth: 0, p: '2px' }} variant='contained' onClick={handleDescendent}>
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

export default SubscribedList