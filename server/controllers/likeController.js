const User = require('../models/User')
const Blog = require('../models/Blog')
const Like = require('../models/Like')
const timeDisplayOptions = require('../config/timeDisplayOptions')

// @desc Get all likes
// route Get /likes
// @access Private
const getAllLikes = async (req, res) => {
  const likes = await Like.find().lean()

  if (!likes.length) return res.status(200).json({ message: 'No likes found' })

  res.status(200).json(likes)
}


// @desc Get user likes
// route Get /likes
// @access Private
const getLikesForUser = async (req, res) => {

  const { username } = req.query

  const isUserExist = await User.find({ username }).exec()

  if (!isUserExist) return res.status(404).json({ message: 'The username is not exist' })

  const likes = await Like.find({ liked_by_user_username: isUserExist.username }).lean().exec()

  if (!likes.length || !likes) return res.status(200).json([])

  res.status(200).json(currentUserLikes)
}

// @desc Get like for single blog page
// route Get /likes
// @access Private
const getSingleLike = async (req, res) => {

  const { id, username } = req.query

  const isUserExist = await User.findOne({ username }).exec()


  if (!isUserExist) return res.status(404).json({ message: 'The username is not exist' })

  const like = await Like.findOne({ liked_by_user_username: isUserExist.username, blog_id: id }).lean().exec()

  if (!like) return res.status(200).json([])

  res.status(200).json(like)
}


// @desc Get blogs for likedList
// route Get /likes/user
// @access Private
const getBlogsForLikedList = async (req, res) => {

  const { username } = req.query
  const isUserExist = await User.findOne({ username }).exec()
  if (!isUserExist) return res.status(404).json({ message: 'The username is not exist' })

  // find all likes 
  const likes = await Like.find({ liked_by_user_username: username }).lean().exec()

  if (!likes.length || !likes) return res.status(200).json([])
  // filter and get blog_id
  const listOfBlogId = await likes.map(like => {
    return like.blog_id
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


  const blogsWithLikes = await listOfBlogs.map(blog => {
    const findMatch = likes.find(like => like.blog_id.toString() === blog._id.toString())
    console.log(findMatch)
    const timeConvert = new Date(Date.parse(findMatch?.createdAt?.toString())).toLocaleString(undefined, timeDisplayOptions.optionTwo)
    return { ...blog, isLike: findMatch.is_like, likeId: findMatch._id.toString(), likedAt: timeConvert, addedBy: findMatch.createdAt }
  })

  const decOrderBlogs = await blogsWithLikes?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  res.status(200).json(decOrderBlogs)
}

// @desc created a like to specific blog
// route post /lies
// @access Private
const addedLike = async (req, res) => {
  const { blog_id, user_id, username, is_like } = req.body

  if (!blog_id || !user_id || !username, !is_like) return res.status(200).json({ message: 'All fields are required' })

  const blog = await Blog.findById(blog_id).lean().exec()

  if (!blog) return res.status(404).json({ message: 'net work error, please try again' })

  const isDuplicate = await Like.find({ blog_id, liked_by_user_id: user_id }).exec()

  if (isDuplicate.length) return res.status(409).json({ message: 'The selected blog has already liked' })

  const info = {
    blog_id,
    blog_owner: blog.user_id,
    liked_by_user_id: user_id,
    liked_by_user_username: username,
    is_like,
  }

  await Like.create(info)
  console.log('like added')
  res.status(200).json({ message: `${username} has liked to this Blog` })
}

const editLIke = async (req, res) => {
  const { blog_id, is_like } = req.body

  // Like.findOne({ blog_id }).lean().exec() turn plain js object not mongodb document, can not save
  const likedBlog = await Like.findOne({ blog_id }).exec()

  if (!likedBlog) return res.status(400).json({ message: 'net work error, please try again' })


  likedBlog.is_like = is_like

  await likedBlog.save()

  res.status(200).json({ message: 'updated' })
}

const deleteLike = async (req, res) => {
  const { id } = req.body

  const selectedLikedBlog = await Like.findById(id).exec()

  if (!selectedLikedBlog) return res.status(400).json({ message: 'net work error, please try again' })

  console.log(selectedLikedBlog)

  await selectedLikedBlog.deleteOne()
  console.log('like removed')


  // res.status(200).json(deleteData)
  res.status(200).json('like removed')
}


module.exports = { getAllLikes, getLikesForUser, getSingleLike, addedLike, editLIke, deleteLike, getBlogsForLikedList }