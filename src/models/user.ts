import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	profilePicture: {
		type: String,
		default:
			"https://res.cloudinary.com/dgulr1hgd/image/upload/v1727600029/t6o0xcphlldbcyxtkfso.jpg",
	},
	bio: {
		type: String,
		maxLength: 150,
		default: "",
	},
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	following: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
	],
});

const User = mongoose.model("User", userSchema);

export default User;
