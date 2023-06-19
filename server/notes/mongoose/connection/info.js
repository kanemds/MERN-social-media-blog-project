// mongoose.connect: This method is used to establish a connection to a MongoDB database using Mongoose.
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
  } catch (error) {
    console.log(error)
  }
}

// mongoose.connection.on: This is an event listener that allows you to listen for specific events related to the Mongoose connection.
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error)
})

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

// mongoose.connection.once: This is similar to mongoose.connection.on, using once is only executed once for the specified event.After the event is triggered and the event handler is executed, it is automatically removed.Here's an example:


mongoose.connection.once('open', () => {
  console.log('MongoDB connection established')
})