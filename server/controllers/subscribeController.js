const User = require('../models/User')
const Blog = require('../models/Blog')
const Subscribe = require('../models/Subscribe')



// // @desc Get  subscribe for current user 
// // route Get /subscribe
// // @access Private
// const getSubscribesForUser = async (req, res) => {
//   const { username } = req.query

//   const isUserExist = await User.find({ username }).exec()

//   if (!isUserExist) return res.status(404).json({ message: 'The username is not exist' })

//   const currentUserSubscribed = await Subscribe.aggregate([
//     { $match: { subscribed_by_user_username: username } }
//   ])

//   if (!currentUserSubscribed.length || !currentUserSubscribed) return res.status(200).json([])

//   res.status(200).json(currentUserSubscribed)
// }

// @desc Get subscribe for current user 
// route Get /subscribe
// @access Private
const findSubscribedBlogs = async (req, res) => {
  const { username } = req.query

  const isUserExist = await User.find({ username }).exec()

  if (!isUserExist) return res.status(404).json({ message: 'The username is not exist' })

  const currentUserSubscribed = await Subscribe.aggregate([
    { $match: { subscribed_by_user_username: username } }
  ])

  if (!currentUserSubscribed.length || !currentUserSubscribed) return res.status(200).json([])

  const listOfBlogId = await currentUserSubscribed.map(blog => {
    return blog.blog_id
  })

  const listOfBlogs = await Blog.aggregate([
    {
      $match: {
        _id: {
          $in: listOfBlogId
        }
      }
    }
  ])

  if (!listOfBlogs || !listOfBlogs.length) return res.status(200).json({ message: [] })

  const blogsWithSubscribed = await listOfBlogs.map(blog => {
    const findMatch = currentUserSubscribed.find(subscribe => subscribe.blog_id.toString() === blog._id.toString())
    return { ...blog, isSubscribed: findMatch.is_subscribed }
  })

  const decOrderBlogs = await blogsWithSubscribed?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  res.status(200).json(decOrderBlogs)
}

const addSubscribe = async (req, res) => {
  const { id, userId, username, isSubscribed } = req.body
  console.log(id)
  console.log(userId)
  console.log(username)
  console.log(isSubscribed)
  if (!id || !userId || !username) return res.status(404).json({ message: 'All fields are required' })
  const blog = await Blog.findById(id).lean().exec()
  if (!blog) return res.status(404).json({ message: 'net work error, please try again' })

  console.log(blog)
  const info = {
    blog_id: id,
    blog_owner: blog.user_id,
    subscribed_by_user_id: userId,
    subscribed_by_user_username: username,
    is_subscribed: isSubscribed,
  }

  console.log(info)
  await Subscribe.create(info)
  res.status(200).json({ message: `${username} has subscribed to this Blog` })
}

const deleteSubscribe = async (req, res) => {
  const { id } = req.body

  const subscribedBlog = await Subscribe.findOne({ blog_id: id }).exec()

  if (!subscribedBlog) return res.status(404).json({ message: 'net work error, please try again' })

  await subscribedBlog.deleteOne()
  console.log('subscribe removed')
  res.status(200).json({ message: 'The subscribed has been successfully removed from this blog.' })
}



module.exports = { findSubscribedBlogs, addSubscribe, deleteSubscribe }