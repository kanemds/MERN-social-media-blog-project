const router = require('express').Router()
const authController = require('../controllers/authController')

router.route('/')
  .post()

router.route('/refresh')
  .get()

router.route('/logout')
  .post()



module.exports = router