import mongoose, { mongo } from "mongoose";

const commentSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, {timestamps: true});

const Comment = mongoose.model("Comment", commentSchema)

export default Comment