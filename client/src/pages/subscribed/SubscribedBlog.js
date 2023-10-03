import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea, Avatar, Box, Button, Popover, IconButton, SvgIcon } from '@mui/material'
import moment from 'moment'
import { useLocation, useNavigate } from 'react-router-dom'
import { timeDisplayOptions } from '../../config/timeDisplayOptions'
import useAuth from '../../hooks/useAuth'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Modal from '@mui/material/Modal'
import LoadingSpinner from '../../components/LoadingSpinner'
import { red, pink, yellow, orange } from '@mui/material/colors'
import { apiSlice } from '../../app/api/apiSlice'
import { useDispatch } from 'react-redux'
import { set } from 'lodash'
import img from './Dtqnxj1W4AAgFut.jpg'
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined'
import useTimeDisplay from '../../hooks/useTimeDisplay'

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


export default function SubscribedBlog({ blog, setRefresh, deleteSubscribed, removeMessage, isDeleteSubscribedLoading }) {

  const dispatch = useDispatch()

  const navigate = useNavigate()
  const { username, userId } = useAuth()
  const { pathname } = useLocation()

  const [isClick, setIsClick] = useState(false)
  const [deleteSubscribedOpen, setDeleteSubscribedOpen] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDeleteSubscribedReady, setIsDeleteSubscribedReady] = useState(false)
  const [timeDisplay, setTimeDisplay] = useState(useTimeDisplay(blog.createdAt) || null)

  useEffect(() => {
    if (isDeleteSubscribedReady && removeMessage) {
      setDeleteMessage(removeMessage?.message)
      setTimeout(() => {
        setDeleteSubscribedOpen(false)
        setRefresh(true)
        setIsDeleteSubscribedReady(false)
        setLoading(false)
        console.log('remove Like')
      }, 1400)
    }
  }, [isDeleteSubscribedReady])

  useEffect(() => {
    if (isDeleteSubscribedLoading) {
      setLoading(true)
      setTimeout(() => {
        console.log('loading')
        setIsDeleteSubscribedReady(true)
      }, 1400)
    }
  }, [isDeleteSubscribedLoading])




  const handleDeleteClose = () => {
    setDeleteSubscribedOpen(false)
  }
  const handleDeleteOpen = () => {
    setDeleteSubscribedOpen(true)
  }

  const handleDeleteConfirm = async (e) => {
    e.preventDefault()
    await deleteSubscribed({ id: blog.id })
  }

  console.log(blog)

  const handleUserPage = () => {
    if (!isClick) {
      navigate(`/blogs/user/${blog.blog_owner_id}`)
    }
  }

  ////////////////////////////////////////////////// delete subscribe ////////////////////////////////////////////////////
  let deleteModalMessage

  if (loading) {
    deleteModalMessage = <LoadingSpinner />
  }

  if (isDeleteSubscribedReady) {
    deleteModalMessage = (
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {deleteMessage}
      </Typography>
    )
  }

  if (!loading) {
    deleteModalMessage = (
      <>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Cancel your subscription to this blogger?
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
          <Button variant='contained' onClick={handleDeleteClose}>Cancel</Button>
          <Button variant='contained' onClick={handleDeleteConfirm} sx={{
            backgroundColor: red[600],
            color: 'white',
            '&:hover': {
              backgroundColor: red[800]
            }
          }}>unsubscribe </Button>
        </Box>
      </>
    )
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////


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
      {/* keyframes animation will only apply to elements within the scope of the component. It won't affect other elements on the page, */}
      <CardActionArea
        component="div"
        sx={{
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "white",
          }
        }}
        disableRipple={true}
        onClick={handleUserPage}
      >
        <Box sx={{ height: 180, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
          <CardMedia
            sx={{ height: '100%', width: 'auto', borderRadius: '50%', objectFit: 'scale-down' }}
            component="img"
            image={img}
            alt={'random'}
          />
        </Box>
        <CardContent sx={{ height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }} >

          <Typography sx={{
            wordBreak: "break-word",
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            textOverflow: 'ellipsis',
          }}
            variant='h5'
          >
            {blog.blog_owner_username}aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
          </Typography>
          <Button
            onMouseOver={() => setIsClick(true)}
            onMouseOut={() => setIsClick(false)}
            onClick={handleDeleteOpen}
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
            <Typography color='rgba(0, 0, 0, 0.87)' variant='h6'> Subscribed</Typography>
          </Button>
          <Typography color='black'>
            {timeDisplay}
          </Typography>
        </CardContent>

      </CardActionArea>
      <Modal
        open={deleteSubscribedOpen}
        onClose={handleDeleteClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleDelete}>
          {deleteModalMessage}
        </Box>
      </Modal>

    </Card >
  )
}