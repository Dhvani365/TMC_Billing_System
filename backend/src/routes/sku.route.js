import express from "express";
import { getSKUById, addSKU, updateSKU, deleteSKU, getSKUsByCatalog, updateSKUImage } from "../controllers/sku.controller.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Use `upload.any()` to handle multiple files for SKUs
router.post("/add", upload.any(), addSKU);

// router.post("/add", upload.any(), (req, res) => {
//     console.log("Request Body:", req.body);
//     console.log("Request Files:", req.files);
//     res.status(200).send("Files received");
// });

// router.get("/", getSKUs);
router.get("/:id", getSKUById);
router.put("/update/:id", updateSKU); // Check if they are updating the image or not; if they are, use the UpdateImage route
router.post("/updateImage/:id", upload.single("image"), updateSKUImage);
router.delete("/delete/:id", deleteSKU);
router.get("/catalog/:catalogId", getSKUsByCatalog);

export default router;