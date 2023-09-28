const { getBookmarkForUser, addBookmark, deleteBookmark } = require('../controllers/bookmarkController')

const router = require('express').Router()


router.route('/')
  .get(getBookmarkForUser)
  .post(addBookmark)
  .delete(deleteBookmark)

module.exports = router