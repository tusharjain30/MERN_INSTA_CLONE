import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    postImage: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    caption: {
        type: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Post = mongoose.model("Post", postSchema)

export default Post