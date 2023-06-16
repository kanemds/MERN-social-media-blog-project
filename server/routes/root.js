const express = require('express')
const router = express.Router()
const path = require('path')

//  route path match: / or index or index.html then send the file to client
router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router