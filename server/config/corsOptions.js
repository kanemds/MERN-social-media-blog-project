const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
  origin: (origin, callback) => {
    // !origin 
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // first arg error:null, origin:true
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credential: true,
  optionSuccessStatus: 200
}

module.exports = corsOptions