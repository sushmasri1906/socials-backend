import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";

type CloudinaryImage = {
	asset_id: string;
	public_id: string;
	version: number;
	version_id: string;
	signature: string;
	width: number;
	height: number;
	format: string;
	resource_type: string;
	created_at: string; // ISO 8601 format
	tags: string[];
	bytes: number;
	type: string;
	etag: string;
	placeholder: boolean;
	url: string;
	secure_url: string;
	asset_folder: string;
	display_name: string;
	overwritten: boolean;
	original_filename: string;
	api_key: string;
};

export const uploadImage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		console.log(req.body);
		const { userId } = req.body;
		const file = req.file;
		const now = new Date();
		console.log(now);

		if (!file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		// Use Cloudinary's upload_stream method to upload the file from memory
		const streamUpload = () => {
			return new Promise((resolve, reject) => {
				const stream = cloudinary.uploader.upload_stream(
					{ public_id: `${userId + now}`, folder: userId },
					(error, result) => {
						if (result) {
							resolve(result);
						} else {
							reject(error);
						}
					}
				);
				stream.end(file.buffer); // End the stream with the file buffer
			});
		};

		const result: CloudinaryImage = (await streamUpload()) as CloudinaryImage;
		req.body.imageUrl = result.secure_url;
		next();
	} catch (error) {
		console.error("Upload error:", error);
		return res.status(500).json({ error: "Failed to upload image" });
	}
};
