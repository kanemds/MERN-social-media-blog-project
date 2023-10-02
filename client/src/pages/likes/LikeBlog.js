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
import { useDispatch } from 'react-redux'
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


export default function LikeBlog({ blog, setRefresh, deleteLike, removeMessage, isDeleteLikeLoading }) {

  console.log(blog)

  const dispatch = useDispatch()

  const navigate = useNavigate()
  const { username, userId } = useAuth()
  const { pathname } = useLocation()
  const [title, setTitle] = useState(blog?.title)
  const [text, setText] = useState(blog?.text)
  const [images, setImage] = useState(blog?.images[0]?.url)
  const [isClick, setIsClick] = useState(false)
  const [isLiked, setIsLiked] = useState(blog.isLike || null)
  const [deleteLikeOpen, setDeleteLikeOpen] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDeleteLikeReady, setIsDeleteLikeReady] = useState(false)
  const [timeDisplay, setTimeDisplay] = useState(useTimeDisplay(blog.createdAt) || null)


  const current = Date.parse(new Date())
  const postedDay = Date.parse(blog.createdAt)
  const sevenDays = 60 * 60 * 24 * 1000 * 7

  const timeInMillisecond = current - postedDay

  useEffect(() => {
    if (isDeleteLikeReady && removeMessage) {
      setDeleteMessage(removeMessage?.message)
      setTimeout(() => {
        setDeleteLikeOpen(false)
        setRefresh(true)
        setIsDeleteLikeReady(false)
        setLoading(false)
        console.log('remove Like')
      }, 1400)
    }

  }, [isDeleteLikeReady])

  useEffect(() => {
    if (isDeleteLikeLoading) {
      setLoading(true)
      setTimeout(() => {
        console.log('loading')
        setIsDeleteLikeReady(true)
      }, 1400)
    }
  }, [isDeleteLikeLoading])


  const handleToSelectedBlog = () => {
    if (!isClick) {
      navigate(`/blogs/post/${blog.id}`)
    }
  }

  const handleDeleteLikeClose = () => {
    setDeleteLikeOpen(false)
  }

  const handleDeleteLikeConfirm = async (e) => {
    e.preventDefault()
    await deleteLike({ id: blog.id, likeId: blog.likeId })
  }

  const handleUserPage = () => {
    if (isClick) {
      navigate(`/blogs/user/${blog.id}`)
    }
  }

  const handleLiked = (e) => {
    setDeleteLikeOpen(true)
  }


  ////////////////////////////////////////////////// delete like ////////////////////////////////////////////////////
  let deleteLikeModalMessage

  if (loading) {
    deleteLikeModalMessage = <LoadingSpinner />
  }

  if (isDeleteLikeReady) {
    deleteLikeModalMessage = (
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {deleteMessage}
      </Typography>
    )
  }

  if (!loading) {
    deleteLikeModalMessage = (
      <>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Remove like from this blog?
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
          <Button variant='contained' onClick={handleDeleteLikeClose}>Cancel</Button>
          <Button variant='contained' onClick={handleDeleteLikeConfirm} sx={{
            backgroundColor: red[600],
            color: 'white',
            '&:hover': {
              backgroundColor: red[800]
            }
          }}>Remove Like</Button>
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

                    <FavoriteIcon sx={{ fontSize: '30px', color: red[400] }} />
                    :
                    <FavoriteBorderIcon sx={{ fontSize: '30px', color: '#bdbdbd' }} />
                  }
                </IconButton>

              </Box>
            </Box>

            {/* show day and menu  */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '60%' }}>

              <Typography color='black'>
                {/* {
                  timeInMillisecond <= sevenDays ?
                    moment(Date.parse(blog.createdAt)).fromNow()
                    :
                    new Date(Date.parse(blog.createdAt)).toLocaleString(undefined, timeDisplayOptions.optionTwo)
                } */}
                {timeDisplay}
              </Typography>


            </Box>

          </Box>
        </CardContent>

      </CardActionArea>
      <Modal
        open={deleteLikeOpen}
        onClose={handleDeleteLikeClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleDelete}>
          {deleteLikeModalMessage}
        </Box>
      </Modal>

    </Card >
  )
}