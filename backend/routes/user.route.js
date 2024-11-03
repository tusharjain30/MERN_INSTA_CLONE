import express from "express";
import { editProfile, followORUnfollow, getMyBookmarks, getOtherUserProfile, getProfile, getSavedPosts, getSuggestedUsers, login, logout, register } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/auth.js";

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(isAuthenticated, logout)
router.route("/getProfile").get(isAuthenticated, getProfile)
router.route("/editProfile").put(isAuthenticated, editProfile)
router.route("/suggestedUsers").get(isAuthenticated, getSuggestedUsers)
router.route("/getMyBookmarks").get(isAuthenticated, getSavedPosts)
router.route("/getOtherUserProfile/:id").get(getOtherUserProfile)
router.route("/followOrUnfollow/:id").put(isAuthenticated, followORUnfollow)

export default router