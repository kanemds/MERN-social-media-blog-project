const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
  origin: (origin, callback) => {
    // !origin 
    // if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
    if (allowedOrigins.indexOf(origin) !== -1) { // only allow from the allowOrigins, if !origin it will allow postman etc...
      // first arg error:null, origin:true
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionSuccessStatus: 200
}

module.exports = corsOptions