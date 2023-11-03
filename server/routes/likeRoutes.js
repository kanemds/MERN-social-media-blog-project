const router = require('express').Router()
const { getAllLikes, getLikesForUser, getSingleLike, addedLike, editLIke, deleteLike, getBlogsForLikedList, getSelectedDateLikes } = require('../controllers/likeController')

router.route('/')
  .get(getAllLikes)
  .post(addedLike)
  .patch(editLIke)
  .delete(deleteLike)

router.route('/single')
  .get(getSingleLike)

router.route('/selected-date')
  .get(getSelectedDateLikes)

router.route('/user')
  .get(getLikesForUser)


router.route('/user/blogs')
  .get(getBlogsForLikedList)

module.exports = router

