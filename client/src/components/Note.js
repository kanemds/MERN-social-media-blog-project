import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea, Avatar, Box, Button, Popover, IconButton, SvgIcon } from '@mui/material'
import noteBook from '../images/noteBook.jpg'
import moment from 'moment'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import { useNavigate } from 'react-router-dom'
import { timeDisplayOptions } from '../config/timeDisplayOptions'
import useAuth from '../hooks/useAuth'

import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import RecommendIcon from '@mui/icons-material/Recommend'
import RecommendRoundedIcon from '@mui/icons-material/RecommendRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Modal from '@mui/material/Modal'
import { useDeleteBlogMutation } from '../pages/blogs/blogsApiSlice'
import LoadingSpinner from './LoadingSpinner'
import { red, pink, yellow, orange } from '@mui/material/colors'


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



export default function Note({ blog }) {

  const [
    deleteBlog,
    {
      data,
      isLoading,
      isSuccess,
      isError,
      error }
  ] = useDeleteBlogMutation()

  const navigate = useNavigate()
  const { username } = useAuth()
  const [title, setTitle] = useState(blog?.title)
  const [text, setText] = useState(blog?.text)
  const [images, setImage] = useState(blog?.images[0]?.url)
  const [anchorEl, setAnchorEl] = useState(null)
  const [isClick, setIsClick] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState(null)
  const [isDeleteReady, setIsDeleteReady] = useState(false)



  const current = Date.parse(new Date())
  const postedDay = Date.parse(blog.createdAt)
  const sevenDays = 60 * 60 * 24 * 1000 * 7

  const timeInMillisecond = current - postedDay

  useEffect(() => {

    if (isSuccess && isDeleteReady === true && data?.message) {
      setDeleteMessage(data.message)
      setTimeout(() => {
        // console.log('run this setTimeout')
        setDeleteOpen(false)
        setIsClick(false)
        navigate('/blogs')
      }, 1400)
    } else {
      setIsDeleteReady(false)
    }
  }, [isSuccess, isDeleteReady, data])

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsDeleteReady(true)
      }, 1400)
    }
  }, [isLoading])


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
    navigate(`/blogs/post/edit/${blog.id}`, { state: blog })
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
      navigate(`/blogs/user/${blog.id}`)
    }
  }

  const handleFavorite = () => {
    setIsFavorite(prev => !prev)
  }

  const handleLiked = () => {
    setIsLiked(prev => !prev)
  }


  let deleteModalMessage

  if (isDeleteReady === false) {

    deleteModalMessage = <LoadingSpinner />
  }

  if (!isLoading && !isSuccess) {
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

  return (

    <Card
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
              {username !== blog.user ?
                <IconButton
                  disableRipple
                  onClick={handleFavorite}
                  onMouseOver={() => setIsClick(true)}
                  onMouseOut={() => setIsClick(false)}
                  style={iconStyle}
                  sx={{
                    mr: 1,
                    '&:hover': { color: yellow[800], background: 'white' }
                  }}
                >
                  {isFavorite ?
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
                <Typography sx={{ color: 'black', ml: 1 }}>0</Typography>
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
              {blog.user === username ?
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
                <Button onClick={handleEdit}><EditNoteOutlinedIcon /></Button>
                <Button onClick={handleLook}><RemoveRedEyeOutlinedIcon /></Button>
              </Popover>
            </Box>

          </Box>
        </CardContent>

      </CardActionArea>

    </Card >
  )
}