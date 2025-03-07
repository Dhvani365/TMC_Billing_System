import express from "express";
import { getPricing, getPricingByBrand, addPricing, updatePricing, deletePricing } from "../controllers/pricing.controller.js";

const router = express.Router();

router.get("/", getPricing);
router.get("/:brand_id", getPricingByBrand);
router.post("/add", addPricing);
router.put("/update/:brand_id", updatePricing);
router.delete("/delete/:brand_id", deletePricing);

export default router;
