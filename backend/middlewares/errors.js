export class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
};

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Interval Server Error"
    err.statusCode = err.statusCode || 500

    if(err.name === "CastError"){
        const message = `Invalid ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    if(err.code == 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered!`
        err = new ErrorHandler(message, 400)
    }

    if(err.name == "JsonWebTokenError"){
        const message = "Invalid Json Web Token, try again!"
        err = new ErrorHandler(message, 400)
    }

    if(err.name == "TokenExpiredError"){
        const message = "Token is Expired, try again!"
        err = new ErrorHandler(message, 400)
    }

    const errorMessages = err.errors ? Object.values(err.errors).map((error) => error.message).join(" ") : err.message

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessages
    })
};