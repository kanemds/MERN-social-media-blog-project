const router = require('express').Router()
const { getAllLikes, getLikesFromBlog, addedLike } = require('../controllers/likeController')

router.route('/')
  .get(getAllLikes)
  .post(addedLike)


router.route('/user')
  .get(getLikesFromBlog)

module.exports = router

