import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea, Avatar, Box, Button, Popover, IconButton, SvgIcon } from '@mui/material'
import moment from 'moment'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import EditNoteIcon from '@mui/icons-material/EditNote'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import { useLocation, useNavigate } from 'react-router-dom'
import { timeDisplayOptions } from '../../config/timeDisplayOptions'
import useAuth from '../../hooks/useAuth'
import Modal from '@mui/material/Modal'
import { useDeleteBlogMutation } from './blogsApiSlice'
import LoadingSpinner from '../../components/LoadingSpinner'
import { red, pink, yellow, orange } from '@mui/material/colors'
import { useAddLikedToBlogMutation, useDeleteLikedFromBlogMutation } from '../likes/likesApiSlice'
import { apiSlice } from '../../app/api/apiSlice'
import { useDispatch } from 'react-redux'
import FavoriteIcon from '@mui/icons-material/Favorite'
import useNumberDisplay from '../../hooks/useNumberDisplay'

const iconStyle = {
  padding: '0px',
}

const styleDelete = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '330px',
  height: 140,
  bgcolor: 'background.paper',
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


export default function Blog({ blog, setRefresh, deleteBlog, isDeleteLoading, removeMessage }) {


  const dispatch = useDispatch()

  const number = useNumberDisplay(blog?.likedCount)

  const navigate = useNavigate()
  const { username, userId } = useAuth()
  const { pathname } = useLocation()
  const [title, setTitle] = useState(blog?.title)
  const [text, setText] = useState(blog?.text)
  const [images, setImage] = useState(blog?.images[0]?.url)
  const [userAvatar, setUserAvatar] = useState(blog?.blogger_avatar ? blog?.blogger_avatar : null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [isClick, setIsClick] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState(null)
  const [isDeleteReady, setIsDeleteReady] = useState(null)
  const [loading, setLoading] = useState(false)
  const [totalLikes, setTotalLieks] = useState(number || 0)
  const current = Date.parse(new Date())
  const postedDay = Date.parse(blog.createdAt)
  const sevenDays = 60 * 60 * 24 * 1000 * 7

  const timeInMillisecond = current - postedDay

  useEffect(() => {
    if (isDeleteReady && removeMessage) {
      setDeleteMessage(removeMessage?.message)
      setTimeout(() => {
        setDeleteOpen(false)
        setAnchorEl(null)
        setRefresh(true)
        setIsDeleteReady(false)
        setLoading(false)
        // dispatch(apiSlice.util.invalidateTags([{ type: 'Blog', id: 'LIST' }]))
        console.log('remove blog')
      }, 1400)
    }
  }, [isDeleteReady])



  useEffect(() => {
    if (isDeleteLoading) {
      setLoading(true)
      setTimeout(() => {
        setIsDeleteReady(true)
      }, 1400)
    }
  }, [isDeleteLoading])


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

  const handleLook = () => {
    if (isClick) {
      navigate(`/blogs/post/${blog.id}`)
    }
  }

  const handleEdit = () => {
    navigate(`/blogs/post/edit/${blog.id}`)
  }


  const handleDeleteClose = () => {
    setDeleteOpen(false)
    setIsClick(false)
    setAnchorEl(null)
  }

  const handleDelete = () => setDeleteOpen(true)

  const handleDeleteConfirm = async (e) => {
    e.preventDefault()
    await deleteBlog({ id: blog.id })
  }

  const handleUserPage = () => {
    if (isClick) {
      navigate(`/blogs/user/${blog.user}`)
    }
  }


  ////////////////////////////////////////////////// delete blog ////////////////////////////////////////////////////
  let deleteModalMessage

  if (loading) {
    deleteModalMessage = <LoadingSpinner />
  }

  if (!loading) {
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

  if (isDeleteReady) {
    deleteModalMessage = (
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {deleteMessage}
      </Typography>
    )
  }


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
                {userAvatar ?
                  <Avatar src={userAvatar} />
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

            {/* total like */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '30%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FavoriteIcon sx={{ fontSize: '20px', color: red[400] }} />
                <Typography sx={{ color: 'black', ml: 1 }}>{totalLikes}</Typography>
              </Box>
            </Box>

            {/* show day and menu  */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '70%' }}>

              <Typography color='black'>
                {
                  timeInMillisecond <= sevenDays ?
                    moment(Date.parse(blog.createdAt)).fromNow()
                    :
                    new Date(Date.parse(blog.createdAt)).toLocaleString(undefined, timeDisplayOptions.optionTwo)
                }
              </Typography>
              {blog.username === username ?
                <IconButton
                  onMouseOver={() => setIsClick(true)}
                  onMouseOut={() => setIsClick(false)}
                  onTouchStart={() => setIsClick(true)}
                  onTouchEnd={() => setIsClick(true)}
                  aria-describedby={id}
                  variant="contained"
                  onClick={handleClick}
                  sx={{ p: 0, '&:hover': { backgroundColor: 'white', color: '#1976d2' } }}

                >
                  <MoreVertOutlinedIcon sx={{ fontSize: '20px' }} />
                </IconButton>
                : ''}

              <Popover
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
              </Popover>
            </Box>

          </Box>
        </CardContent>

      </CardActionArea>


    </Card >
  )
}