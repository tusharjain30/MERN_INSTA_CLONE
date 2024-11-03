const sendToken = (user, message, statusCode, res) => {
    const token = user.generateToken()

    return res.status(statusCode).cookie("token", token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }).json({
        success: true,
        message,
        user,
        token
    })
};

export default sendToken