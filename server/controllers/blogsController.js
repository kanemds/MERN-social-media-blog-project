const User = require('../models/User')
const Blog = require('../models/Blog')
const { isEqual, sortBy, find, differenceWith, differenceBy } = require('lodash')
const storage = require('../config/firebaseConfig')

const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage')


const processMultipleImages = async (images) => {
  const multipleImages = []

  for (let i = 0;i < images.length;i++) {
    const name = ref(storage, `blogs/${new Date().getTime() + images[i].name}`)
    const uploadImage = await uploadBytes(name, images[i].data)
    const downloadImage = await getDownloadURL(uploadImage.ref)
    multipleImages.push({ url: downloadImage, name: images[i].name })
  }
  return multipleImages
}

const processSingleImage = async images => {
  let singleImage = []
  const singleFile = new Date().getTime() + images.name
  const imageRef = ref(storage, `blogs/${singleFile}`)
  const uploadImage = await uploadBytes(imageRef, images.data)
  const url = await getDownloadURL(uploadImage.ref)
  singleImage.push({ url, name: images.name })
  return singleImage
}

const filesUpload = async (files) => {
  const imagesUrl = []
  if (files) {
    const uploadPromises = Object.keys(files).map(async (key) => {
      try {
        const name = ref(storage, `blogs/${new Date().getTime() + files[key].name}`)
        const uploadImage = await uploadBytes(name, files[key].data)
        const downloadImage = await getDownloadURL(uploadImage.ref)
        await imagesUrl.push({ [key]: { url: downloadImage, name: files[key].name } })
      } catch (error) {
        console.error(`Error uploading file for key ${key}: ${error}`)
      }
    })
    await Promise.all(uploadPromises) // Wait for all uploads to complete
    return imagesUrl
  } else {
    console.log('giving default image')
    return []
  }
}


const deleteImagesFromFirebase = async (imageUrls) => {

  // Create an array of promises for deleting images
  const deletePromises = imageUrls.map(async (imageUrl) => {
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
    console.log(`Deleted image: ${imageUrl}`)
  })

  try {
    // Wait for all delete operations to complete
    await Promise.all(deletePromises)
    console.log('All images have been deleted from Firebase Storage')
  } catch (error) {
    console.error('Error deleting images:', error)
  }
}

const sortAndCombine = (imagesFromOrigin, imagesFromFireBase) => {
  return imagesFromOrigin.concat(imagesFromFireBase).sort((a, b) => {
    return parseInt(Object.keys(a)[0]) - parseInt(Object.keys(b)[0])
  })
}

const removeOrderNumber = (images) => {
  return images?.map(image => {
    const key = Object.keys(image)[0]
    return image[key]
  })
}

const findUnmatchedUrls = (imagesFromBD, imagesFromFE) => {
  let notMatch = []
  const fromDataBaseUrls = imagesFromBD.map(image => image.url)
  const fromFrontEnd = imagesFromFE.map(image => image.url)
  // delete from frontend data check !includes backend 
  notMatch = fromDataBaseUrls.filter(el => !fromFrontEnd.includes(el))
  return notMatch
}


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
// @desc Get single blog
// route Get /blogs/post
// @access Private
const getSingleBlog = async (req, res) => {
  const { id } = req.params
  const blog = await Blog.findById(id).exec()


  if (!blog) {
    return res.status(404).json({ message: 'No blog found' })
  }


  const blogUser = await User.findById(blog.user).lean().exec()

  const blogWithUser = await { ...blog, user: blogUser.username }


  // console.log(blogWithUser)
  res.status(200).json(blogWithUser)
}

// @desc Get limited blogs
// route Get /blogs/post
// @access Private
const getPaginatedBlogs = async (req, res) => {
  // /blogs?page=1 is string
  const { page } = req.query

  console.log(page)

  const limit = 2

  // current page 4, 
  // startIndex (4 - 1) * 2 = 6 
  const startIndex = (Number(page) - 1) * limit

  const totalCount = await Blog.countDocuments({})

  // the skip method is to skip the provided document, in this case which are the document from page 1,2,3 
  // sort({_id: -1 }) desc order
  const blogs = await Blog.find().sort({ _id: -1 }).limit(limit).skip(startIndex)

  // prevent odd number 9(blogs)/2(blogs/perPage) = Match.ceil(4.5) === 5 pages
  res.status(200).json({ data: blogs, currentPage: Number(page), numberOfPages: Math.ceil(totalCount / limit) })


}

// @desc Create a blog
// route Post /blogs
// @access Private
const createBlog = async (req, res) => {

  // const { username, title, text, images } = req.body
  const { username, title, text, visibleTo } = req.body



  const images = await req.files.images // same order from how frontend formData append


  if (!title || !text) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const currentUser = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

  const titleExist = await Blog.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if (titleExist) {
    return res.status(400).json({ message: 'Title has been used' })
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

  const newBlog = await Blog.create({ user: currentUser, images: processedImages, user_id: currentUser._id, title, text, visible_to: visibleTo })

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

  const images = []
  let imagesFromDL = []
  let newImages

  // ...orgImages = ...req.body rename (type of orgImages === 'object')
  const { id, title, text, visibleTo, ...orgImages } = req.body
  const fileObject = { ...req.files } // if [...req.files] not not iterable, prevent mapping
  // console.log('orgImages', orgImages) // return as obj even though single or multiples
  // console.log('fileObject', fileObject) // return as obj single or multiples


  if (!id || !title || !text || !visibleTo) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const blog = await Blog.findById(id).exec()
  // console.log(blog)

  if (!blog) {
    return res.status(400).json({ message: 'Blog not found' })
  }

  const titleExist = await Blog.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if (titleExist && titleExist._id.toString() !== id) {
    return res.status(409).json({ message: 'Title has been used' })
  }

  if (Object.values(orgImages).length) {
    // convert from string to obj and using Object.keys or Object.values return an array
    Object.keys(orgImages).forEach((key) => {
      images.push({ [key]: JSON.parse(orgImages[key]) })
    })
  } else {
    console.log('no orgImages')
  }

  if (Object.values(fileObject).length) {
    // // upload the update imageFiles and download from firebase
    imagesFromDL = await filesUpload(fileObject)
  } else {
    console.log('no new imageFile(s)')
  }

  // handle if both or either one
  // sort the order from originImages and images dl from firebase
  newImages = await sortAndCombine(images, imagesFromDL)
  // console.log('newImages', newImages)

  // remove from [1:{},2:{}] to [{}:{}]
  const newSetOrderImages = await removeOrderNumber(newImages)

  // find the different url between database and frontend  
  const imagesUrlNotMatch = await findUnmatchedUrls(blog?.images, newSetOrderImages)
  console.log('blog.images', blog.images)

  console.log('newSetOrderImages', newSetOrderImages)

  console.log('imagesUrlNotMatch', imagesUrlNotMatch)

  // check if any un-match url found
  if (imagesUrlNotMatch.length) {
    // remove from firebase
    await deleteImagesFromFirebase(imagesUrlNotMatch)
  }

  blog.title = title
  blog.text = text
  blog.images = newSetOrderImages
  blog.visibleTo = visibleTo

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
  await deleteImagesFromFirebase(blog.images)
  const result = await blog.deleteOne()

  const reply = `Blog '${result.title}' with ID ${result._id} deleted`

  res.json(reply)


}

module.exports = { getAllBlogs, createBlog, updateBlog, deleteBlog, getSingleBlog, getPaginatedBlogs }