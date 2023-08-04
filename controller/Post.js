const Post = require("../model/Post");
const User = require("../model/User");
const Comment = require("../model/Comments");
const cloudinary = require("cloudinary");

const create = async (req, res) => {
  try {
    
    const { content } = req.body;
    const imageFile = [];
   
    for (i = 0; i < req.files.image.length; i++) {
      imageFile.push(req.files.image[i].tempFilePath);
    }
   
    if (imageFile.length <= 0  || !content) {
      return res
        .status(400)
        .json({ message: "Content or image must not be empty." });
    }
    const image = [];
    for (i = 0; i < imageFile.length; i++) {
      const mycloud = await cloudinary.v2.uploader.upload(imageFile[i], {
        folder: "products",
      });
      image.push({
        id: mycloud.public_id,
        url: mycloud.secure_url,
      });
    }
   
  
    
    const newPost = await Post({
      user: req.user._id,
      content,
      image,
    });

    await newPost.save();
    return res.status(200).json({
      success: true,
      message: "oke roi day",
      newPost,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const updatePost = async (req, res) => {
  try {
   
    const { content } = req.body;
    console.log(req.files.image.length);
  const imageFile = [];

  for (i = 0; i < req.files.image.length; i++) {
    imageFile.push(req.files.image[i].tempFilePath);
    // console.log(req.files.image[i].tempFilePath);
  }

  if (imageFile.length <= 0 || !content) {
    return res
      .status(400)
      .json({ message: "Content or image must not be empty." });
  }
    console.log(req.params.id,
      req.user._id,);
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    // console.log(post);

    if (!post) {
      return res
        .status(400)
        .json({ message: "b ko co quyen sua bai viet nay" });
    }
    if (post.image.id != null) {
      await cloudinary.v2.uploader.destroy(post.image.id);
    }

   const image = [];
   for (i = 0; i < imageFile.length; i++) {
     const mycloud = await cloudinary.v2.uploader.upload(imageFile[i], {
       folder: "posts",
     });
     image.push({
       id: mycloud.public_id,
       url: mycloud.secure_url,
     });
   }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { content, image }
    );

    if (!updatedPost) {
      return res.status(400).json({ message: "This post does not exist." });
    }

    res.json({
      message: "Post updated successfully.",
      updatedPost: {
        ...updatedPost._doc,
        user: req.user,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getPost = async (req, res) => {
  try {
   
    const post = await Post.findById({ _id: req.params.id }).populate('comments');
    // const comment = await Comment.find({ post: post._id })
    // const result = []; 

    console.log(post);
 if (!post) {
   return res.status(400).json({ message: "This post does not exist." });
 }
 res.json({ post });
   
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getAllPost = async (req, res) => {
  try {
    
    const post = await Post.find();
    const sort = post.sort((a, b) => a._id - b._id);
    console.log(post);
    if (!post) {
      return res.status(400).json({ message: "This post does not exist." });
    }
    res.json({ post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const deletePost = async (req, res) => {
  try {

    const post = await Post.findById({ _id: req.params.id });
    console.log(post.user);

    const auth = await User.findById({ _id: req.user.id });
    console.log(auth._id);

    if (String(post.user) != String(auth._id)) {
      return res.status(400).json({ message: "ko co quyen xoa." });
    }

    const deletePost = await Post.findOneAndDelete({ _id: req.params.id });
    await Comment.deleteMany({ _id: { $in: deletePost.comments } });
    console.log(deletePost);
    if (!deletePost) {
      return res.status(400).json({ message: "This post does not exist." });
    }

    res.json({ message: "Done" });
   
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

};




module.exports = { create, updatePost, getPost ,deletePost,getAllPost};
