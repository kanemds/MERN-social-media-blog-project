const router = require('express').Router()
const { login, refresh, logout } = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

router.route('/')
  .post(loginLimiter, login)

router.route('/refresh')
  .get(refresh)

router.route('/logout')
  .post(logout)



module.exports = router