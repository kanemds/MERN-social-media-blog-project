const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'User is not authorized' })
  }

  console.log(authHeader)
  const accessToken = authHeader.split(' ')[1] // 'bearer jwt...
  console.log(token)

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (error, decoded) => {
      if (error) return res.status(403).json({ message: 'User is not authorized' })
      req.user = decoded.userInfo.username
      req.role = decoded.userInfo.role
      next()
    }
  )
}

module.exports = verifyJWT