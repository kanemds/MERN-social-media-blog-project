const User = require('../models/User')
const Blog = require('../models/Blog')
const storage = require('../config/firebaseConfig')
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage')


// @desc Get all blogs
// route Get /blogs
// @access Private
const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find().lean()

  if (!blogs?.length) {
    return res.status(404).json({ message: 'No blogs found' })
  }

  // handle multiple promises concurrently and wait for all of them to resolve
  const blogsWithUsers = await Promise.all(blogs.map(async blog => {
    const blogUser = await User.findById(blog.user).lean().exec()
    return { ...blog, user: blogUser.username }
  }))

  res.status(200).json(blogsWithUsers)
}

// @desc Create a blog
// route Post /blogs
// @access Private
const createBlog = async (req, res) => {

  // const { username, title, text, images } = req.body
  const { username, title, text } = req.body


  const images = await req.files.images // same order from how frontend formData append

  if (!title || !text) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const currentUser = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

  const titleExist = await Blog.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if (titleExist) {
    return res.status(400).json({ message: 'Title has been used' })
  }


  const processMultipleImages = async (images) => {
    const multipleImages = []

    for (let i = 0;i < images.length;i++) {
      const name = ref(storage, `blogs/${new Date().getTime() + images[i].name}`)
      const uploadImage = await uploadBytes(name, images[i].data)
      const downloadImage = await getDownloadURL(uploadImage.ref)
      multipleImages.push(downloadImage)
    }
    return multipleImages
  }

  const processSingleImage = async images => {
    let singleImage = []
    const singleFile = new Date().getTime() + images.name
    const imageRef = ref(storage, `blogs/${singleFile}`)
    const uploadImage = await uploadBytes(imageRef, images.data)
    singleImage = await getDownloadURL(uploadImage.ref)
    return singleImage
  }

  let processedImages
  // using typeof array === 'object' true since array is object
  // instead Array.isArray(images) is to check if it's array

  if (!Array.isArray(images)) {
    processedImages = await processSingleImage(images)   // object 
  } else {
    processedImages = await processMultipleImages(images) // array
  }

  // console.log('Processed images:', processedImages)

  const newBlog = await Blog.create({ user: currentUser, images: processedImages, user_id: currentUser._id, title, text })

  // res.status(201).json({ message: 'New blog created' })
  if (newBlog) {
    return res.status(201).json({ message: 'New blog created' })
  } else {
    return res.status(400).json({ message: 'Invalid blog data received' })
  }

}

// @desc Update a blog
// route Patch /blogs
// @access Private
const updateBlog = async (req, res) => {

  const { id, user, title, text, images } = req.body

  if (!id || !user || !title || !text) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const blog = await Blog.findById(id).exec()
  console.log(blog)

  if (!blog) {
    return res.status(400).json({ message: 'Blog not found' })
  }

  const titleExist = await Blog.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if (titleExist && titleExist._id.toString() !== id) {
    return res.status(409).json({ message: 'Title has been used' })
  }

  blog.user = user
  blog.title = title
  blog.text = text
  blog.images = images

  const updatedBlog = await blog.save()

  res.json(`${updatedBlog.title} updated`)
}

// @desc Delete a blog
// route Delete /blogs
// @access Private
const deleteBlog = async (req, res) => {
  const { id } = req.body

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'Blog ID required' })
  }

  // Confirm blog exists to delete 
  const blog = await Blog.findById(id).exec()

  if (!blog) {
    return res.status(400).json({ message: 'Blog not found' })
  }

  const result = await blog.deleteOne()

  const reply = `Blog '${result.title}' with ID ${result._id} deleted`

  res.json(reply)


}

module.exports = { getAllBlogs, createBlog, updateBlog, deleteBlog }