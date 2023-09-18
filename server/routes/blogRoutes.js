const router = require('express').Router()
const { getAllBlogs, updateBlog, createBlog, deleteBlog, getSingleBlog, getPaginatedBlogs, getBlogsForUser } = require('../controllers/blogsController')

router.route('/')
  .get(getAllBlogs)
  .post(createBlog)
  .patch(updateBlog)
  .delete(deleteBlog)

router.route('/paginatedBlogs')
  .get(getPaginatedBlogs)

router.route('/user')
  .get(getBlogsForUser)

router.route('/:id')
  .get(getSingleBlog)


module.exports = router