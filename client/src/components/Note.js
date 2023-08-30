import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea, Avatar, Box, Button, Popover, IconButton } from '@mui/material'
import noteBook from '../images/noteBook.jpg'
import moment from 'moment'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import { useNavigate } from 'react-router-dom'
import { timeDisplayOptions } from '../config/timeDisplayOptions'

export default function Note({ blog, username = null }) {

  console.log(blog)
  console.log(blog?.images[0].url)

  const navigate = useNavigate()

  const [title, setTitle] = useState(blog?.title)
  const [text, setText] = useState(blog?.text)
  const [images, setImage] = useState(blog?.images[0]?.url)
  const [anchorEl, setAnchorEl] = useState(null)
  const [isClick, setIsClick] = useState(false)


  const current = Date.parse(new Date())
  const postedDay = Date.parse(blog.createdAt)
  const sevenDays = 60 * 60 * 24 * 1000 * 7

  const timeInMillisecond = current - postedDay

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

  const handleView = () => {
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

  const handleUserPage = () => {
    if (isClick) {
      navigate(`/blogs/user/${blog.id}`)
    }

  }

  return (

    <Card
      sx={{
        maxWidth: 272, height: 360,
        boxShadow: 'box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px ',
        "&:hover": {
          boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
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
        onClick={handleView}
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
                WebkitLineClamp: 1,
                textOverflow: 'ellipsis',
              }}>
                {text}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: 28 }}>
            <Box color='black'>
              {
                timeInMillisecond <= sevenDays ?
                  moment(Date.parse(blog.createdAt)).fromNow()
                  :
                  new Date(Date.parse(blog.createdAt)).toLocaleString(undefined, timeDisplayOptions.optionTwo)
              }
            </Box>
            <IconButton
              onMouseOver={() => setIsClick(true)}
              onMouseOut={() => setIsClick(false)}
              aria-describedby={id}
              variant="contained"
              onClick={handleClick}
              sx={{ p: 0, '&:hover': { backgroundColor: 'white', color: '#1976d2' } }}

            >
              <MoreVertOutlinedIcon />

            </IconButton>
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
              <Button><DeleteForeverOutlinedIcon /></Button>
              <Button onClick={handleEdit}><EditNoteOutlinedIcon /></Button>
              <Button onClick={handleLook}><RemoveRedEyeOutlinedIcon /></Button>
            </Popover>
          </Box>
        </CardContent>

      </CardActionArea>

    </Card >
  )
}