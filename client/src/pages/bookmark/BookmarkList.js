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
import ReorderOutlinedIcon from '@mui/icons-material/ReorderOutlined'
import UpgradeOutlinedIcon from '@mui/icons-material/UpgradeOutlined'
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined'
import VerticalAlignTopOutlinedIcon from '@mui/icons-material/VerticalAlignTopOutlined'
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import { set } from 'lodash'
import { SideBarContext } from '../../useContext/SideBarContext'
import { useDeleteBookmarkMutation, useGetBookmarksQuery } from './bookmarkApiSlice'
import BookmarkBlog from './BookmarkBlog'
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




const BookmarkList = () => {

  const small = useMediaQuery('(min-width: 600px) and (max-width: 791px)')
  const smallScreenSize = useMediaQuery('(max-width:599px)')
  const { pathname } = useLocation()
  const { username } = useAuth()
  const { state, setState, drawerDirection, toggleDrawer, selectedDate, path, setPath, setClearSelectedDate } = useContext(SideBarContext)


  const { bookmarkBlogs, isSuccess, isLoading } = useGetBookmarksQuery(username, {
    selectFromResult: ({ data, isSuccess, isLoading }) => ({
      bookmarkBlogs: data,
      isSuccess,
      isLoading
    })
  })

  const [
    deleteBookmark, {
      data: removeMessage,
      isLoading: isDeleteBookmarkLoading,
      isSuccess: isDeleteBookmarkSuccess,
      isError: isDeleteBookmarkError,
      error: deleteBookmarkError
    }
  ] = useDeleteBookmarkMutation()





  const [isDesc, setIsDesc] = useState(true) // high to low
  const [currentBookmarks, setCurrentBookmarks] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isSearch, setIsSearch] = useState(false)
  const [refresh, setRefresh] = useState(false)


  useEffect(() => {

    if (isSuccess || refresh) {
      if (selectedDate.bookmarkPage) {
        const selectedDay = bookmarkBlogs.filter(blog => blog?.bookmarkedAt === selectedDate.bookmarkPage)
        setCurrentBookmarks(selectedDay)
        setRefresh(false)
      } else {
        setCurrentBookmarks(bookmarkBlogs)
        setRefresh(false)
      }
    }

  }, [isSuccess, refresh, selectedDate.bookmarkPage])

  useEffect(() => {
    if (pathname === '/blogs/bookmarks') {
      setPath(pathname)
    }
  }, [pathname])



  const handleAscendent = () => {
    if (isDesc) {

      const ascendingOrder = Object.values(currentBookmarks)?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      setCurrentBookmarks(ascendingOrder)
      setIsDesc(false)
    }
  }

  const handleDescendent = () => {
    if (!isDesc) {
      const descendingOrder = Object.values(currentBookmarks)?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setCurrentBookmarks(descendingOrder)
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
    const result = currentBookmarks.filter(blog =>
      [inputLowerCase].some(character => blog.title.toLowerCase().includes(character) || blog.text.toLowerCase().includes(character))
    )
    if (!result.length) {
      setSearchInput('')
      setIsSearch(true)
      return setSearchResult('No matching bookmarks were found for the given input.')
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


  let content

  if (isLoading) {
    content = (
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <LoadingSpinner />
      </Box>
    )
  }


  if (isSuccess && currentBookmarks?.length === 0) {
    content =
      (<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography >
          No bookmarks yet! Start saving your favorites.
        </Typography>
      </Box>
      )
  }

  if (isSuccess && currentBookmarks?.length >= 1) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {currentBookmarks?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <BookmarkBlog blog={blog} deleteBookmark={deleteBookmark} setRefresh={setRefresh} isDeleteBookmarkLoading={isDeleteBookmarkLoading} removeMessage={removeMessage} />
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
                  <BookmarkBlog blog={blog} deleteBookmark={deleteBookmark} setRefresh={setRefresh} isDeleteBookmarkLoading={isDeleteBookmarkLoading} removeMessage={removeMessage} />
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
    <Box  >
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
            <ClientSearchBar setSearchInput={setSearchInput} searchInput={searchInput} isSearch={isSearch} isSelectedDate={selectedDate.bookmarkPage} handleSearch={handleSearch} handleClearFromSearch={handleClearFromSearch} handleClearFromSelectedDate={handleClearFromSelectedDate} />
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

export default BookmarkList