import { Request, Response } from "express";
import Post from "../models/post";

import User from "../models/user";

// Create a new post
const createPost = async (req: Request, res: Response) => {
	try {
		console.log("create post");
		const { userId, caption, imageUrl, location } = req.body;
		console.log(imageUrl);
		console.log(userId);
		const newPost = new Post({
			user: userId,
			caption,
			imageUrl,
			location,
		});
		const savedPost = await newPost.save();
		console.log(savedPost);

		// Add the post to the user's posts array
		await User.findByIdAndUpdate(userId, { $push: { posts: savedPost._id } });

		res
			.status(201)
			.json({ message: "Post created successfully", post: savedPost });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get all posts by users the logged-in user is following
const getAllPosts = async (req: Request, res: Response) => {
	try {
		const { userId } = req.body;

		// Fetch the logged-in user's followers
		const user = await User.findById(userId).populate("following");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Get the IDs of the users the logged-in user is following
		const followingIds = user.following.map((followedUser: any) =>
			followedUser._id.toString()
		);

		console.log("followingIds ", followingIds);
		followingIds.push(userId);

		// Fetch posts only from the users that the logged-in user is following
		const posts = await Post.find({ user: { $in: followingIds } })
			.populate("user", "id username profilePicture")
			.lean();

		res.status(200).json(posts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getPostsByUserId = async (req: Request, res: Response) => {
	console.log("working");
	try {
		const userId = req.body.userId;
		console.log("profile posts ", userId);
		const posts = await Post.find({ user: userId });

		if (posts && posts.length > 0) {
			// If there are posts, send them
			return res.json({ posts });
		}

		// If no posts were found, send a "No posts" message
		return res.json({ message: "No posts" });
	} catch (e) {
		// If there's an error, send a 500 response
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get a single post by ID
const getPostById = async (req: Request, res: Response) => {
	try {
		const postId = req.params.id;

		// Fetch the post and populate the user, comments, and likes
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.status(200).json(post);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getPostsByOthersUserId = async (req: Request, res: Response) => {
	try {
		const userId = req.params.id;

		console.log("profile posts ", userId);
		const posts = await Post.find({ user: userId });

		if (posts && posts.length > 0) {
			// If there are posts, send them
			return res.json({ posts });
		}

		// If no posts were found, send a "No posts" message
		return res.json({ message: "No posts" });
	} catch (e) {
		// If there's an error, send a 500 response
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Update a post by ID
const updatePost = async (req: Request, res: Response) => {
	try {
		const postId = req.params.id;
		const updateData = req.body;

		const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
			new: true,
			runValidators: true,
		});

		if (!updatedPost) {
			return res.status(404).json({ message: "Post not found" });
		}

		res
			.status(200)
			.json({ message: "Post updated successfully", post: updatedPost });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Delete a post by ID
const deletePost = async (req: Request, res: Response) => {
	try {
		const postId = req.params.id;
		const deletedPost = await Post.findByIdAndDelete(postId);

		if (!deletedPost) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export {
	createPost,
	getAllPosts,
	getPostById,
	getPostsByOthersUserId,
	updatePost,
	deletePost,
	getPostsByUserId,
};
