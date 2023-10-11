import { Box, Container, Paper, Typography, TextField, Modal, Button, IconButton, SvgIcon, Avatar } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import HorizontalSwiper from '../../components/swiper/HorizontalSwiper'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { blogsApiSlice, useDeleteBlogMutation, useGetPaginatedBlogsQuery, useGetSingleBlogQuery } from './blogsApiSlice'
import useAuth from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner'
import ImagesDisplaySlider from './ImagesDisplaySlider'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import { timeDisplayOptions } from '../../config/timeDisplayOptions'
import moment from 'moment'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import useMediaQuery from '@mui/material/useMediaQuery'
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { apiSlice } from '../../app/api/apiSlice'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined'
import { useAddLikedToBlogMutation, useDeleteLikedFromBlogMutation, useGetLikeForSingleBlogQuery, useGetLikedBlogsFromUserQuery } from '../likes/likesApiSlice'
import { messages } from '../../config/requireLoginMessage'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import { red, pink, yellow, orange } from '@mui/material/colors'
import './imagesDisplaySlider.css'
import { useDispatch } from 'react-redux'
import DehazeIcon from '@mui/icons-material/Dehaze'
import { SideBarContext } from '../../useContext/SideBarContext'
import { useAddSubscribedBlogMutation, useDeleteSubscribedFromBlogMutation } from '../subscribed/subscribeApiSlice'
import { useAddBookmarkMutation, useDeleteBookmarkMutation } from '../bookmark/bookmarkApiSlice'
import useNumberDisplay from '../../hooks/useNumberDisplay'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 140,
  bgcolor: 'background.paper',
  border: '2px solid #bdbdbd',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  p: 4,
  borderRadius: '20px',
}

const IconButtonStyle = {
  width: '40px', height: '40px'
}


const stylePicture = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}
const SideButton = styled(Button)({
  textTransform: 'none',
  justifyContent: "flex-start",

})

const ButtonInfo = styled(Typography)({
  textAlign: 'left',
  width: '48px',
  marginLeft: 10
})

const Divider = styled(Box)({
  width: '100%',
  borderTop: '1px solid lightGrey',
  marginTop: 20,
  marginBottom: 20,
})

const iconStyle = {
  padding: '0px',
}

