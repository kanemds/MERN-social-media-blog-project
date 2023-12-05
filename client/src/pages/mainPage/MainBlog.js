import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea, Avatar, Box, Button, Popover, IconButton, SvgIcon } from '@mui/material'
import moment from 'moment'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import EditNoteIcon from '@mui/icons-material/EditNote'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import { useAsyncError, useLocation, useNavigate } from 'react-router-dom'
import { timeDisplayOptions } from '../../config/timeDisplayOptions'
import useAuth from '../../hooks/useAuth'
import Modal from '@mui/material/Modal'
import LoadingSpinner from '../../components/LoadingSpinner'
import { red, pink, yellow, orange } from '@mui/material/colors'
import { useAddLikedToBlogMutation, useDeleteLikedFromBlogMutation } from '../likes/likesApiSlice'
import { apiSlice } from '../../app/api/apiSlice'
import { useDispatch } from 'react-redux'
import FavoriteIcon from '@mui/icons-material/Favorite'
import useNumberDisplay from '../../hooks/useNumberDisplay'
import { messages } from '../../config/requireLoginMessage'
import { useAddBookmarkMutation, useDeleteBookmarkMutation } from '../bookmark/bookmarkApiSlice'

const iconStyle = {
  padding: '0px',
}

const styleDelete = {
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


const fadeStyle = {
  animation: 'fadeInAnimation ease 2s',
  animationIterationCount: 1,
  animationFillMode: 'forwards',
}

const loadedStyles = `
  @keyframes fadeInAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`
const removedStyles = `
  @keyframes fadeInAnimation {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`


export default function MainBlog({ blog, setUpdateLoading }) {
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
      data: deleteLikeMessage,
      isLoading: isDeleteLikeLoading,
      isSuccess: isDeleteLikeSuccess,
      isError: isDeleteLikeError,
      error: deleteLikeError
    }
  ] = useDeleteLikedFromBlogMutation()

  const [
    addBookmark, {
      isLoading: isAddBookmarkLoading,
      isSuccess: isAddBookmarkSuccess,
      isError: isAddBookmarkError,
      error: addBookmarkError
    }
  ] = useAddBookmarkMutation()

  const [
    deleteBookmark, {
      isLoading: isDeleteBookmarkLoading,
      isSuccess: isDeleteBookmarkSuccess,
      isError: isDeleteBookmarkError,
      error: deleteBookmarkError
    }
  ] = useDeleteBookmarkMutation()


  // const number = useNumberDisplay(blog?.like?.totalLikes)
  const number = useNumberDisplay(blog?.like_data?.total_likes)
  const [isLiked, setIsLiked] = useState(blog?.like_data?.is_liked || false)
  const [isBookmarked, setIsBookmarked] = useState(blog?.bookmark_data?.is_bookmarked || false)

  const navigate = useNavigate()
  const { username, userId } = useAuth()
  const { pathname } = useLocation()
  const [avatar, setAvatar] = useState(blog?.blogger_avatar ? blog?.blogger_avatar : null)
  const [title, setTitle] = useState(blog?.title)
  const [text, setText] = useState(blog?.text)
  const [images, setImage] = useState(blog?.images[0]?.url)
  const [anchorEl, setAnchorEl] = useState(null)
  const [isClick, setIsClick] = useState(false)
  // const [deleteOpen, setDeleteOpen] = useState(false)
  // const [deleteMessage, setDeleteMessage] = useState(null)
  // const [isDeleteReady, setIsDeleteReady] = useState(null)
  // const [loading, setLoading] = useState(false)
  const [totalLikes, setTotalLikes] = useState(number || 0)
  const current = Date.parse(new Date())
  const postedDay = Date.parse(blog.createdAt)
  const sevenDays = 60 * 60 * 24 * 1000 * 7

  const timeInMillisecond = current - postedDay

  // useEffect(() => {
  //   if (isDeleteReady && removeMessage) {
  //     setDeleteMessage(removeMessage?.message)
  //     setTimeout(() => {
  //       setDeleteOpen(false)
  //       setAnchorEl(null)
  //       setRefresh(true)
  //       setIsDeleteReady(false)
  //       setLoading(false)
  //       console.log('remove blog')
  //     }, 1400)
  //   }
  // }, [isDeleteReady])



  // useEffect(() => {
  //   if (isDeleteLoading) {
  //     setLoading(true)
  //     setTimeout(() => {
  //       setIsDeleteReady(true)
  //     }, 1400)
  //   }
  // }, [isDeleteLoading])


  const handleClick = (event) => {
    if (isClick) {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleClose = () => {
    setIsClick(false)
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleToSelectedBlog = () => {
    if (!isClick) {
      navigate(`/blogs/post/${blog.id}`)
    }
  }

  // const handleLook = () => {
  //   if (isClick) {
  //     navigate(`/blogs/post/${blog.id}`)
  //   }
  // }

  // const handleEdit = () => {
  //   navigate(`/blogs/post/edit/${blog.id}`)
  // }


  // const handleDeleteClose = () => {
  //   setDeleteOpen(false)
  //   setIsClick(false)
  //   setAnchorEl(null)
  // }

  // const handleDelete = () => setDeleteOpen(true)

  // const handleDeleteConfirm = async (e) => {
  //   e.preventDefault()
  //   await deleteBlog({ id: blog.id })
  // }

  const handleUserPage = () => {
    if (isClick) {
      navigate(`/blogs/user/${blog.user}`)
    }
  }

  const handleBookmark = async (e) => {
    e.preventDefault()
    if (!username) {
      navigate('/login', { state: messages.bookmark })
    } else {

      if (!isBookmarked) {
        setUpdateLoading(true)
        await addBookmark({ blog_id: blog._id, bookmark_by_user_id: userId, username, is_bookmark: true })
      } else {
        setUpdateLoading(true)
        const { data: deleteBookmarkInfo } = await deleteBookmark({ id: blog.bookmark_data.bookmark_id, blogId: blog._id })
        console.log(deleteBookmarkInfo)
      }
    }
  }


  const handleLiked = async (e) => {
    e.preventDefault()
    // setIsLiked(prev => !prev)
    if (!username) {
      navigate('/login', { state: messages.like })
    } else {
      if (!isLiked) {
        setUpdateLoading(true)
        await addedLike({ blog_id: blog._id, user_id: userId, username, is_like: true })
      } else {
        setUpdateLoading(true)
        const { data: deleteLikeInfo } = await deleteLike({ id: blog.like_data.like_id, blogId: blog._id, })
        console.log(deleteLikeInfo)
      }
    }
  }


  // ////////////////////////////////////////////////// delete blog ////////////////////////////////////////////////////
  // let deleteModalMessage

  // if (loading) {
  //   deleteModalMessage = <LoadingSpinner />
  // }

  // if (!loading) {
  //   deleteModalMessage = (
  //     <>
  //       <Typography id="modal-modal-title" variant="h6" component="h2">
  //         Delete the selected blog?
  //       </Typography>
  //       <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
  //         <Button variant='contained' onClick={handleDeleteClose}>Cancel</Button>
  //         <Button variant='contained' onClick={handleDeleteConfirm} sx={{
  //           backgroundColor: red[600],
  //           color: 'white',
  //           '&:hover': {
  //             backgroundColor: red[800]
  //           }
  //         }}>Delete Blog</Button>
  //       </Box>
  //     </>
  //   )
  // }

  // if (isDeleteReady) {
  //   deleteModalMessage = (
  //     <Typography id="modal-modal-title" variant="h6" component="h2">
  //       {deleteMessage}
  //     </Typography>
  //   )
  // }

  console.log(isClick)

  return (

    <Card
      className='fadeIn'
      sx={{
        p: 0,
        maxWidth: 500,
        height: 360,
        boxShadow: 'box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px ',
        "&:hover": {
          boxShadow: '0 14px 18px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }
      }}
    >
      {/* keyframes animation will only apply to elements within the scope of the component. It won't affect other elements on the page, */}
      {/* <style>{loadedStyles}</style> */}
      <CardActionArea
        component="div"
        sx={{
          color: "white",
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "white",
          }
        }}
        disableRipple={true}
        onClick={handleToSelectedBlog}
      >

        <CardMedia
          sx={{ height: 180, width: '100%' }}
          component="img"
          image={images}
          alt={title}
        />

        <CardContent sx={{ height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
          <Box sx={{ display: 'flex', height: 120 }}>
            <Box>
              <IconButton
                onMouseOver={() => setIsClick(true)}
                onMouseOut={() => setIsClick(false)}

                onClick={handleUserPage}
                disableRipple={true}
                sx={{ display: 'flex', alignItems: 'self-start', p: 0, mr: '16px' }}
              >
                {avatar ?
                  <Avatar src={avatar} />
                  :
                  <Avatar sx={{ '&:hover': { background: '#1976d2', color: 'white' } }} />
                }

              </IconButton>
            </Box>

            <Box>
              <Typography variant="body1" sx={{
                color: 'black',
                wordBreak: "break-word", display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                fontWeight: 'bold',
                textOverflow: 'ellipsis',
                mb: 1
              }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                wordBreak: "break-word", display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                textOverflow: 'ellipsis',
              }}>
                {text}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', height: 28, width: '100%' }}>

            {/* favorite and like */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '40%' }}>

              <IconButton
                disableRipple
                onClick={handleBookmark}
                onMouseOver={() => setIsClick(true)}
                onMouseOut={() => setIsClick(false)}
                onTouchStart={() => setIsClick(true)}
                onTouchEnd={() => setIsClick(true)}
                style={iconStyle}
                sx={{
                  mr: 1,
                  '&:hover': { color: yellow[800], background: 'white' }
                }}
              >
                {isBookmarked ?
                  <StarRoundedIcon sx={{ fontSize: '24px', color: yellow[800] }} />
                  :
                  <StarOutlineRoundedIcon sx={{ fontSize: '24px', color: '#bdbdbd' }} />
                }
              </IconButton>


              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton
                  disableRipple
                  onClick={handleLiked}
                  onMouseOver={() => setIsClick(true)}
                  onMouseOut={() => setIsClick(false)}
                  onTouchStart={() => setIsClick(true)}
                  onTouchEnd={() => setIsClick(true)}
                  style={iconStyle}
                  sx={{
                    '&:hover': { color: red[400], background: 'white' }
                  }}
                >
                  {isLiked ?

                    <FavoriteIcon sx={{ fontSize: '20px', color: red[400] }} />
                    :
                    <FavoriteBorderIcon sx={{ fontSize: '20px', color: '#bdbdbd' }} />
                  }
                </IconButton>
                <Typography sx={{ color: 'black', ml: 1 }}>{totalLikes}</Typography>
              </Box>
            </Box>

            {/* show day and menu  */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '60%' }}>

              <Typography color='black'>
                {
                  timeInMillisecond <= sevenDays ?
                    moment(Date.parse(blog.createdAt)).fromNow()
                    :
                    new Date(Date.parse(blog.createdAt)).toLocaleString(undefined, timeDisplayOptions.optionTwo)
                }

              </Typography>
              {/* {bloggerUsername === username ?
                <IconButton
                  onMouseOver={() => setIsClick(true)}
                  onMouseOut={() => setIsClick(false)}
                  aria-describedby={id}
                  variant="contained"
                  onClick={handleClick}
                  sx={{ p: 0, '&:hover': { backgroundColor: 'white', color: '#1976d2' } }}

                >
                  <MoreVertOutlinedIcon sx={{ fontSize: '20px' }} />
                </IconButton>
                : ''} */}

              {/* <Popover
                onMouseOver={() => setIsClick(true)}
                onMouseOut={() => setIsClick(false)}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
              >
                <Button onClick={handleDelete} ><DeleteForeverOutlinedIcon /></Button>

                <Modal
                  open={deleteOpen}
                  onClose={handleDeleteClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={styleDelete}>
                    {deleteModalMessage}
                  </Box>
                </Modal>
                <Button onClick={handleEdit}><EditNoteIcon /></Button>
                <Button onClick={handleLook}><RemoveRedEyeOutlinedIcon /></Button>
              </Popover> */}
            </Box>

          </Box>
        </CardContent>

      </CardActionArea>
    </Card >
  )
}