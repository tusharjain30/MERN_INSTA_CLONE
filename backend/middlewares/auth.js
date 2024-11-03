import User from "../models/user.model.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import { ErrorHandler } from "./errors.js";
import jwt from "jsonwebtoken"

const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies
    if(!token){
        return next(new ErrorHandler("User is not Authenticated!", 400))
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY)
    req.user = await User.findOne({_id: decode.id})

    next()
});

export default isAuthenticated