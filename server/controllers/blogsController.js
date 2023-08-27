const User = require('../models/User')
const Blog = require('../models/Blog')
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


  const orgImages = { ...req.body }
  const fileObject = { ...req.files } // if [...req.files] not not iterable, prevent mapping
  // console.log('inputObject', inputObject) // return as obj
  // console.log('fileObject', fileObject) // return as obj single or multiples




  const { id, title, text, visibleTo } = req.body

  const images = []

  // Object.keys or Object.values return an array
  Object.keys(orgImages).forEach((key) => {
    if (!isNaN(key)) {
      images.push({ [key]: JSON.parse(orgImages[key]) })
    }
  })


  const filesUpload = async (files) => {
    const imagesUrl = []
    if (files) {
      const uploadPromises = Object.keys(files).map(async (key) => {
        // console.log('key', key)
        // console.log('files[key]', files[key])
        // console.log('files[key]', files[key].name)

        const name = ref(storage, `blogs/${new Date().getTime() + files[key].name}`)
        const uploadImage = await uploadBytes(name, files[key].data)
        const downloadImage = await getDownloadURL(uploadImage.ref)
        imagesUrl.push({ [key]: { url: downloadImage, name: files[key].name } })
      })

      await Promise.all(uploadPromises) // Wait for all uploads to complete

      console.log(imagesUrl)
      return imagesUrl
    } else {
      console.log('giving default image')
      return []
    }
  }

  const imagesFromDL = await filesUpload(fileObject)

  const newImages = images.concat(imagesFromDL).sort((a, b) => {
    return parseInt(Object.keys(a)[0]) - parseInt(Object.keys(b)[0])
  })

  console.log(newImages)



  if (!id || !title || !text || !visibleTo) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const blog = await Blog.findById(id).exec()


  if (!blog) {
    return res.status(400).json({ message: 'Blog not found' })
  }

  const titleExist = await Blog.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if (titleExist && titleExist._id.toString() !== id) {
    return res.status(409).json({ message: 'Title has been used' })
  }



  // for (let i = 0;i < images.length;i++) {
  //   if (images[i][1] instanceof File) {
  //     console.log(file)
  //   } else if (typeof images[i][1] === 'object') {
  //     const imageJson = JSON.stringify(images[i])
  //     formData.append(`${i + 1}`, imageJson)
  //   }
  // }


  // const processMultipleImages = async images => {
  //   const multipleImages = []

  //   for (let i = 0;i < images.length;i++) {
  //     if (images[i].type.split('/')[0] !== 'image') multipleImages.push(images[i])
  //     const name = ref(storage, `blogs/${new Date().getTime() + images[i].name}`)
  //     const uploadImage = await uploadBytes(name, images[i].data)
  //     const downloadImage = await getDownloadURL(uploadImage.ref)
  //     multipleImages.push({ url: downloadImage, name: images[i].name })
  //   }
  //   return multipleImages
  // }

  // const processSingleImage = async images => {
  //   let singleImage = []
  //   const singleFile = new Date().getTime() + images.name
  //   const imageRef = ref(storage, `blogs/${singleFile}`)
  //   const uploadImage = await uploadBytes(imageRef, images.data)
  //   const url = await getDownloadURL(uploadImage.ref)
  //   return singleImage = [{ url, name: images.name }]

  //   let processedImages
  //   // using typeof array === 'object' true since array is object
  //   // instead Array.isArray(images) is to check if it's array

  //   if (!Array.isArray(images)) {
  //     processedImages = await processSingleImage(images)   // object 
  //   } else {
  //     processedImages = await processMultipleImages(images) // array
  //   }

  //   blog.title = title
  //   blog.text = text
  //   blog.images = processedImages
  //   blog.visibleTo = visibleTo

  //   const updatedBlog = await blog.save()

  //   res.json(`${updatedBlog.title} updated`)
  // }
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

module.exports = { getAllBlogs, createBlog, updateBlog, deleteBlog, getSingleBlog }