const router = require('express').Router()
const { getBlogsForSubscribedList, deleteSubscribe, addSubscribe } = require('../controllers/subscribeController')


router.route('/')
  .get(getBlogsForSubscribedList)
  .post(addSubscribe)
  .delete(deleteSubscribe)

module.exports = router