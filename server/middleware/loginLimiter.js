const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // set limit each IP to 5 login requests per window per minute
  message:
  {
    message: 'Sorry, your login attempts have reached the maximum limit. Please wait for 1 minute before attempting again.'
  },
  handler: (req, res, next, options) => {
    logEvents(`Attempt reach limit: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

})

module.exports = loginLimiter


// RateLimit-* headers (standardHeaders: true):

// Standardized rate limit headers defined by RFC 6585 specification.
// Includes headers like RateLimit-Limit, RateLimit-Remaining, and RateLimit-Reset.
// Provides information about rate limit configuration, remaining requests within the current window, and the reset time.
// X-RateLimit-* headers (legacyHeaders: false):

// Legacy convention for rate limit headers.
// Includes headers like X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset.
// Not part of the official HTTP specification.
// May still be supported by older clients or applications.
// standardHeaders: true:

// Enables inclusion of the RateLimit-* headers in the response.
// Provides clients with standard rate limit information.
// legacyHeaders: false:

// Disables inclusion of the X-RateLimit-* headers.
// Indicates that the application does not provide rate limit information in the legacy format.
// It's recommended to use the standardized RateLimit-* headers for consistency and adherence to the HTTP specification.

// The legacy X-RateLimit-* headers may still be supported by some older clients or applications.