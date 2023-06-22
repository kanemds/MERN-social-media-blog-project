const router = require('express').Router()
const { getAllBlogs, updateBlog, createBlog, deleteBlog } = require('../controllers/blogsController')

router.route('/')
  .get(getAllBlogs)
  .post(createBlog)
  .patch(updateBlog)
  .delete(deleteBlog)

module.exports = router