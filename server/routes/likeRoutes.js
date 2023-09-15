const router = require('express').Router()
const { getAllLikes, getLikesForUser, addedLike, editLIke, deleteLike } = require('../controllers/likeController')

router.route('/')
  .get(getAllLikes)
  .post(addedLike)
  .patch(editLIke)
  .delete(deleteLike)


router.route('/user')
  .get(getLikesForUser)


module.exports = router

