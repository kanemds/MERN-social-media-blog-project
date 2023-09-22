const { findSubscribedBlogs, deleteSubscribe, addSubscribe } = require('../controllers/subscribeController')
const router = require('./root')

router = require('express').Router()

router.route('/')
  .get(findSubscribedBlogs)
  .post(addSubscribe)
  .delete(deleteSubscribe)

module.exports = router