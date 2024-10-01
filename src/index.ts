import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import dotenv from "dotenv";
import cors from "cors";
import { verifyToken } from "./middlewear/middlewear";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());

//middlewears
app.use(express.json());
app.use(morgan("common"));
app.use(helmet());

//routes
app.use("/ig/user", verifyToken, userRoutes);
app.use("/ig/auth", authRoutes);
app.use("/ig/posts", verifyToken, postRoutes);

const connectToDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI as string);
		console.log("Connected to MongoDB");
	} catch (e) {
		console.log(e);
	}
};

// Connect to MongoDB
connectToDatabase();

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.get("/ping", (req, res) => {
	res.status(200).send("Server is up and running");
});
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
