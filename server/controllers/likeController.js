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

  const likes = await Like.find({ liked_by_user_id: isUserExist._id }).lean().exec()

  if (!likes.length || !likes) return res.status(200).json([])

  res.status(200).json(likes)
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

// @desc Get like for single blog page
// route Get /likes
// @access Private
const getSelectedDateLikes = async (req, res) => {

  const { date } = req.query

  console.log(date)
  if (!date) return res.status(200).json('like')

  // res.status(200).json(like)
}


// @desc Get blogs for likedList
// route Get /likes/user
// @access Private
const getBlogsForLikedList = async (req, res) => {

  const { username } = req.query
  const isUserExist = await User.findOne({ username }).exec()
  if (!isUserExist) return res.status(404).json({ message: 'The username is not exist' })

  // find all likes 
  const likes = await Like.find({ liked_by_user_id: isUserExist._id }).lean().exec()

  if (!likes.length || !likes) return res.status(200).json([])

  const likeData = await Like.aggregate([
    {
      $match: {
        liked_by_user_id: isUserExist._id
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
        localField: 'blog_owner',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: '_id',
        as: 'like'
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
        blog_owner: 1,
        liked_by_user_id: 1,
        is_like: 1,
        images: '$blog.images',
        blog_username: '$user.username',
        blog_owner_avatar: '$user.avatar',
        text: '$blog.text',
        title: '$blog.title',
        count_likes: { $size: '$like' },
        createdAt: 1,
        updatedAt: 1,
        __v: 1
      },
    },
  ]).sort({ createdAt: -1 })

  const collectionLikeData = likeData.map(blog => {
    const timeConvert = new Date(Date.parse(blog?.createdAt?.toString())).toLocaleString(undefined, timeDisplayOptions.optionTwo)
    return { ...blog, likedAt: timeConvert, addedBy: blog.createdAt }
  })

  res.status(200).json(collectionLikeData)
}

// @desc added a like to specific blog
// route post /likes
// @access Private
const addedLike = async (req, res) => {
  const { blog_id, user_id, is_like } = req.body

  if (!blog_id || !user_id || !is_like) return res.status(200).json({ message: 'All fields are required' })
  const blog = await Blog.findById(blog_id).lean().exec()

  if (!blog) return res.status(404).json({ message: 'net work error, please try again' })

  const isDuplicate = await Like.findOne({ blog_id, liked_by_user_id: user_id }).exec()

  if (isDuplicate) return res.status(409).json({ message: 'The selected blog has already liked' })

  const info = {
    blog_id,
    blog_owner: blog.user,
    liked_by_user_id: user_id,
    is_like,
  }

  await Like.create(info)
  console.log('like added')
  res.status(200).json({ message: `The selected blog has been added to the 'liked' list` })
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


  await selectedLikedBlog.deleteOne()
  console.log('like removed')


  // res.status(200).json(deleteData)
  res.status(200).json({ message: 'The like has been successfully removed from this blog.' })
}


module.exports = { getAllLikes, getLikesForUser, getSingleLike, addedLike, editLIke, deleteLike, getBlogsForLikedList, getSelectedDateLikes }