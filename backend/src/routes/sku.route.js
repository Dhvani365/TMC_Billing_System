import express from "express";
import { getSKUs, getSKUById, addSKU, updateSKU, deleteSKU , getSKUsByBrandAndCatalog, updateSKUImage } from "../controllers/sku.controller.js";
import upload from "../middlewares/upload.middleware.js"

const router = express.Router();

router.get("/", getSKUs);
router.get("/:id", getSKUById);
router.post("/add",upload.single("image"), addSKU);
router.put("/update/:id", updateSKU);
router.post("/updateImage/:id", upload.single("image"), updateSKUImage);
router.delete("/delete/:id", deleteSKU);
router.get("/catalog/:catalogId", getSKUsByBrandAndCatalog);

export default router;
