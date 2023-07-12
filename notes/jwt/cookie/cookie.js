const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const loginUser = User.find({ username }).exec()

  if (!loginUser || !loginUser.active) {
    return res.status(401).json({ message: 'User is not authorized' })
  }

  const isPasswordMatch = await bcrypt.compare(password, loginUser.password)

  if (!isPasswordMatch) return res.status(401).json({ message: 'User is not authorized' })

  const accessToken = jwt.sign({
    'userInfo': {
      'username': loginUser.username,
      'role': loginUser.role
    }
  },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '10s'
    }
  )

  // user is not required to login if the while the refresh token is validate
  const refreshToken = jwt.sign({
    'username': loginUser.username
  },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  )

  res.cookie('jwt', refreshToken, {
    httpOnly: true, // accessibly only by web server
    secure: true, // https only
    sameSite: 'None', // cross-site cookie
    maxAge: 1000 * 60 * 60 * 24 * 1
  })

  res.status(200).json({ accessToken })

})


// httpOnly: true: Setting httpOnly to true ensures that the cookie can only be accessed by the web server and is not accessible by client-side JavaScript. This helps enhance security by preventing certain types of cross-site scripting attacks.

// secure: true: By setting secure to true, the cookie is only sent over HTTPS connections. This ensures that the cookie is encrypted during transmission, providing an additional layer of security.

// sameSite: 'None': The sameSite attribute is set to 'None', which allows the cookie to be sent in cross-site requests. This is useful for scenarios where the server needs to receive the cookie even when the request originates from a different website.

// maxAge: 1000 * 60 * 60 * 24 * 1: The maxAge option specifies the maximum age of the cookie in milliseconds. In this case, the cookie is set to expire after 1 day (24 hours).