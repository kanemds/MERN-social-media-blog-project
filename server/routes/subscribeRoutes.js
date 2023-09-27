const router = require('express').Router()
const { findSubscribedUsers, deleteSubscribe, addSubscribe } = require('../controllers/subscribeController')


router.route('/')
  .get(findSubscribedUsers)
  .post(addSubscribe)
  .delete(deleteSubscribe)

module.exports = router