import express from "express";
import { getPricing, getAllSKUPricingForBill, getPricingByBrand, addPricing, updatePricing, deletePricing } from "../controllers/pricing.controller.js";

const router = express.Router();

router.get("/:party_id/:brand_id/:catalog_id/:sku_id", getPricing);
router.get("/party/:party_id/brand/:brand_id/catalog/:catalog_id", getAllSKUPricingForBill);
// router.get("/:brand_id", getPricingByBrand);
// router.post("/add", addPricing);
// router.put("/update/:brand_id", updatePricing);
// router.delete("/delete/:brand_id", deletePricing);

export default router;
