import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();

export const generateToken = (userId: string) => {
	const payload = { id: userId };
	return jwt.sign(payload, process.env.JWT_SECRET as string, {
		expiresIn: "1h",
	});
};

export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({ message: "Unauthorized: No token provided" });
	}

	token = token.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

		if (typeof decoded !== "string" && decoded.id) {
			req.body.userId = decoded.id; // Attach userId to the request object
			next(); // Continue to the next middleware or route
		}
	} catch (error) {
		return res.status(401).json({ message: "Unauthorized: Invalid token" });
	}
};
