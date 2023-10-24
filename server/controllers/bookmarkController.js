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

  const bookmarkData = await Bookmark.aggregate([
    {
      $match: {
        bookmark_by_user_id: isUserExist._id
      }
    },
    {
      $lookup: {
        from: 'blogs',
        localField: 'blog_id',
        foreignField: '_id',
        as: 'blog'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'blog_owner_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$blog'
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        _id: 1,
        blog_id: 1,
        blog_owner_id: 1,
        bookmark_by_user_id: 1,
        is_bookmark: 1,
        images: '$blog.images',
        blog_username: '$user.username',
        blog_owner_avatar: '$user.avatar',
        text: '$blog.text',
        title: '$blog.title',
        createdAt: 1,
        updatedAt: 1,
        __v: 1
      },
    },
  ]).sort({ createdAt: -1 })

  const collectionBookmarkData = bookmarkData.map(blog => {
    const timeConvert = new Date(Date.parse(blog?.createdAt?.toString())).toLocaleString(undefined, timeDisplayOptions.optionTwo)
    return { ...blog, bookmarkedAt: timeConvert, addedBy: blog.createdAt }
  })

  console.log(collectionBookmarkData)

  res.status(200).json(collectionBookmarkData)
}

// @desc create a bookmark
// route Post /bookmarks
// @access Private
const addBookmark = async (req, res) => {
  const { blog_id, bookmark_by_user_id, is_bookmark } = req.body

  const blog = await Blog.findById(blog_id).lean().exec()

  if (!blog || blog.length === 0) return res.status(404).json({ message: 'The blog is not exist' })

  const isDuplicate = await Bookmark.findOne({ blog_id: blog_id, blog_owner_id: blog.user, bookmark_by_user_id }).exec()

  if (isDuplicate) return res.status(409).json({ message: 'The selected blogger has already subscribed' })

  const info = {
    blog_id,
    blog_owner_id: blog.user,
    bookmark_by_user_id,
    is_bookmark
  }

  await Bookmark.create(info)
  console.log('bookmarked')

  res.status(200).json({ message: `The selected blog has been added to the 'bookmarks' list` })
}

const deleteBookmark = async (req, res) => {
  const { id } = req.body

  const selectedBookmarkBlog = await Bookmark.findById(id).exec()

  if (!selectedBookmarkBlog) return res.status(404).json({ message: 'net work error, please try again' })

  await selectedBookmarkBlog.deleteOne()
  console.log('bookmark removed')


  res.status(200).json({ message: 'The bookmark has been successfully removed from this blog.' })

}
module.exports = { getBlogsForBookmarkList, addBookmark, deleteBookmark }