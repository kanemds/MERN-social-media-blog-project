const router = require('express').Router()
const { getAllBlogs, updateBlog, createBlog, deleteBlog, getSingleBlog, getSelectedBlogger, getPaginatedBlogs, getBlogsForUser } = require('../controllers/blogsController')

router.route('/')
  .get(getAllBlogs)
  .post(createBlog)
  .patch(updateBlog)
  .delete(deleteBlog)

router.route('/paginatedBlogs')
  .get(getPaginatedBlogs)

router.route('/user')
  .get(getBlogsForUser)

router.route('/blogger/:id')
  .get(getSelectedBlogger)

router.route('/:id')
  .get(getSingleBlog)


module.exports = router