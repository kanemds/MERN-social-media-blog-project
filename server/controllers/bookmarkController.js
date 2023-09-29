const Bookmark = require('../models/Bookmark')
const User = require('../models/User')
const Blog = require('../models/Blog')

// @desc Get bookmarks for login user
// route Get /bookmarks
// @access Private
const getBookmarkForUser = async (req, res) => {
  const { username } = req.query
  const isUserExist = await User.findOne({ username }).exec()
  if (!isUserExist) return res.status(404).json({ message: 'The username is not exist' })

  const bookmarks = await Bookmark.find({ bookmark_by_user_id: isUserExist._id })

  // filter and get blog_id
  const listOfBlogId = await bookmarks.map(bookmark => {
    return bookmark.blog_id
  })

  // find the match blog.id from Blog collection
  const listOfBlogs = await Blog.aggregate([
    {
      $match: {
        _id: {
          $in: listOfBlogId // Match documents where blog_id is in listOfBlogIds
        }
      }
    }
  ])

  const blogsWithBookmarks = await listOfBlogs.map(blog => {
    const findMatch = bookmarks.find(bookmark => bookmark.blog_id.toString() === blog._id.toString())
    return { ...blog, isBookmark: findMatch.is_bookmark }
  })

  const decOrderBlogs = await blogsWithBookmarks?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.status(200).json(decOrderBlogs)
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