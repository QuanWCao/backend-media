const express = require("express");
const { register, login ,logout , changePassword,getUser,getAllUser} = require("../controller/User")


const router = express.Router();


const isAuthenticated = require("../middleware/auth")

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/changepassword").put(isAuthenticated, changePassword);
router.route("/getUser").get(isAuthenticated, getUser);
router.route("/getAllUser").get(isAuthenticated, getAllUser);

module.exports = router;