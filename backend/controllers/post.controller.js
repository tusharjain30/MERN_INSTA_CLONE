import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errors.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { v2 as cloudinary } from "cloudinary"
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const createPost = catchAsyncErrors(async (req, res, next) => {
    const { caption } = req.body

    if (!req.files || Object.keys(req.files).length == 0) {
        return next(new ErrorHandler("Post Image is required!", 400))
    }

    const { postImage } = req.files

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"]
    if (!allowedFormats.includes(postImage.mimetype)) {
        return next(new ErrorHandler("Post image format is invalid, try again!", 400))
    }

    try {

        const cloudinaryRes = await cloudinary.uploader.upload(postImage.tempFilePath, {
            folder: "Instagram_posts"
        })

        if (!cloudinaryRes || cloudinaryRes.error) {
            return next(new ErrorHandler("Unknown cloudinary error!", 500))
        }

        let post = await Post.create({
            userName: req.user.userName,
            postImage: {
                public_id: cloudinaryRes.public_id,
                url: cloudinaryRes.secure_url
            },
            caption,
            createdBy: req.user._id
        })

        await User.updateOne({ _id: req.user._id }, { $push: { posts: post._id } })

        return res.status(201).json({
            success: true,
            message: "Post created successfully!",
            post
        })

    } catch (err) {
        return next(new ErrorHandler("Failed to upload post image to cloudinary!", 500))
    }
});

export const deletePost = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid id", 400))
    }

    const user = await User.findById(req.user._id)

    if (!user) {
        return next(new ErrorHandler("User not found!", 400))
    }

    if (user?.posts?.length > 0) {
        const user = await User.findById(req.user._id).populate({ path: "posts" })
        let post = user.posts.find((curVal) => {
            if (curVal._id == id) {
                return curVal
            }
        })

        if (post.postImage && post.postImage.public_id) {
            await cloudinary.uploader.destroy(post.postImage.public_id)
        }
    }

    if (user.posts && user.posts.postImage && user.posts.postImage.public_id) {
        const publicId = user.posts.postImage.public_id
        await cloudinary.uploader.destroy(publicId)
    }

    if (user.posts.includes(id)) {
        await User.updateOne({ _id: req.user._id }, { $pull: { posts: id } })
    }

    if (user.bookmarks.includes(id)) {
        await User.updateOne({ _id: req.user._id }, { $pull: { bookmarks: id } })
    }

    const post = await Post.findById(id)
    await post.deleteOne()

    return res.status(200).json({
        success: true,
        message: "Post Deleted!"
    })
});

export const addComment = catchAsyncErrors(async (req, res, next) => {
    const { comment } = req.body
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid id!", 400))
    }

    if (!comment) {
        return next(new ErrorHandler("Comment is required", 400))
    }

    const newComment = await Comment.create({
        userName: req.user.userName,
        comment,
        postId: id,
        createdBy: req.user._id
    })

    await Post.updateOne({ _id: id }, { $push: { comments: newComment._id } })

    return res.status(201).json({
        success: true,
        message: "Comment send!",
        newComment
    })
});

export const removeComment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid Id", 400))
    }

    const comment = await Comment.findById(id)

    if (!comment) {
        return next(new ErrorHandler("Comment not found!", 400))
    }
    const post = await Post.findById(comment.postId)
    if (post.comments.includes(id)) {
        await Post.updateOne({ _id: post._id }, { $pull: { comments: id } })
    }

    await comment.deleteOne()

    return res.status(200).json({
        success: true,
        message: "Comment Deleted!"
    })
});

export const likeOrDislikePost = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id
    const postId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return next(new ErrorHandler("Invalid id!", 400))
    }

    const post = await Post.findById(postId)

    if (!post) {
        return next(new ErrorHandler("Post not found!", 404))
    }

    if (!post.likes.includes(userId)) {
        await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } })

        return res.status(200).json({
            success: true,
            message: "Post Liked!"
        })

    } else {
        await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })

        return res.status(200).json({
            success: true,
            message: "Post Disliked!"
        })
    }
});

export const getAllPosts = catchAsyncErrors(async (req, res, next) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate({
        path: "comments",
        populate: {
            path: "createdBy",
        }
    }).populate({ path: "createdBy" })

    return res.status(200).json({
        success: true,
        posts
    })
});

export const getMyPosts = catchAsyncErrors(async (req, res, next) => {
    const posts = await Post.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).populate({
        path: "comments"
    })

    return res.status(200).json({
        success: true,
        posts
    })
});


export const bookmarks = catchAsyncErrors(async (req, res, next) => {
    const postId = req.params.id
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return next(new ErrorHandler("Invalid Id!", 400))
    }

    const user = await User.findById(userId)
    if (!user) {
        return next(new ErrorHandler("User not found!", 400))
    }

    if (!user.bookmarks.includes(postId)) {
        await User.updateOne({ _id: userId }, { $addToSet: { bookmarks: postId } })
        return res.status(200).json({
            success: true,
            message: "Post Bookmarked!"
        })

    } else {
        await User.updateOne({ _id: userId }, { $pull: { bookmarks: postId } })
        return res.status(200).json({
            success: true,
            message: "Post Removed from Bookmark!"
        })
    }
});