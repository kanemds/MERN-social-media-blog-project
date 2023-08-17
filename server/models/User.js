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
  blogs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Blog'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)