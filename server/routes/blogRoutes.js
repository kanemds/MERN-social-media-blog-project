const router = require('express').Router()
const { getAllBlogs, updateBlog, createBlog, deleteBlog, getSingleBlog, getPaginatedBlogs } = require('../controllers/blogsController')

router.route('/')
  .get(getAllBlogs)
  .post(createBlog)
  .patch(updateBlog)
  .delete(deleteBlog)

router.route('/limited')
  .get(getPaginatedBlogs)

router.route('/:id')
  .get(getSingleBlog)


module.exports = router