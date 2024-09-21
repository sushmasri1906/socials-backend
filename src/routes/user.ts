import express from "express";
import {
	getAllUsers,
	getUserByUsername,
	getProfile,
	updateUserProfile,
	deleteUserById,
	followUser,
	unfollowUser,
	getOtherUSersProfile,
} from "../controllers/userController";

const router = express.Router();

// Get all users
router.get("/all", getAllUsers);

// Get user by username
router.get("/", getUserByUsername);

// Get authenticated user profile
router.get("/profile/:id", getOtherUSersProfile);

// Get authenticated user profile
router.get("/profile", getProfile);

// Update user profile
router.put("/profile/:id", updateUserProfile);

// Delete user by ID
router.delete("/profile/:id", deleteUserById);

// Follow a user
router.post("/follow/:id", followUser);

// Unfollow a user
router.post("/unfollow/:id", unfollowUser);

export default router;
