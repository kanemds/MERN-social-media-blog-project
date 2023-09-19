const mongoose = require('mongoose')


const blogSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    user_id: {
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
    images: [
      {
        name: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        },
      }
    ],
    visible_to: {
      type: String,
      default: 'public'
    }
  },
  {
    timestamps: true
  }
)



module.exports = mongoose.model('Blog', blogSchema)

// benefit
// Data Integrity: Maintains consistent user data across blogs; changes update universally.

// Efficient Queries: Retrieves user data without extra queries, enhancing retrieval speed.

// Flexibility: Allows user data updates or expansions without affecting blogs.

// Normalization: Follows best practices by separating related data into distinct models.

// Maintainability: Simplifies maintenance with centralized user data management.

// Scalability: Efficiently handles relationships among numerous documents.

// Structured: Organizes data model for improved database performance and management.