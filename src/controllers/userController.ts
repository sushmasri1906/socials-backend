import { Request, Response } from "express";
import User from "../models/user.js"; // Ensure this path is correct

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find();
		if (users.length === 0) {
			res.status(404).json({ message: "No users found" });
		} else {
			res.json(users);
		}
	} catch (err) {
		if (err instanceof Error)
			res.status(500).json({ message: "Server error: " + err.message });
		else res.status(500).json({ message: "unknown server error: " });
	}
};

// Get user by username
export const getUserByUsername = async (req: Request, res: Response) => {
	try {
		const username = req.query.username;
		const query = username
			? { username: { $regex: username, $options: "i" } }
			: {};
		const users = await User.find(query);

		if (users.length === 0) {
			const message = username
				? `No users found with the username "${username}"`
				: "No users found";
			res.status(404).json({ message });
		} else {
			res.json(users);
		}
	} catch (err) {
		if (err instanceof Error)
			res.status(500).json({ message: "Server error: " + err.message });
		else res.status(500).json({ message: "unknown server error: " });
	}
};

// Get authenticated user profile
export const getProfile = async (req: Request, res: Response) => {
	try {
		const userId = req.body.userId; // Ensure this is set by verifyToken middleware

		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ user });
	} catch (err) {
		if (err instanceof Error)
			res.status(500).json({ message: "Server error: " + err.message });
		else res.status(500).json({ message: "unknown server error: " });
	}
};

// Get authenticated user profile
export const getOtherUSersProfile = async (req: Request, res: Response) => {
	try {
		const params = req.params;
		console.log(params.id);

		const user = await User.findById(params.id).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ user });
	} catch (err) {
		if (err instanceof Error)
			res.status(500).json({ message: "Server error: " + err.message });
		else res.status(500).json({ message: "unknown server error: " });
	}
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
	const id = req.params.id;
	try {
		const user = await User.findByIdAndUpdate(id, req.body, { new: true });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json(user);
	} catch (err) {
		if (err instanceof Error)
			res.status(500).json({ message: "Server error: " + err.message });
		else res.status(500).json({ message: "unknown server error: " });
	}
};

// Delete user by ID
export const deleteUserById = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json({ message: "User deleted successfully", user });
	} catch (err) {
		if (err instanceof Error)
			res.status(500).json({ message: "Server error: " + err.message });
		else res.status(500).json({ message: "unknown server error: " });
	}
};

// Follow a user
export const followUser = async (req: Request, res: Response) => {
	const currentUserId = req.body.userId;
	const params = req.params;

	console.log(currentUserId, params.id);

	if (!currentUserId || !params.id) {
		return res
			.status(400)
			.json({ message: "User ID and ID to follow are required" });
	}

	try {
		await User.findByIdAndUpdate(currentUserId, {
			$addToSet: { following: params.id },
		}).exec();

		await User.findByIdAndUpdate(params.id, {
			$addToSet: { followers: currentUserId },
		}).exec();

		res.json({ message: "Followed successfully" });
	} catch (err) {
		if (err instanceof Error)
			res.status(500).json({ message: "Server error: " + err.message });
		else res.status(500).json({ message: "unknown server error: " });
	}
};

//unfollow user
export const unfollowUser = async (req: Request, res: Response) => {
	const currentUserId = req.body.userId;
	const params = req.params;

	if (!currentUserId || !params.id) {
		return res
			.status(400)
			.json({ message: "User ID and ID to unfollow are required" });
	}

	try {
		await User.findByIdAndUpdate(currentUserId, {
			$pull: { following: params.id },
		}).exec();

		await User.findByIdAndUpdate(params.id, {
			$pull: { followers: currentUserId },
		}).exec();

		res.json({ message: "Unfollowed successfully" });
	} catch (err) {
		if (err instanceof Error)
			res.status(500).json({ message: "Server error: " + err.message });
		else res.status(500).json({ message: "unknown server error: " });
	}
};
