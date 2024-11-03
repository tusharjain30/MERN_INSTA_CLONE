import express from "express"
import { config } from "dotenv"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import connection from "./dbConnection/connection.js"
import { errorMiddleware } from "./middlewares/errors.js"
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import cors from "cors"

const app = express()

config({
    path: "./.env"
})

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true
}))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)

connection()
app.use(errorMiddleware)

export default app;