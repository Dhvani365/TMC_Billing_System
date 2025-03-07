import express from "express";
import { getSKUs, getSKUById, addSKU, updateSKU, deleteSKU } from "../controllers/sku.controller.js";
import upload from "../middlewares/upload.middleware.js"

const router = express.Router();

router.get("/", getSKUs);
router.get("/:id", getSKUById);
router.post("/add",upload.single("image"), addSKU);
router.put("/update/:id", updateSKU);
router.delete("/delete/:id", deleteSKU);

export default router;
