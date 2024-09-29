import express from "express";
import {
	getAllUsers,
	getUserByUsername,
	getProfile,
	updateUserProfile,
	deleteUserById,
	followUser,
	unfollowUser,
	getOtherUsersProfile,
	getFollowers,
	getFollowing,
	updateUserProfilePicture,
} from "../controllers/userController";
import upload from "../config/multer";
import { verifyToken } from "../middlewear/middlewear";
import { uploadImage } from "../middlewear/uploadImage";

const router = express.Router();

// Get authenticated user profile
router.get("/", getProfile);

// Update user profile
router.put("/", updateUserProfile);

// Update user profile
router.put(
	"/profilepicture",
	upload.single("file"),
	verifyToken,
	uploadImage,
	updateUserProfilePicture
);

// Delete user by ID
router.delete("/", deleteUserById);

// Get authenticated user profile
router.get("/others/:id", getOtherUsersProfile);

// Get all users
router.get("/all", getAllUsers);

// Get user by username
router.get("/users", getUserByUsername);

// Follow a user
router.post("/follow/:id", followUser);

// Unfollow a user
router.post("/unfollow/:id", unfollowUser);

// Get followers of a user
router.get("/followers/:id", getFollowers);

//get following for a user
router.get("/following/:id", getFollowing);
export default router;
