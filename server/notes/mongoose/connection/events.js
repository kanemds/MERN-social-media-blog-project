
// connected: successfully connects to the MongoDB database.

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

// error:  when an error occurs while connecting to the MongoDB database or during the database operation.

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error)
})

disconnected: when the MongoDB connection is disconnected.

  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB')
  })

// reconnected: when Mongoose successfully reconnects to the MongoDB database after a disconnection.

mongoose.connection.on('reconnected', () => {
  console.log('Reconnected to MongoDB')
})

// open: when the MongoDB connection is open

mongoose.connection.once('open', () => {
  console.log('MongoDB connection established')
})

// close:  when the MongoDB connection is closed.

mongoose.connection.on('close', () => {
  console.log('MongoDB connection closed')
})

// fullsetup: when Mongoose has successfully connected to all the servers specified in the connection string(for replica sets and sharded clusters).

mongoose.connection.on('fullsetup', () => {
  console.log('Mongoose connected to all servers')
});

