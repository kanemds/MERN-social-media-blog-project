import React, { useState, useEffect, useContext } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea, Avatar, Box, Button, Popover, IconButton, SvgIcon } from '@mui/material'
import moment from 'moment'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import { useLocation, useNavigate } from 'react-router-dom'
import { timeDisplayOptions } from '../../config/timeDisplayOptions'
import useAuth from '../../hooks/useAuth'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import RecommendIcon from '@mui/icons-material/Recommend'
import RecommendRoundedIcon from '@mui/icons-material/RecommendRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LoadingSpinner from '../../components/LoadingSpinner'
import { red, pink, yellow, orange } from '@mui/material/colors'
import { useAddLikedToBlogMutation, useDeleteLikedFromBlogMutation } from '../likes/likesApiSlice'
import { set } from 'lodash'
import { messages } from '../../config/requireLoginMessage'
import { SideBarContext } from '../../useContext/SideBarContext'
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


export default function MainBlog({ blog }) {

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
      data: removeMessage,
      isLoading: isDeleteLikeLoading,
      isSuccess: isDeleteLikeSuccess,
      isError: isDeleteLikeError,
      error: deleteLikeError
    }] = useDeleteLikedFromBlogMutation()

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


  const navigate = useNavigate()
  const { username, userId } = useAuth()
  const { pathname } = useLocation()
  const [title, setTitle] = useState(blog?.title)
  const [text, setText] = useState(blog?.text)
  const [images, setImage] = useState(blog?.images[0]?.url)
  const [anchorEl, setAnchorEl] = useState(null)
  const [isClick, setIsClick] = useState(false)
  const [isLiked, setIsLiked] = useState(blog.isLike || false)
  const [isBookmarked, setIsBookmarked] = useState(blog.isBookmark || false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLikeOpen, setDeleteLikeOpen] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState(null)
  const [isDeleteReady, setIsDeleteReady] = useState(null)
  const [isDeleteLikeReady, setIsDeleteLikeReady] = useState(null)
  const [isBlogRemove, setIsBlogRemove] = useState(false)


  const current = Date.parse(new Date())
  const postedDay = Date.parse(blog.createdAt)
  const sevenDays = 60 * 60 * 24 * 1000 * 7

  const timeInMillisecond = current - postedDay



  useEffect(() => {
    if (isAddLikeSuccess) {
      setIsLiked(true)
    }
    if (isAddBookmarkSuccess) {
      setIsBookmarked(true)
    }
  }, [isAddLikeSuccess, isAddBookmarkSuccess])

  useEffect(() => {
    if (isDeleteLikeSuccess) {
      setIsLiked(false)
    }
    if (isDeleteBookmarkSuccess) {
      setIsBookmarked(false)
    }
  }, [isDeleteLikeSuccess, isDeleteBookmarkSuccess])

  console.log(blog)

  const handleToSelectedBlog = () => {
    if (!isClick) {
      navigate(`/blogs/post/${blog.id}`)
    }
  }

  const handleUserPage = () => {
    if (isClick) {
      navigate(`/blogs/user/${blog.user}`)
    }
  }

  const handleBookmark = async () => {
    if (!username) {
      navigate('/login', { state: messages.bookmark })
    } else {

      if (!isBookmarked) {
        await addBookmark({ blog_id: blog.id, bookmark_by_user_id: userId, username, is_bookmark: true })
      } else {
        const { data: deleteBookmarkInfo } = await deleteBookmark({ id: 'bookmarkId', blogId: blog.id })
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
        await addedLike({ blog_id: blog.id, user_id: userId, username, is_like: true })
      } else {
        await deleteLike({ id: blog.id, username })
      }
    }
  }


  return (
    <Card
      className='fadeIn'
      sx={{
        p: 0,
        maxWidth: 272,
        height: 360,
        boxShadow: 'box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px ',
        "&:hover": {
          boxShadow: '0 14px 18px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }
      }}
    >
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
                <Avatar sx={{ '&:hover': { background: '#1976d2', color: 'white' } }} />
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
              {username !== blog.username ?
                <IconButton
                  disableRipple
                  onClick={handleBookmark}
                  onMouseOver={() => setIsClick(true)}
                  onMouseOut={() => setIsClick(false)}
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
                : ''
              }
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton
                  disableRipple
                  onClick={handleLiked}
                  onMouseOver={() => setIsClick(true)}
                  onMouseOut={() => setIsClick(false)}
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
                <Typography sx={{ color: 'black', ml: 1 }}>999k</Typography>
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

            </Box>

          </Box>
        </CardContent>

      </CardActionArea>


    </Card >
  )
}