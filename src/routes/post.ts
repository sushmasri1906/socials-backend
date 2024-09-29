import express from "express";
import {
	createPost,
	getAllPosts,
	getPostById,
	getPostsByOthersUserId,
	updatePost,
	deletePost,
	getPostsByUserId,
} from "../controllers/postController";
import { addLike, deleteLike } from "../controllers/likeControllers";
import {
	addComment,
	getCommentsForPost,
	updateComment,
	deleteComment,
} from "../controllers/commentController";
import { uploadImage } from "../middlewear/uploadImage";
import upload from "../config/multer";
import { verifyToken } from "../middlewear/middlewear";

const router = express.Router();

// Create a new post
router.post(
	"/create",
	upload.single("file"),
	verifyToken,
	uploadImage,
	createPost
);

// Get all posts
router.get("/all", getAllPosts);

// Get a single post by ID
router.get("/:id", getPostById);

// Get a specific user post by ID
router.get("/user/:id", getPostsByOthersUserId);

//To get all posts belong to that user
router.post("/profile", getPostsByUserId);

// Update a post by ID
router.put("/update/:id", updatePost);

// Delete a post by ID
router.delete("/delete/:id", deletePost);

// Add a comment
router.post("/comments", addComment);

// Get comments for a post
router.get("/:postId/comments", getCommentsForPost);

// Update a comment
router.put("/comments/:commentId", updateComment);

// Delete a comment
router.delete("/comments/:commentId", deleteComment);

// Add a like to a post
router.post("/like", addLike);

// Delete a like by ID
router.delete("/like/:id", deleteLike);

export default router;
