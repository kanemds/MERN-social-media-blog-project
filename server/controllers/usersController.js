const User = require('../models/User')
const Blog = require('../models/Blog')
const bcrypt = require('bcrypt')
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage')
const storage = require('../config/firebaseConfig')

const processSingleImage = async image => {
  let singleImage
  const singleFile = new Date().getTime() + image.name
  const imageRef = ref(storage, `users/${singleFile}`)
  const uploadImage = await uploadBytes(imageRef, image.data,)
  const url = await getDownloadURL(uploadImage.ref)
  singleImage = url
  return singleImage
}

// note firebase does not need path to delete url
const deleteImageFromFirebase = async (imageUrl) => {

  // Create an array of promises for deleting images
  try {
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)

    console.log('The avatar image has been deleted from Firebase Storage')
  } catch (error) {
    console.error('Error deleting images:', error)
  }
}

// @desc Get all users
// route Get /users
// @access Private
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').lean()

  if (!users?.length) {
    return res.status(400).json({ message: 'No users found' })
  }
  res.status(200).json(users)
}

// @desc Create new user
// route Post /users
// @access Private
const createNewUser = async (req, res) => {
  const { username, email, password, role } = req.body

  let processedImages = null
  if (req.files) {
    const { avatar } = await req.files
    console.log(avatar)
    processedImages = await processSingleImage(avatar)
  }


  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // check exist username and email
  const userExist = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()
  const emailExist = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if (userExist) {
    return res.status(409).json({ message: 'The username is already in used. Please choose another one' })
  }

  if (emailExist) {
    return res.status(409).json({ message: 'The email has already been registered. Please choose another one' })
  }

  // bcrypt
  const hashedPassword = await bcrypt.hash(password, 10)

  const userInfo = !role.length ? {
    username,
    email,
    'password': hashedPassword,
    avatar: processedImages
  }
    :
    {
      username,
      email,
      'password': hashedPassword,
      role,
      avatar: processedImages
    }

  const newUser = await User.create(userInfo)

  if (newUser) {
    res.status(201).json({ message: `New user ${username} created` })
  } else {
    res.status(400).json({ message: 'Invalid user data received' })
  }
}

// @desc Update a user
// route Patch /users
// @access Private
const updateUser = async (req, res) => {
  const { id, username, email, role, active, password, isAvatarDelete } = req.body

  let processedImages = null
  if (req.files) {
    const { avatar } = await req.files
    console.log(avatar)
    processedImages = await processSingleImage(avatar)
  }


  // if (!id || !username || !email || !role.length || typeof active !== 'boolean') {
  //   return res.status(400).json({ message: 'All fields are required' })
  // }

  console.log(isAvatarDelete)


  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  // check if username or email exist in mongoDB
  const userExist = await User.findOne({ username }).lean().exec()
  const emailExist = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if (userExist && userExist?._id.toString() !== id) {
    return res.status(409).json({ message: 'Username is taken' })
  }

  if (emailExist && emailExist?._id.toString() !== id) {
    return res.status(409).json({ message: 'Email is taken' })
  }

  if (isAvatarDelete === true) {
    await deleteImageFromFirebase(user.avatar)
  }


  user.username = username
  user.email = email
  user.role = role
  user.active = active

  if (processedImages !== null) {
    user.avatar = processedImages
  } else if (isAvatarDelete) {
    user.avatar = null
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }


  const updatedUser = await user.save()

  const blogs = await Blog.find({ user_id: updatedUser._id }).lean().exec()

  if (blogs) {
    const updateOperations = blogs.map(blog => ({
      updateOne: {
        filter: { _id: blog._id }, // Assuming _id is the identifier field for each blog
        update: { $set: { username: updatedUser.username } }
      }
    }))
    await Blog.bulkWrite(updateOperations)
  }


  res.json({ message: `${updatedUser.username} updated` })
}

// @desc Delete a user
// route Delete /users
// @access Private
const deleteUser = async (req, res) => {
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

}

module.exports = { getAllUsers, updateUser, createNewUser, deleteUser }