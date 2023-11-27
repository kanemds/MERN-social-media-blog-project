import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import ActiveCalender from '../blogs/ActiveCalender'
import { Box, Button, Paper, Container, Typography, IconButton, AppBar, Toolbar, SvgIcon, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import Note from '../../components/Note'
import FrontPageSearchBar from '../../components/FrontPageSearchBar'
import { blue } from '@mui/material/colors'
import FrontPageSideBar from '../../components/FrontPageSideBar'
import { useGetPaginatedBlogsQuery, useGetSelectedDateBlogsFromHomePageQuery } from '../blogs/blogsApiSlice'
import LoadingSpinner from '../../components/LoadingSpinner'
import useAuth from '../../hooks/useAuth'
import DehazeIcon from '@mui/icons-material/Dehaze'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useGetLikedBlogsFromUserQuery, useGetSelectedDateLikesQuery } from '../likes/likesApiSlice'
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
  padding: '2px',
}


const dataList = [{ id: 1, 'type': 'All' }, { id: 2, 'type': 'Recently Upload' }]



const MainContent = (props) => {


  const { username, userId } = useAuth()
  const dispatch = useDispatch()
  const { pageNumber } = useSelector((state) => state?.blog)

  const small = useMediaQuery('(max-width:791px)')
  const smallScreenSize = useMediaQuery('(min-width:600px)')
  const smallerThan425 = useMediaQuery('(max-width:425px)')
  const current = Date.parse(new Date())
  const sevenDays = 60 * 60 * 24 * 1000 * 7

  const { state, setState, drawerDirection, toggleDrawer, selectedDate, calendarDate, clearSelectedDate, setClearSelectedDate } = useContext(SideBarContext)
  const [page, setPage] = useState(1)
  const [isSelected, setIsSelected] = useState('All')
  const [allBlogs, setAllBlogs] = useState([])
  const [blogsWithoutCurrentUser, setBlogsWithoutCurrentUser] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [searchResultForRecently, setSearchResultForRecently] = useState(null)
  const [isSearch, setIsSearch] = useState(false)
  const [maxPage, setMaxPage] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [isReFetch, setIsReFetch] = useState(false)
  const [paginationQueryInfo, setPaginationQueryInfo] = useState({ page: 1, username: null })
  const [updateLoading, setUpdateLoading] = useState(false)




  // --------------------------- selected date ---------------------------


  const [getSelectedDateBlogsInfo, setGetSelectedDateBlogsInfo] = useState({
    id: userId ? userId : null,
    date: selectedDate.frontPage ? selectedDate.frontPage : null
  })

  // stored blogs from  selected date
  const [selectedDateBlogs, setSelectedDateBlogs] = useState({ userExist: [], userNotExist: [] })


  // const {
  //   data: selectedDateBlogsData,
  //   isSuccess: isSuccessSelectedDateBlogs,
  //   isLoading: isLoadingSelectedDateBlogs,
  // } = useGetSelectedDateBlogsFromHomePageQuery(getSelectedDateBlogsInfo)

  // some how this one works better with invalidatesTags
  const { selectedDateBlogsData, isLoadingSelectedDateBlogs, isSuccessSelectedDateBlogs } = useGetSelectedDateBlogsFromHomePageQuery(getSelectedDateBlogsInfo, {
    selectFromResult: ({ data: selectedDateBlogsData, isLoading: isLoadingSelectedDateBlogs, isSuccess: isSuccessSelectedDateBlogs }) => ({
      selectedDateBlogsData,
      isLoadingSelectedDateBlogs,
      isSuccessSelectedDateBlogs,
    })
  })

  // const {
  //   data: selectedDateLikesData,
  //   isSuccess: isSuccessSelectedDateLikes,
  //   isLoading: isLoadingSelectedDateLikes,
  // } = useGetSelectedDateLikesQuery(getSelectedDateBlogsInfo)

  // console.log(getSelectedDateBlogsInfo)
  // console.log(isSuccessSelectedDateBlogs)
  // console.log(selectedDateBlogsData)

  // --------------------------- selected date ---------------------------


  const observer = useRef(null)

  // const {
  //   data: paginatedData,
  //   isSuccess: paginatedIsSuccess,
  //   isLoading: paginatedIsLoading,
  // } = useGetPaginatedBlogsQuery(paginationQueryInfo)

  const { paginatedData, paginatedIsLoading, paginatedIsSuccess } = useGetPaginatedBlogsQuery(paginationQueryInfo, {
    selectFromResult: ({ data: paginatedData, isLoading: paginatedIsLoading, isSuccess: paginatedIsSuccess }) => ({
      paginatedData,
      paginatedIsLoading,
      paginatedIsSuccess,
    })
  })

  useEffect(() => {
    if (username) {
      setPaginationQueryInfo({ ...paginationQueryInfo, username: username })
    }
  }, [username])

  // --------------------------- selected date ---------------------------
  useEffect(() => {
    if (selectedDate.frontPage !== null) {
      if (userId) {
        setGetSelectedDateBlogsInfo({
          id: userId,
          date: selectedDate.frontPage
        })
      } else {
        setGetSelectedDateBlogsInfo({
          ...getSelectedDateBlogsInfo,
          date: selectedDate.frontPage
        })
      }
    }
  }, [selectedDate.frontPage])


  // get pre selected date blogs into one object
  useEffect(() => {
    if (selectedDate.frontPage !== null) {
      if (selectedDateBlogsData && userId) {
        const withOutUserBlogs = selectedDateBlogsData.filter(blog => blog.user !== userId)
        const newBlogsEntry = { date: getSelectedDateBlogsInfo.date, blogs: withOutUserBlogs }
        const updatedUserExist = [...selectedDateBlogs.userExist]

        // Check if the date already exists in userExist and update it
        const existingIndex = updatedUserExist.findIndex(entry => entry.date === newBlogsEntry.date)
        if (existingIndex !== -1) {
          updatedUserExist[existingIndex] = newBlogsEntry
        } else {
          updatedUserExist.push(newBlogsEntry)
        }

        setSelectedDateBlogs(prevSelectedDateBlogs => ({
          ...prevSelectedDateBlogs,
          userExist: updatedUserExist,
        }))
      }
      if (selectedDateBlogsData && !userId) {
        const newBlogsEntry = { date: getSelectedDateBlogsInfo.date, blogs: selectedDateBlogsData }
        const updatedUserNotExist = [...selectedDateBlogs.userNotExist]

        // Check if the date already exists in userNotExist and update it
        const existingIndex = updatedUserNotExist.findIndex(entry => entry.date === newBlogsEntry.date)
        if (existingIndex !== -1) {
          updatedUserNotExist[existingIndex] = newBlogsEntry
        } else {
          updatedUserNotExist.push(newBlogsEntry)
        }

        setSelectedDateBlogs(prevSelectedDateBlogs => ({
          ...prevSelectedDateBlogs,
          userNotExist: updatedUserNotExist,
        }))
      }
      if (updateLoading) {
        setTimeout(() => {
          setUpdateLoading(false)
        }, 600)

      }
    }
  }, [isSuccessSelectedDateBlogs, selectedDateBlogsData, updateLoading])



  // --------------------------- selected date ---------------------------
  useEffect(() => {
    // if (page === paginatedData?.numberOfPages) {
    //   setHasMore(false)
    // }
    if (paginationQueryInfo.page === paginatedData?.numberOfPages) {
      setHasMore(false)
    }
    // if (paginatedIsSuccess) {
    //   if (username) {
    //     setAllBlogs([...new Set([...allBlogs, ...paginatedData.data])])
    //   } else {
    //     // const withoutUser = paginatedData?.data?.filter(blog => blog.username !== username)
    //     setAllBlogs([...new Set([...allBlogs, ...paginatedData.data])])
    //   }
    // }
    if (paginatedIsSuccess) {
      if (username) {
        setBlogsWithoutCurrentUser(paginatedData?.data)
      } else {
        // const withoutUser = paginatedData?.data?.filter(blog => blog.username !== username)
        setAllBlogs(paginatedData?.data)
      }
    }
    if (updateLoading) {
      setTimeout(() => {
        setUpdateLoading(false)
      }, 1000)
    }

  }, [paginatedData, updateLoading, page]) // needs paginatedData as dependency for the latest update



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

  const handleClearFromSelectedDate = (e) => {
    setClearSelectedDate(true)
  }


  const handleSearch = () => {
    let result
    if (!searchInput.length) return console.log('nothing')
    const inputLowerCase = searchInput.toLowerCase()
    // console.log([...inputLowerCase]) // ['s', 'd', 'f', 'd', 's']

    if (selectedDateBlogsData && selectedDate.frontPage !== null) {
      result = selectedDateBlogsData.filter(blog =>
        [inputLowerCase].some(character => blog.title.toLowerCase().includes(character) || blog.text.toLowerCase().includes(character))
      )
    }

    if (allBlogs && selectedDate.frontPage === null && !username) {
      result = allBlogs.filter(blog =>
        [inputLowerCase].some(character => blog.title.toLowerCase().includes(character) || blog.text.toLowerCase().includes(character))
      )
    }

    if (allBlogs && selectedDate.frontPage === null && username) {
      result = blogsWithoutCurrentUser.filter(blog =>
        [inputLowerCase].some(character => blog.title.toLowerCase().includes(character) || blog.text.toLowerCase().includes(character))
      )
    }


    if (!result.length) {

      setIsSearch(true)
      setSearchResult([])
    } else {

      setIsSearch(true)
      setSearchResult(result)
    }
  }


  const handleClearFromSearch = () => {
    setSearchInput('')
    setIsSearch(false)
    setSearchResult([])
  }
  console.log(isSearch)

  const moreBlogs = useCallback(node => {
    if (paginatedIsLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // setPage(prevPage => prevPage + 1)
        setPaginationQueryInfo(prev => ({ ...prev, page: prev.page + 1 }))
      }
    })
    if (node) observer.current.observe(node)
  }, [paginatedIsLoading, hasMore])




  const recentlyUploadWithAllUsers = Array.isArray(allBlogs) && allBlogs?.filter(blog => current - Date.parse(blog?.createdAt) < sevenDays)
  const recentlyUploadWithoutUser = Array.isArray(blogsWithoutCurrentUser) && blogsWithoutCurrentUser?.filter(blog => current - Date.parse(blog?.createdAt) < sevenDays)

  const searchResultFromRecentlyUpload = Array.isArray(searchResult) && searchResult?.filter(blog => current - Date.parse(blog?.createdAt) < sevenDays)

  let content


  // // ---------------------- date select --------------------------------

  if ((paginatedIsLoading && selectedDate.frontPage === null) || (updateLoading)) {
    content = (
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <LoadingSpinner />
      </Box>
    )
  }

  if (selectedDate.frontPage !== null && isSuccessSelectedDateBlogs && !updateLoading) {
    const findSelectedDateWithOutUser = selectedDateBlogs?.userExist.filter(blog => blog.date === getSelectedDateBlogsInfo.date)
    const findSelectedDate = selectedDateBlogs?.userNotExist.filter(blog => blog.date === getSelectedDateBlogsInfo.date)
    const currentDate = findSelectedDate[0]?.blogs
    const currentDateWithoutUser = findSelectedDateWithOutUser[0]?.blogs

    if (userId && currentDateWithoutUser?.length > 0) {
      content = (
        <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
          {
            currentDateWithoutUser?.map(blog =>
              <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
                <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
              </Grid>)}
        </Grid>
      )
    } else if (!userId && currentDate?.length > 0) {
      content = (
        <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
          {
            currentDate?.map(blog =>
              <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
                <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
              </Grid>)}
        </Grid>
      )
    } else {
      content = (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Typography>
            The selected date has no blog(s).
          </Typography>
        </Box>
      )
    }

    // userId && currentDateWithoutUser?.length > 0 ?
    //   content = (
    //     <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
    //       {
    //         currentDateWithoutUser?.map(blog =>
    //           <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
    //             <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
    //           </Grid>)}
    //     </Grid>
    //   )
    //   :
    //   !userId && currentDate?.length > 0 ?
    //     content = (
    //       <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
    //         {
    //           currentDate?.map(blog =>
    //             <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
    //               <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
    //             </Grid>)}
    //       </Grid>
    //     )
    //     :
    //     content = (
    //       <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    //         <Typography>
    //           No Blogs for the selected date are available at the moment
    //         </Typography>
    //       </Box>
    //     )
  }


  // user not exist and all
  if (paginatedIsSuccess && allBlogs?.length > 0 && !username && isSelected === 'All' && selectedDate.frontPage === null && !updateLoading) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {allBlogs?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
          </Grid>)}
      </Grid>
    )
  }

  // user not exist and recently upload
  if (paginatedIsSuccess && recentlyUploadWithAllUsers?.length > 0 && !username && isSelected === 'Recently Upload' && selectedDate.frontPage === null && !updateLoading) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {recentlyUploadWithAllUsers?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
          </Grid>)}
      </Grid>
    )
  }



  // user exist and recently upload
  if (paginatedIsSuccess && recentlyUploadWithoutUser?.length > 0 && !username && isSelected === 'Recently Upload' && selectedDate.frontPage === null && !updateLoading) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {recentlyUploadWithoutUser?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
          </Grid>)}
      </Grid>
    )
  }

  // // ---------------------- date select --------------------------------

  // ---------------------- normal front page -------------------------------

  if ((paginatedIsSuccess && allBlogs?.length === 0 && selectedDate.frontPage === null) || (paginatedIsSuccess && recentlyUploadWithAllUsers?.length === 0 && selectedDate.frontPage === null)) {
    content =
      (<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography>
          No Blogs are available at the moment
        </Typography>
      </Box>
      )
  }

  // user exist 
  if (paginatedIsSuccess && blogsWithoutCurrentUser?.length > 0 && username && isSelected === 'All' && selectedDate.frontPage === null && !updateLoading) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {blogsWithoutCurrentUser?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
          </Grid>)}
      </Grid>
    )
  }

  // user exist and recently upload
  if (paginatedIsSuccess && recentlyUploadWithoutUser?.length > 0 && username && isSelected === 'Recently Upload' && selectedDate.frontPage === null && !updateLoading) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {recentlyUploadWithoutUser?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
          </Grid>)}
      </Grid>
    )
  }

  // user not exist and all
  if (paginatedIsSuccess && allBlogs?.length > 0 && !username && isSelected === 'All' && selectedDate.frontPage === null && !updateLoading) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {allBlogs?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
          </Grid>)}
      </Grid>
    )
  }

  // user not exist and recently upload
  if (paginatedIsSuccess && recentlyUploadWithAllUsers?.length > 0 && !username && isSelected === 'Recently Upload' && selectedDate.frontPage === null && !updateLoading) {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {recentlyUploadWithAllUsers?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
          </Grid>)}
      </Grid>
    )
  }

  // ---------------------- normal front page -------------------------------

  // ---------------------- search result -----------------------------------
  // user login or logout it refetch data no need to have 2 state
  // searchResult already filter if user exist or not

  if ((isLoadingSelectedDateBlogs && selectedDate.frontPage !== null) || (updateLoading)) {
    content = (
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <LoadingSpinner />
      </Box>
    )
  }

  if (isSearch && searchResultFromRecentlyUpload?.length === 0 && isSelected === 'Recently Upload') {
    content = (
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography>
          No Blogs for the selected date are available at the moment
        </Typography>
      </Box>
    )
  }

  if (isSearch && searchResult?.length === 0 && isSelected === 'All') {
    content = (
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography>
          No Blogs for the selected date are available at the moment
        </Typography>
      </Box>
    )
  }

  if (isSearch && searchResult?.length > 0 && isSelected === 'All') {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {searchResult?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
          </Grid>)}
      </Grid>
    )
  }



  if (isSearch && searchResultFromRecentlyUpload?.length > 0 && isSelected === 'Recently Upload') {
    content = (
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 12, lg: 12, ll: 15, xl: 12, xxl: 14 }}>
        {searchResultFromRecentlyUpload?.map(blog =>
          <Grid key={blog.id} xs={12} sm={6} md={4} lg={3} ll={3} xl={2} xxl={2} >
            <MainBlog blog={blog} setUpdateLoading={setUpdateLoading} />
          </Grid>)}
      </Grid>
    )
  }

  // // ---------------------- search result -----------------------------------




  return (

    <Box sx={{ mb: '20px' }}>

      <Box sx={{ position: 'sticky', top: '70px', backgroundColor: 'white', zIndex: 10, width: '100%', pl: 2, pr: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', width: '100%', pt: '10px', pb: '10px' }}>
          {small ?
            <IconButton style={IconButtonStyle} disableRipple color="primary" sx={{ display: 'flex', justifyContent: 'flex-start', p: '0px', width: '0px' }}
              onClick={toggleDrawer(drawerDirection, true)}
            >
              <DehazeIcon color='primary' />
            </IconButton>
            : ''
          }
          <Box sx={{ width: '100%', pt: '10px' }}>
            <ClientSearchBar setSearchInput={setSearchInput} searchInput={searchInput} isSearch={isSearch} isSelectedDate={selectedDate.frontPage} handleSearch={handleSearch} handleClearFromSearch={handleClearFromSearch} handleClearFromSelectedDate={handleClearFromSelectedDate} />
          </Box>
        </Box>
        <Box  >
          {dataList?.map(category => {
            return (
              <Button style={buttonStyle} key={category.id} size='small' variant={isSelected === category.type ? 'contained' : 'text'} sx={{ minWidth: 0, mr: 2, display: selectedDate.frontPage !== null ? 'none' : 'inline-block', }} value={category.type} onClick={handleSelect} > {category.type}</Button>
            )
          }
          )}
          {/* move to search bar */}
          {/* <Box sx={{ display: 'inline-flex', flexDirection: smallerThan425 ? 'column' : 'row' }}>
            <Button size='small' sx={{ minWidth: 0, p: '4px', alignItems: 'center', justifyContent: 'center', display: isSearch ? 'inline-block' : 'none', mr: 2, backgroundColor: '#ef5350', '&:hover': { backgroundColor: 'red' } }} onClick={handleClearFromSearch} variant='contained' >Clear search result</Button>
            <Button size='small' sx={{ minWidth: 0, p: '4px', display: selectedDate.frontPage !== null ? 'inline-block' : 'none', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ef5350', '&:hover': { backgroundColor: 'red' }, mt: smallerThan425 && isSearch ? 2 : 0 }} onClick={handleClearFromSelectedDate} variant='contained' >Clear selected date</Button>
          </Box> */}
        </Box>
      </Box>

      <Box sx={{ pl: 2, pr: 2 }}>

        {content}

        {/* <Button onClick={handlePrev} disabled={page === 1 ? true : false}>pre</Button>
          {page}
          <Button onClick={handleNext} disabled={page === paginatedBlogs?.numberOfPages ? true : false}>next</Button> */}

        {
          hasMore &&
          <Box ref={moreBlogs}> </Box>
        }

      </Box >

    </Box >
  )
}



export default MainContent