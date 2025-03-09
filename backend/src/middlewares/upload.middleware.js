import multer from "multer"

// Multer Setup (Stores file in RAM first)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;