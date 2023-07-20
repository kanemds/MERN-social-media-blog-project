const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body


  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const loginUser = await User.findOne({ username }).exec()

  if (!loginUser || !loginUser.active) {
    return res.status(401).json({ message: 'User is not authorized' })
  }

  const isPasswordMatch = await bcrypt.compare(password, loginUser.password)

  if (!isPasswordMatch) return res.status(401).json({ message: 'User is not authorized' })

  // ===============================create access and refresh token========================================================

  const accessToken = jwt.sign({
    'userInfo': {
      'username': loginUser.username,
      'role': loginUser.role
    }
  },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m'
    }
  )

  // user is not required to login if the while the refresh token is validate
  // refreshToken only provide username prevent data leak
  //    
  const refreshToken = jwt.sign({
    'username': loginUser.username
  },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  )

  // ====================================================================================================================


  // set cookie only contain username prevent extra info may leak
  res.cookie('jwt', refreshToken, {
    httpOnly: true, // accessibly only by web server
    secure: true, // https only
    sameSite: 'None', // cross-site cookie
    maxAge: 1000 * 60 * 60 * 24 * 1
  })

  res.status(200).json({ accessToken })

})

// @desc Refresh
// @route GET /auth/refresh
// @access Public send new accessToken when it is expired
const refresh = (req, res) => {
  const cookies = req.cookies

  if (!cookies) return res.status(401).json({ message: 'User is not authorized' })

  const refreshToken = cookies.jwt

  // verify if the refreshToken is validate

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (error, decoded) => {
      console.log(decoded)
      if (error) return res.status(403).json({ message: 'User is not authorized' })

      const loginUser = await User.findOne({ username: decoded.username }).exec()

      if (!loginUser) return res.status(401).json({ message: 'User is not authorized' })

      const accessToken = jwt.sign(
        {
          'userInfo': {
            'username': loginUser.username,
            'role': loginUser.role
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      )

      res.status(200).json({ accessToken })
    })
  )
}


// @desc Logout
// @route POST /auth/logout
// @access Public clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //request has been processed successfully, but there is no content to be sent back in the response.

  // when clearing cookie, needs to be the same object key and value
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.json({ message: 'Cookie cleared' })
}

module.exports = { login, refresh, logout }