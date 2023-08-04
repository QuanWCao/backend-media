const express = require("express");
const { create, updatePost,getPost ,deletePost,getAllPost} = require("../controller/Post");

const router = express.Router();

const isAuthenticated = require("../middleware/auth");

router.route("/create").post(isAuthenticated,create);
router
  .route("/post/:id")
  .get(isAuthenticated, getPost)
    .put(isAuthenticated, updatePost)
  .delete(isAuthenticated, deletePost);
    
router.route("/getAllPost").get(isAuthenticated, getAllPost);

module.exports = router;