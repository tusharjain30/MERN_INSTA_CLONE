import express from "express"
import { addComment, bookmarks, createPost, deletePost, getAllPosts, getMyPosts, likeOrDislikePost, removeComment } from "../controllers/post.controller.js"
import isAuthenticated from "../middlewares/auth.js"

const router = express.Router()

router.route("/addNewPost").post(isAuthenticated, createPost)
router.route("/deletePost/:id").delete(isAuthenticated, deletePost)
router.route("/addNewComment/:id").post(isAuthenticated, addComment)
router.route("/removeComment/:id").delete(isAuthenticated, removeComment)
router.route("/likeOrDislike/:id").put(isAuthenticated, likeOrDislikePost)
router.route("/getAllPosts").get(getAllPosts)
router.route("/getMyPosts").get(isAuthenticated, getMyPosts)
router.route("/bookmark/:id").put(isAuthenticated, bookmarks)

export default router