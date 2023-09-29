const { getBlogsForBookmarkList, addBookmark, deleteBookmark } = require('../controllers/bookmarkController')

const router = require('express').Router()


router.route('/')
  .get(getBlogsForBookmarkList)
  .post(addBookmark)
  .delete(deleteBookmark)

module.exports = router