const express = require("express");
const cookieParser = require("cookie-parser");
const User = require(".//routers/User");
const Post = require(".//routers/Post");
const Comment = require(".//routers/Comment")
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	fileUpload({
		limits: { fileSize: 50 * 1024 * 1024 },
		useTempFiles: true,
	})
);
app.use(cors());


app.use("/api/v1", User);
app.use("/api/v1", Post);
app.use("/api/v1", Comment);
app.get("/", (req, res) => {
	res.send("Server is working");
});
module.exports = app;
