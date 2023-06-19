const User = require('../models/User')
const Note = require('../models/Note')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = Users.find().select('-password').lean()
  if (!users) {
    return res.status(400).json({ message: 'No Users Found' })
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
  const userExist = User.findOne({ username }).lean().exec()
  const emailExist = User.findOne({ email: lowerCase }).lean().exec()

  if (userExist) {
    return res.status(409).json({ message: 'Duplicate username' })
  }

  if (emailExist) {
    return res.status(409).json({ message: 'Duplicate email' })
  }

  // bcrypt
  const hashedPassword = bcrypt.hash(password, 10)

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

  if (!id || !username || !email || Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User Not Found' })
  }
})

// @desc Delete a user
// route Delete /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {

})

module.exports = { getAllUsers, updateUser, createNewUser, deleteUser }