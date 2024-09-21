import bcrypt from "bcrypt";
import User from "../models/user";

import { generateToken } from "../middlewear/middlewear";
import { Request, Response } from "express";

// Register a new user
export const register = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	try {
		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const newUser = new User({ username, email, password: hashedPassword });
		const savedUser = await newUser.save();

		res.status(201).json({
			message: "User registered successfully",
			user: savedUser,
		});
	} catch (error) {
		if (error instanceof Error)
			res
				.status(500)
				.json({ message: "Error while Registring", error: error.message });
		res
			.status(500)
			.json({ message: "Error while Registring", error: "Unknown error" });
	}
};

// Login a user
export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	try {
		// Find the user
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Check if password is valid
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Generate a token
		const token = generateToken(user._id.toString());

		res.json({
			message: "Logged in successfully",
			token,
			userId: user._id,
		});
	} catch (error) {
		if (error instanceof Error)
			res
				.status(500)
				.json({ message: "Error logging in", error: error.message });
		res
			.status(500)
			.json({ message: "Error logging in", error: "Unknown error" });
	}
};
