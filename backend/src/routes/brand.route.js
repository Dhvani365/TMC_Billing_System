import express from "express";
import { getBrands, getBrandById, addBrand, updateBrand, deleteBrand,updateBrandImage } from "../controllers/brand.controller.js";
import upload from "../middlewares/upload.middleware.js"

const router = express.Router();

router.get("/", getBrands);
router.get("/:id", getBrandById);
router.post("/add",addBrand);
router.put("/update/:id", updateBrand); //Check If they are updating image or not if they are use UpdateImage route
router.delete("/delete/:id", deleteBrand);

export default router;
