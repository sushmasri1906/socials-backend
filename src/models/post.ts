import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		caption: {
			type: String,
			maxLength: 2200,
			default: "",
		},
		imageUrl: {
			type: String,
			required: true,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

		comments: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				text: {
					type: String,
					required: true,
				},
				profileId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				profileImage: String,
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],

		location: {
			type: String,
			default: "",
		},
		taggedUsers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
	}
);

// Create and export the Post model
const Post = mongoose.model("Post", postSchema);

export default Post;
