const mongoose = require('mongoose')
const User = require('../models/User')
const Blog = require('../models/Blog')
const Like = require('../models/Like')
const Bookmark = require('../models/Bookmark')
const Subscribe = require('../models/Subscribe')
const { isEqual, sortBy, find, differenceWith, differenceBy } = require('lodash')
const storage = require('../config/firebaseConfig')

const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage')
const timeDisplayOptions = require('../config/timeDisplayOptions')
const { subscribe } = require('../routes/blogRoutes')


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

const currentLike = async (id, userId) => {
  const like = {
    likeId: null,
    isLike: false,
    totalLikes: 0
  }

  const total = await Like.find({ blog_id: id, is_like: true }).count()

  if (userId) {
    const status = await Like.findOne({ blog_id: id, liked_by_user_id: userId }).lean().exec()
    if (status) {
      like.isLike = status.is_like
      like.likeId = status._id
      like.totalLikes = total
      return like
    } else {
      return { ...like, totalLikes: total }
    }
  } else {
    return { ...like, totalLikes: total }
  }
}

const currentSubscribe = async (blog, userId) => {
  const subscribe = {
    subscribedId: null,
    isSubscribed: false,
    totalSubscribers: 0
  }

  const total = await Subscribe.find({ blog_owner_id: blog.user }).count()

  if (userId) {
    const status = await Subscribe.findOne({ blog_owner_id: blog.user, subscribed_by_user_id: userId }).lean().exec()

    if (status) {
      subscribe.subscribedId = status._id
      subscribe.isSubscribed = status.is_subscribed
      subscribe.totalSubscribers = total
      return subscribe
    } else {
      return { ...subscribe, totalSubscribers: total }
    }
  } else {
    return { ...subscribe, totalSubscribers: total }
  }

}

const currentBookmark = async (id, userId) => {
  const bookmark = {
    bookmarkId: null,
    isBookmarked: false
  }

  if (userId) {
    const status = await Bookmark.findOne({ blog_id: id, bookmark_by_user_id: userId }).lean().exec()
    if (status) {
      bookmark.bookmarkId = status._id
      bookmark.isBookmarked = status.is_bookmark
      return bookmark
    } else {
      return bookmark
    }
  } else {
    return bookmark
  }
}


// @desc Get blogs for user
// frontend route Get /blogs
// backend route Get router.route('/user')
// @access Private
const getBlogsForUser = async (req, res) => {
  const { id } = req.query

  const findUser = await User.findById(id).exec()

  if (!findUser) return res.status(200).json({ message: 'No user found' })

  const selectedUserBlogs = await Blog.aggregate([
    {
      $match: { user: findUser._id }
    },
    {
      $lookup: {
        from: 'users', // Replace with the actual name of your "User" collection in MongoDB
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails'
      },
    },
    {
      $unwind: '$userDetails'
    },
    {
      $project: {
        _id: 1,
        title: 1,
        text: 1,
        images: 1,
        visible_to: 1,
        createdAt: 1,
        updatedAt: 1,
        user: 1,
        username: '$userDetails.username', // Include the username
        __v: 1
      },
    },
  ])
    .sort({ createdAt: -1 }) // Sort by _id in descending order

  if (!selectedUserBlogs || selectedUserBlogs.length === 0) return res.status(200).json([])


  const countLikePerBlog = await Promise.all(selectedUserBlogs.map(async blog => {
    const timeConvert = new Date(Date.parse(blog.createdAt?.toString())).toLocaleString(undefined, timeDisplayOptions.optionTwo)
    const perBlog = await Like.find({ blog_id: blog._id, is_like: true }).count()
    return { ...blog, likedCount: perBlog, createdDate: timeConvert }
  }))

  res.status(200).json(countLikePerBlog)
}



// @desc Get single blog info
// frontend route Get '/blogs/post/:id'
// backend route Get router.route('/:id')
// @access Private
const getSingleBlog = async (req, res) => {
  // blog id
  const { id } = req.params
  // current login username
  const { username } = req.query

  let loginUser

  const findUser = await User.findOne({ username }).lean().exec()

  if (!findUser) return res.status(200).json({ message: 'No user found' })

  // return as an array
  const blog = await Blog.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id)
      }
    },
    {
      $lookup: {
        from: 'users', // Replace with the actual name of your "User" collection in MongoDB
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails'
      },
    },
    {
      $unwind: '$userDetails'
    },
    {
      $project: {
        _id: 1,
        title: 1,
        text: 1,
        images: 1,
        visible_to: 1,
        createdAt: 1,
        updatedAt: 1,
        user: 1,
        username: '$userDetails.username', // Include the username
        __v: 1
      },
    },
  ]).exec()

  if (!blog) return res.status(200).json({ message: 'No blog found' })

  const like = await currentLike(id, findUser._id)
  const subscribe = await currentSubscribe(blog[0], findUser._id)
  const bookmark = await currentBookmark(id, findUser._id)

  loginUser = { ...blog[0], like, subscribe, bookmark, }

  res.status(200).json(loginUser)
}

