const User = require('../models/User')
const Blog = require('../models/Blog')
const Like = require('../models/Like')

// @desc Get all likes
// route Get /lies
// @access Private
const getAllLikes = async (req, res) => {
  const likes = await Like.find().lean()

  if (!likes.length) return res.status(400).json({ message: 'No likes found' })

  res.status(200).json(likes)
}

// // @desc Get likes for specific blog
// // route Get /lies
// // @access Private
// const getLikesFromBlog = async (req, res) => {
//   const { blog_id } = req.body

//   const numbersOfLike = await Like.findOne({ blog_id }).lean().exec()

//   if (!numbersOfLike) return res.status(400).json({ message: 'No likes found for current Blog' })

//   res.status(200).json(numbersOfLike)
// }


const getLikesFromBlog = async (req, res) => {

  const { username } = req.body
  console.log(username)

  const currentUserLikes = await Like.aggregate([
    { $match: { liked_by_user_username: username } }
  ])

  console.log(currentUserLikes)

  // const numbersOfLike = await Like.findOne({ blog_id }).lean().exec()

  // if (!numbersOfLike) return res.status(400).json({ message: 'No likes found for current Blog' })

  // res.status(200).json(numbersOfLike)
}

// @desc created a like to specific blog
// route post /lies
// @access Private
const addedLike = async (req, res) => {
  const { blog_id, user_id, username, is_like } = req.body

  console.log(req.body)

  if (!blog_id || !user_id || !username, !is_like) return res.status(200).json({ message: 'All fields are required' })

  const blog = await Blog.findById(blog_id).lean().exec()

  console.log(blog)

  if (!blog) return res.status(400).json({ message: 'net work error, please try again' })


  const info = {
    blog_id,
    blog_owner: blog.user_id,
    liked_by_user_id: user_id,
    liked_by_user_username: username,
    is_like,
  }

  await Like.create(info)

  res.status(200).json({ message: `${username} has liked to this Blog` })
}





module.exports = { getAllLikes, getLikesFromBlog, addedLike }