import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minLength: [6, "Password must contain at least 6 characters!"],
        select: false,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        default: "Male"
    },
    bio: {
        type: String
    },
    profilePic: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
}, {timestamps: true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
};

userSchema.methods.generateToken = function(){
    return jwt.sign({id: this._id}, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    })
};

const User = mongoose.model("User", userSchema);

export default User