// @desc Get view blogger blogs
// route Get /blogger
// @access Private
const getSelectedBlogger = async (req, res) => {
  // blogger id
  const { id } = req.params
  // login username 
  const { username } = req.query

  const findBlogger = await User.findById(id).exec()

  if (!findBlogger) return res.status(200).json({ message: 'Net work error please try again' })

  const findUser = await User.findOne({ username }).lean().exec()

  if (!findUser) return res.status(200).json({ message: 'No user found' })

  const blogs = await Blog.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(id)
      }
    },
    {
      $lookup: {
        from: 'users', // Replace with the actual name of your "User" collection in MongoDB
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails'
      },
    },
    {
      $unwind: '$userDetails'
    },
    {
      $project: {
        _id: 1,
        title: 1,
        text: 1,
        images: 1,
        visible_to: 1,
        createdAt: 1,
        updatedAt: 1,
        user: 1,
        username: '$userDetails.username', // Include the username
        __v: 1
      },
    },
  ]).exec()

  const totalSubscribers = await Subscribe.find({ blog_owner_id: id }).count().exec()
  const totalBlogs = blogs.length

  const promises = blogs.map(async blog => {
    const like = await currentLike(blog._id, findUser._id)
    const subscribe = await currentSubscribe(blog, findUser._id)
    const bookmark = await currentBookmark(blog._id, findUser._id)

    const [likeResult, subscribeResult, bookmarkResult] = await Promise.all([
      like,
      subscribe,
      bookmark,
    ])

    return { ...blog, like: likeResult, subscribe: subscribeResult, bookmark: bookmarkResult }
  })

  const info = await Promise.all(promises)

  // loginUser = { ...blog, like, subscribe, bookmark, }
  // console.log('refetch single Blog')
  res.status(200).json({ numberOfBlogs: totalBlogs, numberOfSubscribers: totalSubscribers, blogs: info, bloggerName: findBlogger.username })
}

// @desc Get frontpage , scroll down for pages limited blogs
// route Get /blogs/post
// @access Private
const getPaginatedBlogs = async (req, res) => {
  // /blogs?page=1 is string
  //return  1
  const { page } = req.query


  if (page === undefined) return res.status(400).json([])

  const limit = 6

  // current page 4, 
  // startIndex (4 - 1) * 2 = 6 
  const startIndex = (Number(page) - 1) * limit

  const totalCount = await Blog.countDocuments({})

  // the skip method is to skip the provided document, in this case which are the document from page 1,2,3 
  // sort({_id: -1 }) desc order

  const blogs = await Blog.aggregate([
    {
      $lookup: {
        from: 'users', // Replace with the actual name of your "User" collection in MongoDB
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails'
      },
    },
    {
      $unwind: '$userDetails'
    },
    {
      $project: {
        _id: 1,
        title: 1,
        text: 1,
        images: 1,
        visible_to: 1,
        createdAt: 1,
        updatedAt: 1,
        user: 1,
        username: '$userDetails.username', // Include the username
        __v: 1
      },
    },
  ])
    .sort({ createdAt: -1 }) // Sort by _id in descending order
    .limit(limit) // Limit the number of results
    .skip(startIndex) // Skip a certain number of results

  if (!blogs || blogs.length === 0) return res.status(200).json([])

  // prevent odd number 9(blogs)/2(blogs/perPage) = Match.ceil(4.5) === 5 pages
  res.status(200).json({ data: blogs, currentPage: Number(page), numberOfPages: Math.ceil(totalCount / limit) })
}

// @desc Create a blog
// route Post /blogs
// @access Private
const createBlog = async (req, res) => {

  const { title, text, visibleTo, userId } = req.body

  const images = await req.files.images // same order from how frontend formData append

  if (!title || !text) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const currentUser = await User.findById(userId).collation({ locale: 'en', strength: 2 }).lean().exec()

  if (!currentUser) {
    return res.status(400).json({ message: 'The current user is not exist' })
  }

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

  const newBlog = await Blog.create({ images: processedImages, user: currentUser._id, title, text, visible_to: visibleTo })

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
  // console.log('blog.images', blog.images)

  // console.log('newSetOrderImages', newSetOrderImages)

  // console.log('imagesUrlNotMatch', imagesUrlNotMatch)

  // check if any un-match url found
  if (imagesUrlNotMatch.length) {
    // remove from firebase
    await deleteImagesFromFirebase(imagesUrlNotMatch)
  }

  blog.title = title
  blog.text = text
  blog.images = newSetOrderImages
  blog.visible_to = visibleTo

  const updatedBlog = await blog.save()

  res.status(200).json(`${updatedBlog.title} updated`)
}
// @desc Delete a blog
// route Delete /blogs
// @access Private
const deleteBlog = async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Blog ID required' })
  }

  // Confirm blog exists to delete 
  const blog = await Blog.findById(id).exec()

  if (!blog) {
    return res.status(400).json({ message: 'Blog not found' })
  }

  const urls = blog.images.map(each => each.url)
  await deleteImagesFromFirebase(urls)

  await blog.deleteOne()


  res.status(200).json({ message: 'Selected blog had been deleted.' })

}

module.exports = { createBlog, updateBlog, deleteBlog, getSingleBlog, getSelectedBlogger, getPaginatedBlogs, getBlogsForUser }