const Bookmark = require('../models/Bookmark')
const User = require('../models/User')
const Blog = require('../models/Blog')
const timeDisplayOptions = require('../config/timeDisplayOptions')

// @desc Get bookmarks for login user
// route Get /bookmarks
// @access Private
const getBlogsForBookmarkList = async (req, res) => {
  const { username } = req.query
  const isUserExist = await User.findOne({ username }).exec()
  if (!isUserExist) return res.status(404).json({ message: 'The username is not exist' })

  const bookmarks = await Bookmark.find({ bookmark_by_user_id: isUserExist._id }).lean().exec()

  if (!bookmarks.length || !bookmarks) return res.status(200).json([])

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
    const timeConvert = new Date(Date.parse(findMatch?.createdAt?.toString())).toLocaleString(undefined, timeDisplayOptions.optionTwo)
    return { ...blog, isBookmark: findMatch.is_bookmark, bookmarkId: findMatch._id.toString(), bookmarkedAt: timeConvert, addedBy: findMatch.createdAt }
  })

  const decOrderBlogs = await blogsWithBookmarks?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.status(200).json(decOrderBlogs)
}

// @desc create a bookmark
// route Post /bookmarks
// @access Private
const addBookmark = async (req, res) => {
  const { blog_id, bookmark_by_user_id, is_bookmark } = req.body

  const blog = await Blog.findById(blog_id).lean().exec()

  if (!blog || blog.length === 0) return res.status(404).json({ message: 'The blog is not exist' })

  const isDuplicate = await Bookmark.find({ blog_owner_id: blog.user, bookmark_by_user_id }).exec()

  if (isDuplicate.length) return res.status(409).json({ message: 'The selected blogger has already subscribed' })

  const info = {
    blog_id,
    blog_owner_id: blog.user,
    bookmark_by_user_id,
    is_bookmark
  }

  await Bookmark.create(info)
  console.log('bookmarked')

  res.status(200).json({ message: `${username} marked to this blog` })
}

const deleteBookmark = async (req, res) => {
  const { id } = req.body

  const selectedBookmarkBlog = await Bookmark.findById(id).exec()

  if (!selectedBookmarkBlog) return res.status(404).json({ message: 'net work error, please try again' })

  console.log('findBookmark', selectedBookmarkBlog)


  await selectedBookmarkBlog.deleteOne()
  console.log('bookmark removed')


  res.status(200).json({ message: 'The bookmark has been successfully removed from this blog.' })

}
module.exports = { getBlogsForBookmarkList, addBookmark, deleteBookmark }