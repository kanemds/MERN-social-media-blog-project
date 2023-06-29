const mongoose = require('mongoose')


const blogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    private: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)



module.exports = mongoose.model('Blog', blogSchema)