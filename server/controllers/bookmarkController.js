const Bookmark = require('../models/Bookmark')
const User = require('../models/User')
const Blog = require('../models/Blog')

// @desc Get bookmarks for login user
// route Get /bookmarks
// @access Private
const getBookmarkForUser = async (req, res) => {
  const { username } = req.query
  const isUserExist = await User.find({ username }).exec()
  if (!isUserExist) return res.status(404).json({ message: 'The username is not exist' })

  const bookmarksForUser = await Bookmark.find({ liked_by_user_id: isUserExist._id })
  console.log(bookmarksForUser)

  res.status(200).json(bookmarksForUser)
}

// @desc create a bookmark
// route Post /bookmarks
// @access Private
const addBookmark = async (req, res) => {
  const { blog_id, bookmark_by_user_id, username, is_bookmark } = req.body


  const blog = await Blog.findById(blog_id).lean().exec()


  if (!blog || blog.length === 0) return res.status(404).json({ message: 'The blog is not exist' })

  const info = {
    blog_id,
    blog_owner: blog.user_id,
    bookmark_by_user_id,
    bookmark_by_user_username: username,
    is_bookmark
  }

  await Bookmark.create(info)
  console.log('bookmarked')

  res.status(200).json({ message: `${username} marked to this blog` })
}

const deleteBookmark = async (req, res) => {
  const { id, username } = req.body

  const blog = await Blog.findById(id).exec()


  if (!blog) return res.status(404).json({ message: 'net work error, please try again' })

  const findBookmark = await Bookmark.findOne({ blog_id: blog._id })

  if (!findBookmark) return res.status(404).json({ message: 'net work error, please try again' })

  console.log('findBookmark', findBookmark)

  await findBookmark.deleteOne()
  console.log('bookmark removed')

  const deleteData = {
    message: 'The bookmark has been successfully removed from this blog.',
    blogId: blog._id,
    bookmarkId: findBookmark._id
  }
  res.status(200).json(deleteData)

}
module.exports = { getBookmarkForUser, addBookmark, deleteBookmark }