import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea, Avatar, Box } from '@mui/material'
import noteBook from '../images/noteBook.jpg'
import moment from 'moment'

export default function Note({ blog }) {
  // const title = "B.C. man's swoon-worthy proposal at van Gogh art exhibit to be cherished after his death"
  // const paragraph = `BURNABY, BC., August 3, 2023 - Scenes from Lougheed Mall as customers shopping at Hudson's Bay over the weekend were met with closing sale signage: "This store is permanently closing.", in Burnaby, B.C. on August 3 , 2023. (NICK PROCAYLO/PNG) 00101885A [PNG Merlin Archive] PHOTO BY NICK PROCAYLO /00101885A`

  const [title, setTitle] = useState(blog?.title)
  const [text, setText] = useState(blog?.text)
  const [images, setImage] = useState(blog?.images[0] || noteBook)

  const optionOne = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour24: true }
  const optionTwo = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour24: true }
  const optionThree = { year: 'numeric', month: 'short', day: 'numeric' }
  // const currentDay = new Intl.DateTimeFormat('en-US', optionOne).format(new Date(blog?.createdAt))



  const current = Date.parse(new Date())
  const postedDay = Date.parse(blog.createdAt)
  const sevenDays = 60 * 60 * 24 * 1000 * 7

  const timeInMillisecond = current - postedDay



  return (

    <Card sx={{ width: 345, height: 380 }}>
      <CardActionArea>
        <CardMedia
          sx={{ height: 200, width: '100%' }}
          component="img"
          image={images}
          alt={title}
        />
        <CardContent sx={{ height: 180 }} >
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
          <Box>
            {
              timeInMillisecond <= sevenDays ?
                moment(Date.parse(blog.createdAt)).fromNow()
                :
                new Date(Date.parse(blog.createdAt)).toLocaleString(undefined, optionThree)
            }</Box>
        </CardContent>

      </CardActionArea>

    </Card>
  )
}