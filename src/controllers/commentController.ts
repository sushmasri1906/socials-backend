import { Request, Response } from "express";
import Post from "../models/post";
import User from "../models/user";
export type Comment = {
	user: string;
	text: string;
	username: string;
	profileId?: string;
	profileImage?: string;
	createdAt: Date;
	_id: string;
};

interface AuthenticatedRequest extends Request {
	user?: {
		_id: string;
		username?: string;
		email?: string;
	};
}

const addComment = async (req: Request, res: Response) => {
	try {
		const { postId, comment, userId } = req.body;
		console.log("post id ", postId, "comment ", comment, "userId ", userId);
		if (!postId || !comment || !userId) {
			return res
				.status(400)
				.json({ message: "Post ID, comment, and user ID are required" });
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
			text: comment,
			username: user.username,
			profileId: userId,
			profileImage: user.profilePicture,
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

const getCommentsForPost = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { postId } = req.params;
		console.log("Received postId:", postId);

		// Validate postId
		if (!postId) {
			return res.status(400).json({ message: "Post ID is required" });
		}

		// Find the post and populate user data for comments
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.status(200).json({
			message: "Comments retrieved successfully",
			comments: post.comments,
		});
	} catch (error) {
		console.error("Error fetching comments:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Update a comment

const updateComment = async (req: Request, res: Response) => {
	try {
		const { commentId } = req.params;
		const { postId, text, userId } = req.body;

		if (!text) {
			return res.status(400).json({ message: "Text is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		const comment = post.comments.id(commentId);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Authorization check: Only the comment owner can update
		if (comment.user.toString() !== userId) {
			return res
				.status(403)
				.json({ message: "Unauthorized to update this comment" });
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

const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { commentId } = req.params;
		const { postId, userId } = req.body;

		console.log("Request Parameters:", req.params);
		console.log("Request Body:", req.body);
		console.log("Post ID being searched:", postId);

		// Find the post by ID
		const post = await Post.findById(postId);
		console.log("Post found:", post);
		if (!post) {
			console.log("Post not found");
			return res.status(404).json({ message: "Post not found" });
		}

		// Find the comment using Mongoose's id() method
		const comment = post.comments.id(commentId);
		if (!comment) {
			console.log("Comment not found");
			return res.status(404).json({ message: "Comment not found" });
		}

		// Log the user ID for authorization check
		console.log("Comment User ID:", comment.user.toString());
		console.log("Request User ID:", userId);

		// Authorization check: Only the comment owner or post owner can delete
		if (comment.user.toString() !== userId && post.user.toString() !== userId) {
			console.log("Unauthorized access attempt");
			return res
				.status(403)
				.json({ message: "Unauthorized to delete this comment" });
		}

		// Remove the comment from the array
		post.comments.pull(commentId);
		await post.save();

		console.log("Comment deleted successfully");
		res.status(200).json({ message: "Comment deleted successfully" });
	} catch (error) {
		console.error("Error deleting comment:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export { addComment, getCommentsForPost, updateComment, deleteComment };
