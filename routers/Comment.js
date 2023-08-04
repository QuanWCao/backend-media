const express = require("express");
const {creatComment,updateComments,deleteComment } = require("../controller/Comment");

const router = express.Router();

const isAuthenticated = require("../middleware/auth");

router.route("/creatcomment").post(isAuthenticated, creatComment);
router
    .route("/comment/:id")
   
    .put(isAuthenticated, updateComments)
    .delete(isAuthenticated, deleteComment);


module.exports = router;