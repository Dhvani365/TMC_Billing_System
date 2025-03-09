import express from "express";
import { getGST, getGSTBySKU, addGST, updateGST, deleteGST } from "../controllers/gst.controller.js";

const router = express.Router();

router.get("/", getGST);
router.get("/:sku_id", getGSTBySKU);
router.post("/add", addGST);
router.put("/update/:sku_id", updateGST);
router.delete("/delete/:sku_id", deleteGST);

export default router;
