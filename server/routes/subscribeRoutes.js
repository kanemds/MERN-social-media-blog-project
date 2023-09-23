const router = require('express').Router()
const { findSubscribedBlogs, deleteSubscribe, addSubscribe } = require('../controllers/subscribeController')


router.route('/')
  .get(findSubscribedBlogs)
  .post(addSubscribe)
  .delete(deleteSubscribe)

module.exports = router