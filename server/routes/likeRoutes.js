const router = require('express').Router()
const { getAllLikes, getLikesForUser, addedLike, editLIke, deleteLike, getBlogsForLikedList } = require('../controllers/likeController')

router.route('/')
  .get(getAllLikes)
  .post(addedLike)
  .patch(editLIke)
  .delete(deleteLike)


router.route('/user')
  .get(getLikesForUser)


router.route('/user/blogs')
  .get(getBlogsForLikedList)

module.exports = router

