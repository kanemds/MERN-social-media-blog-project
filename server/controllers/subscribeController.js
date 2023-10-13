const User = require('../models/User')
const Blog = require('../models/Blog')
const Subscribe = require('../models/Subscribe')
const timeDisplayOptions = require('../config/timeDisplayOptions')



// @desc Get subscribe for current user 
// route Get /subscribe
// @access Private
const getBlogsForSubscribedList = async (req, res) => {
  const { username } = req.query

  console.log(username)

  const isUserExist = await User.findOne({ username }).exec()

  console.log(isUserExist)

  if (!isUserExist) return res.status(404).json({ message: 'The username is not exist' })

  const currentUserSubscribed = await Subscribe.find({ subscribed_by_user_id: isUserExist._id }).lean().exec()

  console.log(currentUserSubscribed)


  if (!currentUserSubscribed || !currentUserSubscribed.length) return res.status(200).json([])

  const addedDate = currentUserSubscribed.map(blog => {
    const timeConvert = new Date(Date.parse(blog.createdAt?.toString())).toLocaleString(undefined, timeDisplayOptions.optionTwo)
    return { ...blog, subscribedAt: timeConvert }
  })

  const decOrderSub = await addedDate?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  res.status(200).json(decOrderSub)
}

const addSubscribe = async (req, res) => {
  const { id, userId, isSubscribed } = req.body

  const user = await User.findById(id).lean().exec()

  if (!user) return res.status(404).json({ message: 'Sorry, the User is not exist, please try again' })

  const isDuplicate = await Subscribe.findOne({ blog_owner_id: id, subscribed_by_user_id: userId }).exec()

  if (isDuplicate) return res.status(409).json({ message: 'The selected blogger has already subscribed' })

  const info = {
    blog_owner_id: user._id,
    subscribed_by_user_id: userId,
    is_subscribed: isSubscribed,
  }

  await Subscribe.create(info)
  res.status(200).json({ message: `The selected blog has been added to the 'subscribed' list` })
}

const deleteSubscribe = async (req, res) => {
  const { id } = req.body

  const subscribedBlog = await Subscribe.findById(id).exec()

  if (!subscribedBlog) return res.status(404).json({ message: 'net work error, please try again' })

  await subscribedBlog.deleteOne()
  console.log('subscribe removed')
  res.status(200).json({ message: 'The subscribed has been successfully removed from this blog.' })
}



module.exports = { getBlogsForSubscribedList, addSubscribe, deleteSubscribe }