const SingleBlog = () => {



  const small = useMediaQuery('(max-width:791px)')
  const mediumBP = useMediaQuery('(min-width:750px)') // true when larger
  const smallBP = useMediaQuery('(min-width:550px)') // true when larger
  const xSamllBP = useMediaQuery('(min-width:466px)') // true when larger

  const { id } = useParams()
  const { username, userId } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { state, setState, drawerDirection, toggleDrawer } = useContext(SideBarContext)


  /////////////// find and delete blog ///////////////////////

  const currentSingleBlog = {
    id,
    username: username ? username : null
  }

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSingleBlogQuery(currentSingleBlog)


  const [
    deleteBlog,
    {
      data: message,
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess
    }
  ] = useDeleteBlogMutation()

  /////////////// find and delete blog ///////////////////////

  /////////////// add and delete like ///////////////////////

  const [
    addedLike,
    {
      isLoading: isAddLikeLoading,
      isSuccess: isAddLikeSuccess,
      isError: isAddLikeError,
      error: addLikeError
    }
  ] = useAddLikedToBlogMutation()

  const [
    deleteLike,
    {
      isLoading: isDeleteLikeLoading,
      isSuccess: isDeleteLikeSuccess,
      isError: isDeleteLikeError,
      error: deleteLikeError
    }] = useDeleteLikedFromBlogMutation()

  /////////////// find, add and delete like ///////////////////////

  /////////////// find, add and delete bookmark ///////////////////////

  const [
    addBookmark,
    {
      isSuccess: isAddBookmarkSuccess,
      isLoading: isAddBookmarkLoading,
      isError: isAddBookmarkError,
      error: addBookmarkError
    }
  ] = useAddBookmarkMutation()

  const [
    deleteBookmark,
    {
      isSuccess: isDeleteBookmarkSuccess,
      isLoading: isDeleteBookmarkLoading,
      isError: isDeleteBookmarkError,
      error: deleteBookmarkError
    }
  ] = useDeleteBookmarkMutation()

  /////////////// find, add and delete bookmark ///////////////////////


  /////////////// add and delete subscribe ///////////////////////

  const [
    addSubscribe,
    {
      isLoading: isAddSubscribeLoading,
      isSuccess: isAddSubscribeSuccess,
      isError: isAddSubscribeError,
      error: addSubscribError
    }
  ] = useAddSubscribedBlogMutation()

  const [
    deleteSubscribed,
    {
      isLoading: isDeleteSubscribedLoading, isSuccess: isDeleteSubscribedSuccess,
      isError: isDeleteSubscribedError,
      error: deleteSubscribedError
    }
  ] = useDeleteSubscribedFromBlogMutation()

  /////////////// add and delete subscribe ///////////////////////

  const [currentBlog, setCurrentBlog] = useState('')
  const [open, setOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState(null)
  const [isDeleteReady, setIsDeleteReady] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [subscribers, setSubscribers] = useState(0)
  const [likes, setLikes] = useState(0)


  const numberSubscribers = useNumberDisplay(subscribers)
  const numberLikes = useNumberDisplay(likes)

  useEffect(() => {
    if (isSuccess) {
      setCurrentBlog(data)
      setIsLiked(data.like.isLike)
      setLikes(data.like.totalLikes)
      setIsSubscribed(data.subscribe.isSubscribed)
      setSubscribers(data.subscribe.totalSubscribers)
      setIsBookmarked(data.bookmark.isBookmarked)
    }
  }, [isSuccess, data])


  // useEffect(() => {
  //   if (isAddLikeSuccess) {
  //     setIsLiked(true)
  //   }
  //   if (isDeleteLikeSuccess) {
  //     setIsLiked(false)
  //   }
  //   if (isAddSubscribeSuccess) {
  //     setIsSubscribed(true)
  //   }
  //   if (isDeleteSubscribedSuccess) {
  //     setIsSubscribed(false)
  //   }
  //   if (isAddBookmarkSuccess) {
  //     setIsBookmarked(true)
  //   }
  //   if (isDeleteBookmarkSuccess) {
  //     setIsBookmarked(false)
  //   }
  // }, [isDeleteLikeSuccess, isAddLikeSuccess, isAddSubscribeSuccess, isDeleteSubscribedSuccess, isAddBookmarkSuccess, isDeleteBookmarkSuccess])




  useEffect(() => {

    if (isDeleteSuccess && isDeleteReady === true && message?.message) {
      setDeleteMessage(message.message)
      setTimeout(() => {
        setDeleteOpen(false)
        dispatch(apiSlice.util.invalidateTags(['Blog']))
        navigate('/blogs')
      }, 1400)
    } else {
      setIsDeleteReady(false)
    }
  }, [isDeleteSuccess, isDeleteReady, message])

  useEffect(() => {
    if (isDeleteLoading) {
      setTimeout(() => {
        setIsDeleteReady(true)
      }, 1400)
    }
  }, [isDeleteLoading])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleToEdit = () => navigate(`/blogs/post/edit/${id}`)
  const handleDelete = () => setDeleteOpen(true)
  const handleDeleteClose = () => setDeleteOpen(false)
  const handleDeleteConfirm = async (e) => {
    e.preventDefault()
    await deleteBlog({ id })
  }
  const handleBackToBlogs = () => {
    navigate(-1)
  }

  const handleUserPage = () => {
    navigate(`/blogs/user/${data.id}`)
  }

  const handleLiked = (e) => {
    e.preventDefault()
    if (username) {
      if (!isLiked) {
        addedLike({ blog_id: id, user_id: userId, username, is_like: true })

      } else {
        deleteLike({ id: currentBlog?.like?.likeId, blogId: id })
      }
    } else {
      navigate('/login', { state: messages.like })
    }
  }

  const handleBookmark = (e) => {
    e.preventDefault()
    if (username) {
      if (!isBookmarked) {
        addBookmark({ blog_id: id, bookmark_by_user_id: userId, username, is_bookmark: true })
      } else {
        deleteBookmark({ id: currentBlog?.bookmark?.bookmarkId, blog_id: id })
      }
    } else {
      navigate('/login', { state: messages.bookmark })
    }
  }


  const handleToSubscribed = (e) => {
    e.preventDefault()
    if (username) {
      if (!isSubscribed) {
        addSubscribe({ id: currentBlog?.user_id, userId, username, isSubscribed: true })
      } else {
        deleteSubscribed({ blogId: id, id: currentBlog.subscribe.subscribedId })
      }
    } else {
      navigate('/login', { state: messages.subscribe })
    }
  }


  const current = Date.parse(new Date())
  const postedDay = Date.parse(currentBlog?.createdAt)
  const sevenDays = 60 * 60 * 24 * 1000 * 7

  const timeInMillisecond = current - postedDay
  const localCreatedTime = new Date(Date.parse(currentBlog?.createdAt)).toLocaleString(undefined, timeDisplayOptions.optionTwo)
  const localUpdatedTime = new Date(Date.parse(currentBlog?.updatedAt)).toLocaleString(undefined, timeDisplayOptions.optionTwo)

  let deleteModalMessage

  if (isDeleteReady === false) {

    deleteModalMessage = <LoadingSpinner />
  }

  if (!isDeleteLoading && !isDeleteSuccess) {
    deleteModalMessage = (
      <>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Delete the selected blog?
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
          <Button variant='contained' onClick={handleDeleteClose}>Cancel</Button>
          <Button variant='contained' onClick={handleDeleteConfirm} sx={{
            backgroundColor: red[600],
            color: 'white',
            '&:hover': {
              backgroundColor: red[800]
            }
          }}>Delete Blog</Button>
        </Box>
      </>
    )
  }

  if (isDeleteReady === true && deleteMessage) {
    deleteModalMessage = (
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {deleteMessage}
      </Typography>
    )
  }

  let content

  if (isLoading) {
    content = (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </Box>
    )
  }

  if (isSuccess) {

    content = (

      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >

        <Paper onClick={handleOpen} className='display' sx={!xSamllBP ? { width: 375, height: 375 } : !smallBP ? { width: 420, height: 420 } : { width: 500, height: 500 }}>
          <ImagesDisplaySlider row={currentBlog?.images} />
        </Paper>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={stylePicture}>
            <ImagesDisplaySlider row={currentBlog?.images} handleClose={handleClose} on={open} />
          </Box>
        </Modal>
        <Box sx={{ width: !smallBP ? '80%' : 500, m: 2, display: 'flex', flexDirection: !smallBP ? 'column' : 'row', justifyContent: 'center', alignItems: !smallBP ? 'flex-end' : 'center' }}>
          <Typography sx={{ fontSize: '13px', width: '220px', display: 'flex', justifyContent: !smallBP ? 'flex-start' : 'center' }}>
            Posted:
            {
              timeInMillisecond <= sevenDays ?
                moment(Date.parse(currentBlog?.createdAt)).fromNow()
                :
                localCreatedTime
            }
          </Typography>


          <Typography sx={{ fontSize: '13px', width: '220px', display: 'flex', justifyContent: !smallBP ? 'flex-start' : 'center' }}>
            Last Updated:
            {
              timeInMillisecond <= sevenDays ?
                moment(Date.parse(currentBlog?.updatedAt)).fromNow()
                :
                localUpdatedTime
            }
          </Typography>

        </Box>

        <Box sx={{ width: !xSamllBP ? 360 : !smallBP ? 410 : 500, display: 'flex', flexDirection: smallBP ? 'row' : currentBlog?.username === username ? 'row' : 'column', alignItems: smallBP ? 'center' : 'flex-start', mb: 2 }}>
          <Box sx={{ width: '80%', display: 'flex', alignItems: 'center', mr: 2, }} >

            <IconButton
              onClick={handleUserPage}
              disableRipple={true}
              sx={{ display: 'flex', alignItems: 'self-start', p: 0, mr: '16px' }}
            >
              <Avatar sx={{ '&:hover': { background: '#1976d2', color: 'white' } }} />
            </IconButton>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography sx={{
                wordBreak: "break-word", display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
                textOverflow: 'ellipsis',
              }}>{data.username}</Typography>
              <Typography sx={{ fontSize: '12px' }}>{numberSubscribers} subscribers</Typography>
            </Box>
          </Box>


          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: currentBlog?.username === username ? 'flex-end' : 'space-between', p: 1 }}>

            {currentBlog?.username === username ? '' : isSubscribed ?
              <Button
                onClick={handleToSubscribed}
                sx={{
                  '&:hover': { background: '#f4f4f4' },
                  color: '#bdbdbd',
                  textTransform: 'none',
                }}>
                <Diversity2OutlinedIcon sx={{
                  color: 'rgba(0, 0, 0, 0.87)',
                  fontSize: '20px',
                  mr: 1
                }} />
                <Typography color='rgba(0, 0, 0, 0.87)'> Subscribed</Typography>
              </Button> :
              <Button
                onClick={handleToSubscribed}
                sx={{
                  textTransform: 'none',
                }}>
                <Diversity2OutlinedIcon sx={{
                  fontSize: '20px',
                  mr: 1
                }} />
                <Typography > Subscribe</Typography>
              </Button>
            }
            <Box sx={{ display: 'flex' }}>
              {username !== currentBlog.username ?
                <IconButton
                  disableRipple
                  onClick={handleBookmark}
                  style={iconStyle}
                  sx={{
                    width: '28px',
                    height: '28px',
                    mr: 1,
                    '&:hover': { color: yellow[800], background: 'white' }
                  }}
                >
                  {isBookmarked ?

                    <StarRoundedIcon sx={{ color: yellow[800], fontSize: '28px' }} />

                    :

                    <StarOutlineRoundedIcon sx={{ color: '#bdbdbd', fontSize: '28px' }} />

                  }
                </IconButton>
                : ''
              }

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  disableRipple
                  onClick={handleLiked}

                  style={iconStyle}
                  sx={{

                    width: '28px',
                    height: '28px',
                    '&:hover': { color: red[400], background: 'white' }
                  }}
                >
                  {isLiked || currentBlog?.username === username ?
                    <FavoriteIcon sx={{ color: red[400] }} />
                    :
                    <FavoriteBorderIcon sx={{ color: '#bdbdbd' }} />
                  }
                </IconButton>
                <Typography sx={{ color: 'black', ml: 1 }}>{numberLikes}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>



        <Box sx={{ width: !smallBP ? '80%' : 500, mb: 10 }}>
          <Divider />
          <TextField
            sx={{
              '.css-1rcvvn7-MuiInputBase-root-MuiInput-root:before': {
                border: 'hidden'
              },
              '.css-1rcvvn7-MuiInputBase-root-MuiInput-root.Mui-disabled:before': {
                borderBottomStyle: 'hidden',
                border: 'hidden'
              },
              '& .MuiInputBase-input.Mui-disabled': {
                fontSize: 22,
                WebkitTextFillColor: 'black',
                '&:hover': {
                  cursor: 'text'
                }
              },
            }
            }
            disabled
            variant='standard'
            fullWidth
            multiline
            defaultValue={currentBlog.title}
          />
          <Divider />
          <TextField
            sx={{
              '.css-1rcvvn7-MuiInputBase-root-MuiInput-root:before': {
                border: 'hidden'
              },
              '.css-1rcvvn7-MuiInputBase-root-MuiInput-root.Mui-disabled:before': {
                borderBottomStyle: 'hidden',
                border: 'hidden'
              },
              '& .MuiInputBase-input.Mui-disabled': {
                fontSize: 16,
                WebkitTextFillColor: 'black',
                '&:hover': {
                  cursor: 'text'
                }
              },
            }}
            disabled
            variant='standard'
            fullWidth
            multiline
            defaultValue={currentBlog.text}
          />
        </Box>
      </Box >

    )
  }

  let menuButton


  if (small) {
    menuButton = (
      <Box sx={{ position: 'fixed', bottom: 0, background: '#bdbdbd', zIndex: 30, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
        <SideButton disableRipple color="primary" sx={{ m: 1 }}
          onClick={toggleDrawer(drawerDirection, true)}
        >
          <DehazeIcon color='primary' />
          <ButtonInfo >  Menu</ButtonInfo>
        </SideButton>
        <SideButton onClick={handleBackToBlogs} sx={{ m: 1 }}>
          <ForwardRoundedIcon
            style={{ transform: 'rotate(180deg)' }}
          />
          <ButtonInfo >  Back</ButtonInfo>
        </SideButton>
        {username === currentBlog.username ?
          <>
            <SideButton onClick={handleDelete} sx={{ m: 1 }}>
              <SvgIcon>
                <svg
                  viewBox='2 0 24 24'
                >
                  <DeleteForeverOutlinedIcon />
                </svg>
              </SvgIcon>
              <ButtonInfo >Delete</ButtonInfo>
            </SideButton>
            <SideButton onClick={handleToEdit} sx={{ m: 1 }}>
              <EditNoteOutlinedIcon />
              <ButtonInfo >  Edit</ButtonInfo>
            </SideButton>
          </>
          :
          ''
        }
        <Modal
          open={deleteOpen}
          onClose={handleDeleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {deleteModalMessage}
          </Box>
        </Modal>
      </Box >
    )
  }

  return (
    <Box
      className='fadeIn'
      sx={{
        display: 'flex', width: '100%', height: '100%', minWidth: '375px', minHeight: '375px', position: !mediumBP ? 'none' : 'relative', justifyContent: 'space-evenly'
      }}>
      {menuButton}
      < Box sx={{
        width: '100%', height: '100%'
      }}>
        {content}
      </Box >
    </Box >

  )
}

export default SingleBlog