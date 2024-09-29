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
// export const getUserByUsername = async (req: Request, res: Response) => {
// 	try {
// 		const { username } = req.query;
// 		console.log("Received username:", username);

// 		// Ensure username is present
// 		if (!username || typeof username !== "string") {
// 			return res
// 				.status(400)
// 				.json({ message: "Username query parameter is required." });
// 		}

// 		// Use regex to search for username
// 		const query = { username: { $regex: username, $options: "i" } };
// 		const users = await User.find(query);

// 		// Check if users were found
// 		if (users.length === 0) {
// 			return res
// 				.status(404)
// 				.json({ message: `No users found with the username "${username}"` });
// 		}

// 		// Return found users
// 		res.json({ msg: "worked" });
// 	} catch (err) {
// 		console.error("Server error:", err); // Log the full error for debugging
// 		if (err instanceof Error) {
// 			return res.status(500).json({ message: "Server error: " + err.message });
// 		}
// 		res.status(500).json({ message: "Unknown server error" });
// 	}
// };

export const getUserByUsername = async (req: Request, res: Response) => {
	try {
		const { username } = req.query;
		console.log("Received username:", username);

		// Ensure username is present and is a string
		if (!username || typeof username !== "string") {
			return res
				.status(400)
				.json({ message: "Username query parameter is required." });
		}

		// Use regex to search for username
		const query = { username: { $regex: username, $options: "i" } };
		const users = await User.find(query);

		// Check if users were found
		if (users.length === 0) {
			return res
				.status(404)
				.json({ message: `No users found with the username "${username}"` });
		}

		// Return found users
		res.json(users);
	} catch (err) {
		console.error("Server error:", err);
		if (err instanceof Error) {
			return res.status(500).json({ message: "Server error: " + err.message });
		}
		res.status(500).json({ message: "Unknown server error" });
	}
};

// Get authenticated user profile
export const getProfile = async (req: Request, res: Response) => {
	try {
		const userId = req.body.userId;

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
export const getOtherUsersProfile = async (req: Request, res: Response) => {
	try {
		const params = req.params;
		console.log("this is getOtherUsersProfile");

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
	const userId = req.body.userId;
	try {
		const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
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

export const updateUserProfilePicture = async (req: Request, res: Response) => {
	const { imageUrl: profilePicture, userId } = req.body;
	try {
		const user = await User.findByIdAndUpdate(
			userId,
			{ profilePicture },
			{ new: true }
		);
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
		const userId = req.body.userId;
		const user = await User.findByIdAndDelete(userId);
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

// Get followers for a user
export const getFollowers = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.id).populate("followers");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json({ followers: user.followers });
	} catch (error) {
		console.error("Error fetching followers:", error);
		res.status(500).json({ message: "Error fetching followers" });
	}
};

// Get following for a user
export const getFollowing = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.id).populate("following");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json({ following: user.following });
	} catch (error) {
		res.status(500).json({ message: "Error fetching following" });
	}
};
