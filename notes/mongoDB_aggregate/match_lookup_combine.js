
// use the subscribed user id search for the blog owner

const subscribersName = await Subscribe.aggregate([
  {
    $match: { subscribed_by_user_id: isUserExist._id }
  },
  {
    $lookup: {
      from: 'users', // Replace with the actual name of your "User" collection in MongoDB
      localField: 'blog_owner_id', // from the current Subscribe model blog_owner_id
      foreignField: '_id', // match with user._id
      as: 'userDetails' // return result as collection of user collection
    },
  },
  {
    $unwind: '$userDetails'
  },
  {
    $project: {
      _id: 1,
      blog_owner_id: 1,
      subscribed_by_user_id: 1,
      is_subscribed: 1,
      createdAt: 1,
      updatedAt: 1,
      username: '$userDetails.username', // Include the username
      __v: 1
    },
  },
])
  .sort({ createdAt: -1 }) // Sort by _id in descending order