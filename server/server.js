const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3456

app.use('/', express.static(path.join(__dirname, '.', '/', 'public')))
// or
// app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})
