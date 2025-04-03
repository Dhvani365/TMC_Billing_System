import express from "express";
import { getSKUs, getSKUById, addSKU, updateSKU, deleteSKU , getSKUsByCatalog, updateSKUImage } from "../controllers/sku.controller.js";
import upload from "../middlewares/upload.middleware.js"

const router = express.Router();

// router.get("/", getSKUs);
router.get("/:id", getSKUById);
router.post("/add",upload.single("image"), addSKU);
router.put("/update/:id", updateSKU); //Check If they are updating image or not if they are use UpdateImage route
router.post("/updateImage/:id", upload.single("image"), updateSKUImage); 
router.delete("/delete/:id", deleteSKU);
router.get("/catalog/:catalogId", getSKUsByCatalog);

export default router;
