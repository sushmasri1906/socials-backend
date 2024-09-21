import { Request, Response } from "express";
import Post from "../models/post";
import User from "../models/user";

const addComment = async (req: Request, res: Response) => {
	try {
		const { postId, text, userId, profileImage } = req.body;

		if (!postId || !text || !userId) {
			return res
				.status(400)
				.json({ message: "Post ID, text, and user ID are required" });
		}

		// Find the user by ID
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Find the post by ID
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Create the new comment object
		const newComment = {
			user: userId,
			text,
			profileId: userId,
			profileImage: profileImage || user.profilePicture,
			createdAt: new Date(),
		};

		// Add the new comment to the post's comments array
		post.comments.push(newComment);
		await post.save();

		res.status(201).json({
			message: "Comment added successfully",
			comment: newComment,
		});
	} catch (error) {
		console.error("Error adding comment:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get all comments for a post from the User model
const getCommentsForPost = async (req: Request, res: Response) => {
	try {
		const { postId } = req.params;

		// Find the post by ID and get all comments
		const post = await Post.findById(postId).populate(
			"comments.user",
			"username profilePicture"
		);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.status(200).json(post.comments);
	} catch (error) {
		console.error("Error retrieving comments:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Update a comment (stored in the User model)
const updateComment = async (req: Request, res: Response) => {
	try {
		const { postId, commentId } = req.params;
		const { text } = req.body;

		if (!text) {
			return res.status(400).json({ message: "Text is required" });
		}

		// Find the post and the comment to update
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		const comment = post.comments.id(commentId);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Update the comment text
		comment.text = text;
		await post.save();

		res.status(200).json({
			message: "Comment updated successfully",
			comment,
		});
	} catch (error) {
		console.error("Error updating comment:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Delete a comment (stored in the User model)
const deleteComment = async (req: Request, res: Response) => {
	try {
		const { postId, commentId } = req.params;

		// Find the post by ID
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Find the comment index within the post's comments array
		const commentIndex = post.comments.findIndex(
			(comment) => comment._id?.toString() === commentId
		);
		if (commentIndex === -1) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Remove the comment from the array
		post.comments.splice(commentIndex, 1);
		await post.save();

		res.status(200).json({ message: "Comment deleted successfully" });
	} catch (error) {
		console.error("Error deleting comment:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export { addComment, getCommentsForPost, updateComment, deleteComment };
