const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Types.ObjectId,
            ref: "post",
        },

        user: {
            type: mongoose.Types.ObjectId,
            ref: "user",
        },
        reply: {
            type: mongoose.Types.ObjectId,
            ref: 'comment',
        },

        gist: {
            type: String,
            required: true,
        },

    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("comment", commentSchema);
