const router = require('express').Router()
const { getAllBlogs, updateBlog, createBlog, deleteBlog, getSingleBlog } = require('../controllers/blogsController')

router.route('/')
  .get(getAllBlogs)
  .post(createBlog)
  .patch(updateBlog)
  .delete(deleteBlog)
router.route('/:id')
  .get(getSingleBlog)


module.exports = router