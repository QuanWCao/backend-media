const Post = require("../model/Post");
const User = require("../model/User");
const Comment = require("../model/Comments")

const creatComment = async (req, res) => {
    try {
        
        const { post, reply,
            gist } = req.body;

        const findedPost = await Post.findOne(
            { _id: post}
        );

        if (!findedPost) {
            return res.status(400).json({ message: "This post does not exist." });
        }

        if (reply) {
            const comment = await Comment.findOne(
                { id: reply }
            );

            if (!comment) {
                return res.status(400).json({ message: "This comment does not exist." });
            }
        }

        const newComment = new Comment({
            post: post,
            user: req.user._id,
            reply,

            gist,
        });

        await newComment.save();


        await Post.findOneAndUpdate(
            { _id: post },
            {
                $push: { comments: newComment._id },
            },
            { new: true }
        );

        res.json({
            message: "Comment created successfully.",
            newComment: {
                ...newComment._doc,
                 user: req.user,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const updateComments = async (req, res) => {
    try {
        const { gist } = req.body;

        const updatedComment = await Comment.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id},
            { gist }
        );

        if (!updatedComment) {
            return res.status(400).json({ message: "This comment does not exist." });
        }

        res.json({
            message: "Comment updated successfully.",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteComment = async (req, res) => {
    try {

        const postid = await Comment.findById({ _id: red.params.id }).post;
        const userid = await Comment.findById({ _id: red.user.id }).user;
        const role = await Comment.findById({ _id: userid }).role;
        if (String(postid) != String(userid) || role != "admin") {
            return res.status(400).json({ message: "ko co quyen xoa." });
        }
        const deletedComment = await Comment.findOneAndDelete({
            _id: req.params.id, user: req.user._id
        });

        await Post.findOneAndUpdate(
            { _id: postid },
            { $pull: { comments: req.params.id } },
            { new: true }
        );

        if (!deletedComment) {
            return res.status(400).json({ message: "This comment does not exist." });
        }

        res.json({ message: "Comment deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};




module.exports = { creatComment, updateComments ,deleteComment };