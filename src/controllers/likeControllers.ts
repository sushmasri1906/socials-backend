import { Request, Response } from "express";
import Post from "../models/post";
import mongoose from "mongoose";

// Add a like to a post
const addLike = async (req: Request, res: Response) => {
	try {
		const { postId, userId } = req.body;
		if (!postId || !userId) {
			return res
				.status(400)
				.json({ message: "Post ID and user ID are required" });
		}

		// Find the post
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Check if the user already liked the post
		if (post.likes.includes(userId)) {
			return res
				.status(400)
				.json({ message: "Post already liked by this user" });
		}

		// Add the user's ID to the likes array
		post.likes.push(userId);
		await post.save();

		res
			.status(201)
			.json({ message: "Post liked successfully", likes: post.likes });
	} catch (error) {
		console.error("Error adding like:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Delete a like by ID
const deleteLike = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		console.log(req.params);
		const { userId } = req.body;
		console.log(id, userId);

		if (!id || !userId) {
			return res
				.status(400)
				.json({ message: "Post ID and user ID are required" });
		}

		// Find the post
		const post = await Post.findById(id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Check if the user has liked the post
		if (!post.likes.includes(userId)) {
			return res.status(404).json({ message: "Like not found" });
		}

		// Remove the user's ID from the likes array
		post.likes = post.likes.filter((like) => like.toString() !== userId);
		await post.save();

		res
			.status(200)
			.json({ message: "Like removed successfully", likes: post.likes });
	} catch (error) {
		console.error("Error removing like:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export { addLike, deleteLike };
