const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "User"
  },
  active: {
    type: Boolean,
    default: true
  },
  liked: [{
    blogsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    },
    isLiked: {
      type: Boolean,
      default: false
    }
  }],
  connected: [{
    blogsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    },
    isConnected: {
      type: Boolean,
      required: true,
      default: false
    }
  }],

}
  , {
    timestamps: true
  })

module.exports = mongoose.model('User', userSchema)