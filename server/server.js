require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload') // reading req.files && object from data object
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConnection')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3456

connectDB()

app.use(logger)

app.use(cors(corsOptions))
app.use(fileUpload()) // reading req.files && object from data object
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// // for parsing application/json
// app.use(
//   bodyParser.json({
//     limit: "50mb",
//   })
// )
// // for parsing application/xwww-form-urlencoded
// app.use(
//   bodyParser.urlencoded({
//     limit: "50mb",
//     extended: true,
//   })
// )

// '/public' not needed
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/blogs', require('./routes/blogRoutes'))
app.use('/likes', require('./routes/likeRoutes'))
app.use('/subscribe', require('./routes/subscribeRoutes'))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.use(errorHandler)


mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
  })
})

mongoose.connection.on('error', error => {
  console.log(error)
  logEvents(`${error.no}: ${error.code}\t${req.syscall}\t${req.hostname}`, 'mongoDBerror.log')
})

