const User = require('../models/User')
const Blog = require('../models/Blog')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean()

  if (!users?.length) {
    return res.status(400).json({ message: 'No users found' })
  }
  res.status(200).json(users)
})

// @desc Create new user
// route Post /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, email, password, roles } = req.body

  if (!username || !email || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const lowerCase = email.toLowerCase()

  // check exist username and email
  const userExist = await User.findOne({ username }).lean().exec()
  const emailExist = await User.findOne({ email: lowerCase }).lean().exec()

  if (userExist) {
    return res.status(409).json({ message: 'Username is taken' })
  }

  if (emailExist) {
    return res.status(409).json({ message: 'Email is taken' })
  }

  // bcrypt
  const hashedPassword = await bcrypt.hash(password, 10)

  const userInfo = {
    username,
    email: lowerCase,
    'password': hashedPassword,
    roles
  }

  const newUser = await User.create(userInfo)

  if (newUser) {
    res.status(201).json({ message: `New user ${username} created` })
  } else {
    res.status(400).json({ message: 'Invalid user data received' })
  }



})

// @desc Update a user
// route Patch /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, email, roles, active, password } = req.body

  if (!id || !username || !email || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const lowerCase = email.toLowerCase()

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  // check if username or email exist in mongoDB
  const userExist = await User.findOne({ username }).lean().exec()
  const emailExist = await User.findOne({ email: lowerCase }).lean().exec()

  if (userExist && userExist?._id.toString() !== id) {
    return res.status(409).json({ message: 'Username is taken' })
  }

  if (emailExist && emailExist?._id.toString() !== id) {
    return res.status(409).json({ message: 'Email is taken' })
  }

  user.username = username
  user.email = lowerCase
  user.roles = roles
  user.active = active

  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }

  const updatedUser = await user.save()

  res.json({ message: `${updatedUser.username} updated` })
})

// @desc Delete a user
// route Delete /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'User ID Required' })
  }

  const blog = await Blog.findOne({ user: id }).lean().exec()
  if (blog) {
    return res.status(400).json({ message: 'User has assigned blogs' })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const result = await user.deleteOne()

  const reply = `Username ${result.username} with ID ${result._id} is deleted`

  res.json(reply)

})

module.exports = { getAllUsers, updateUser, createNewUser, deleteUser }