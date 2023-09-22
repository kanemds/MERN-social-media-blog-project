const User = require('../models/User')
const Blog = require('../models/Blog')
const Like = require('../models/Like')

// @desc Get all likes
// route Get /likes
// @access Private
const getAllLikes = async (req, res) => {
  const likes = await Like.find().lean()

  if (!likes.length) return res.status(200).json({ message: 'No likes found' })

  res.status(200).json(likes)
}

// // @desc Get likes for specific blog
// // route Get /likes
// // @access Private
// const getLikesFromBlog = async (req, res) => {
//   const { blog_id } = req.body

//   const numbersOfLike = await Like.findOne({ blog_id }).lean().exec()

//   if (!numbersOfLike) return res.status(400).json({ message: 'No likes found for current Blog' })

//   res.status(200).json(numbersOfLike)
// }

// @desc Get user likes
// route Get /likes/user
// @access Private
const getLikesForUser = async (req, res) => {

  const { username } = req.query

  const isUserExist = await User.find({ username }).exec()

  if (!isUserExist) return res.status(404).json({ message: 'The username is not exist' })

  const currentUserLikes = await Like.aggregate([
    { $match: { liked_by_user_username: username } }
  ])

  if (!currentUserLikes.length || !currentUserLikes) return res.status(200).json([])

  res.status(200).json(currentUserLikes)
}

const findLikedBlogs = async (req, res) => {

  const { username } = req.query

  // find all likes 
  const currentUserLikes = await Like.aggregate([
    { $match: { liked_by_user_username: username } }
  ])

  console.log(currentUserLikes)
  // filter and get blog_id
  const listOfBlogId = await currentUserLikes.map(like => {
    return like.blog_id
  })
  console.log(listOfBlogId)

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
    const findMatch = currentUserLikes.find(like => like.blog_id.toString() === blog._id.toString())
    console.log(findMatch)
    return { ...blog, isLike: findMatch.is_like }
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

  if (!blog) return res.status(400).json({ message: 'net work error, please try again' })

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

  const likedBlog = await Like.findOne({ blog_id: id }).exec()

  if (!likedBlog) return res.status(400).json({ message: 'net work error, please try again' })

  await likedBlog.deleteOne()
  console.log('like remove')
  res.status(200).json({ message: 'The like has been successfully removed from this blog.' })
}


module.exports = { getAllLikes, getLikesForUser, addedLike, editLIke, deleteLike, findLikedBlogs }