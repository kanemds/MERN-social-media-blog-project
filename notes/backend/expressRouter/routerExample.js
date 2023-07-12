const router = require('express').Router()


router.route('/about')
  .get(getAllBlogs)
  .post(createBlog)
  .patch(updateBlog)
  .delete(deleteBlog)

// ===============================  or =================================================

router.get("/about", getAllBlogs)

router.post("/about", createBlog)


router.patch("/about", updateBlog)

router.delete("/about", deleteBlog)


// ===============================  or  =================================================


router.get("/about", function (req, res) {
  res.send("About this wiki")
})

router.post("/about", (req, res) => {
  res.send("About this wiki")
})


router.patch("/about", (req, res) => {
  res.send("About this wiki")
})

router.delete("/about", (req, res) => {
  res.send("About this wiki")
})