import express from "express";
import { getBrands, getBrandById, addBrand, updateBrand, deleteBrand } from "../controllers/brand.controller.js";
import upload from "../middlewares/upload.middleware.js"

const router = express.Router();

router.get("/", getBrands);
router.get("/:id", getBrandById);
router.post("/add", upload.single("image") ,addBrand);
router.put("/update/:id", updateBrand);
router.delete("/delete/:id", deleteBrand);

export default router;
