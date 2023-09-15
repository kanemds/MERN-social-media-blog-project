const router = require('express').Router()
const { getAllLikes, getLikesForUser, addedLike, editLIke, deleteLike, findLikedBlogs } = require('../controllers/likeController')

router.route('/')
  .get(getAllLikes)
  .post(addedLike)
  .patch(editLIke)
  .delete(deleteLike)


router.route('/user')
  .get(getLikesForUser)


router.route('/user/blogs')
  .get(findLikedBlogs)


module.exports = router

