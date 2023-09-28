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
}

// @desc create a bookmark
// route Post /bookmarks
// @access Private
const addBookmark = async (req, res) => {
  const { blog_id, bookmark_by_user_id, username, is_bookmark } = req.body

  const blogOwner = await Blog.findById(blog_id).exec()

  if (!blogOwner || !blogOwner.length) return res.status(404).json({ message: 'The blog is not exist' })

  const info = {
    blog_id,
    blog_owner: blogOwner.username,
    bookmark_by_user_id,
    bookmark_by_user_username: username,
    is_bookmark
  }

  await Bookmark.create(info)
  console.log('bookmarked')

  res.status(200).json({ message: `${username} marked to this blog` })
}

const deleteBookmark = async (req, res) => {
  const { id } = req.body

  const bookmark = await Bookmark.findById(id).exec()

  if (!bookmark) return res.status(404).json({ message: 'net work error, please try again' })

  await bookmark.deleteOne()
  console.log('bookmark removed')
  res.status(200).json({ message: 'The bookmark has been successfully removed from this blog.' })

}
module.exports = { getBookmarkForUser, addBookmark, deleteBookmark }