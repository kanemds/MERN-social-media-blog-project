import React, { useState } from 'react'
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

export default function Note({ blog, username = null }) {

  const navigate = useNavigate()

  const [title, setTitle] = useState(blog?.title)
  const [text, setText] = useState(blog?.text)
  const [images, setImage] = useState(blog?.images[0] || noteBook)
  const [anchorEl, setAnchorEl] = useState(null)
  const [isClick, setIsClick] = useState(false)

  console.log('isClick', isClick)

  const optionOne = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour24: true }
  const optionTwo = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour24: true }
  const optionThree = { year: 'numeric', month: 'short', day: 'numeric' }
  // const currentDay = new Intl.DateTimeFormat('en-US', optionOne).format(new Date(blog?.createdAt))



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
  const handleEdit = () => {
    navigate(`/blogs/post/edit/${blog.id}`)

  }

  return (

    <Card sx={{ width: 345, height: 380 }} >
      <CardActionArea

        onClick={handleView}
      >
        <CardMedia
          sx={{ height: 200, width: '100%' }}
          component="img"
          image={images}
          alt={title}
        />
        <CardContent sx={{ height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mr: '16px' }}>
              <Avatar />
            </Box>


            <Box>
              <Typography variant="body1" sx={{
                wordBreak: "break-word", display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                fontWeight: 'bold',
                textOverflow: 'ellipsis',
                mb: 2
              }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                wordBreak: "break-word", display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                textOverflow: 'ellipsis',
              }}>
                {text}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Box>
              {
                timeInMillisecond <= sevenDays ?
                  moment(Date.parse(blog.createdAt)).fromNow()
                  :
                  new Date(Date.parse(blog.createdAt)).toLocaleString(undefined, optionThree)
              }
            </Box>
            <IconButton
              onMouseOver={() => setIsClick(true)}
              onMouseOut={() => setIsClick(false)}
              aria-describedby={id}
              variant="contained"
              onClick={handleClick} >
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
              <Button onClick={handleView}><RemoveRedEyeOutlinedIcon /></Button>
            </Popover>
          </Box>
        </CardContent>

      </CardActionArea>

    </Card>
  )
}