import multer from "multer";

// Setup Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
