import catchAsyncErrors from "../middlewares/catchAsyncErrors.js"
import catchAsyncError from "../middlewares/catchAsyncErrors.js"
import { ErrorHandler } from "../middlewares/errors.js"
import User from "../models/user.model.js"
import sendToken from "../utils/sendToken.js"
import { v2 as cloudinary } from "cloudinary"

export const register = catchAsyncError(async (req, res, next) => {
    const { userName, email, password } = req.body

    if (!userName || !email || !password) {
        return next(new ErrorHandler("Please fill full form!", 400))
    }

    let user = await User.findOne({ email })
    if (user) {
        return next(new ErrorHandler("Please try another email!", 400))
    }

    user = await User.findOne({ userName })
    if (user) {
        return next(new ErrorHandler("Please try another username!", 400))
    }

    user = await User.create({
        userName,
        email,
        password
    })

    sendToken(user, "User Registered!", 201, res)
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler("Please fill full form!", 400))
    }

    let user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400))
    }

    const isPassword = await user.comparePassword(password)
    if (!isPassword) {
        return next(new ErrorHandler("Invalid email or password", 400))
    }

    sendToken(user, "User LoggedIn!", 200, res)
});

export const logout = catchAsyncError(async (req, res, next) => {
    return res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: "User logged out!"
    })
});

export const getProfile = catchAsyncError(async (req, res, next) => {
    let user = req.user
    let userDetails = await User.findOne({ _id: user._id }).populate(
        { path: "posts" }
    ).populate(
        { path: "bookmarks" }
    )

    return res.status(200).json({
        success: true,
        user,
        userDetails
    })
});

export const getSavedPosts = catchAsyncError(async (req, res, next) => {
    let userDetails = await User.findOne({ _id: req.user._id }).populate(
        { path: "posts" }
    ).populate(
        { path: "bookmarks" }
    )

    return res.status(200).json({
        success: true,
        userDetails
    })
});

export const editProfile = catchAsyncError(async (req, res, next) => {
    const { bio, gender, userName } = req.body;

    const user = await User.findById(req.user._id)

    let data = {
        bio,
        gender,
        userName
    }

    if (user && user.profilePic && user.profilePic.public_id) {
        const publicId = user.profilePic.public_id
        if (publicId) {
            await cloudinary.uploader.destroy(publicId)
        }
    }


    if (req.files && req.files.profilePic) {
        let profilePic = req.files.profilePic

        const allowedFormat = ["image/png", "image/jpeg", "image/webp"]

        if (!allowedFormat.includes(profilePic.mimetype)) {
            return next(new ErrorHandler("Invalid profile image format, try again!", 400))
        }

        const cloudinaryRes = await cloudinary.uploader.upload(profilePic.tempFilePath, {
            folder: "Instagram_profile"
        })

        if (!cloudinaryRes || cloudinaryRes.error) {
            return next(new ErrorHandler("Unknown cloudinary error!", 500))
        }

        data.profilePic = {
            public_id: cloudinaryRes.public_id,
            url: cloudinaryRes.secure_url
        }
    }

    const updatedProfile = await User.findByIdAndUpdate(req.user._id, data, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    return res.status(200).json({
        success: true,
        message: "Profile Updated!",
        updatedProfile
    })
});

export const getSuggestedUsers = catchAsyncError(async (req, res, next) => {
    const id = req.user._id

    const users = await User.find({ _id: { $ne: id } })

    if (!users) {
        return next(new ErrorHandler("Currently do not have any users!", 404))
    }

    return res.status(200).json({
        success: true,
        users
    })
});

export const followORUnfollow = catchAsyncError(async (req, res, next) => {
    let followerId = req.user._id
    let toFollowId = req.params.id

    if (!toFollowId) {
        return next(new ErrorHandler("User not found!", 404))
    }

    // let follower = await User.findById(followerId)
    let toFollow = await User.findById(toFollowId)

    if (!toFollow.followers.includes(followerId)) {
        await Promise.all([
            User.updateOne({ _id: toFollowId }, { $push: { followers: followerId } }),
            User.updateOne({ _id: followerId }, { $push: { following: toFollowId } })
        ])

        return res.status(200).json({
            success: true,
            message: `Follow Successfully!`
        })

    } else {
        await Promise.all([
            User.updateOne({ _id: toFollowId }, { $pull: { followers: followerId } }),
            User.updateOne({ _id: followerId }, { $pull: { following: toFollowId } })
        ])

        return res.status(200).json({
            success: true,
            message: `UnFollow Successfully!`
        })
    }
});

export const getMyBookmarks = catchAsyncErrors(async (req, res, next) => {
    const savedPosts = await User.find({_id: req.user._id}).sort({createdAt: -1}).populate({
        path: "bookmarks"
    }).select("bookmarks")

    return res.status(200).json({
        success: true,
        savedPosts
    })
});

export const getOtherUserProfile = catchAsyncError(async (req, res, next) => {
    const userId = req.params.id
    const otherUserProfileData = await User.findById(userId).populate({path: "posts"}).populate({path: "bookmarks"})
    return res.status(200).json({
        success: true,
        otherUserProfileData
    })
});
