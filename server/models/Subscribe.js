const mongoose = require('mongoose')

const subscribeSchema = new mongoose.Schema({
  blog_owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  subscribed_by_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  is_subscribed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Subscribe', subscribeSchema)
